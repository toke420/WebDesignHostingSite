#!/usr/bin/env node
// WebTechPros content server: stores site content, serves it to the public
// site, and powers the /admin editor (draft, publish, history, image uploads).
// Uses only Node.js built-ins. Run behind Nginx in production (see README).
import http from "node:http";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  readdirSync,
  rmSync,
  statSync,
  createReadStream,
} from "node:fs";
import { resolve, dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHmac,
  createHash,
} from "node:crypto";
import { normalizeContent } from "../content/schema.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const defaults = JSON.parse(
  readFileSync(resolve(root, "content/default-content.json"), "utf8"),
);

const dataDir = resolve(
  process.env.CONTENT_DATA_DIR || resolve(root, ".data/content"),
);
const staticDir = process.env.STATIC_DIR
  ? resolve(process.env.STATIC_DIR)
  : null;
const [host, port] = (process.env.CONTENT_ADDR || "127.0.0.1:8090").split(":");
const SESSION_HOURS = 12;
const MAX_VERSIONS = 30;

const paths = {
  published: join(dataDir, "published.json"),
  draft: join(dataDir, "draft.json"),
  admin: join(dataDir, "admin.json"),
  secret: join(dataDir, "secret"),
  versions: join(dataDir, "versions"),
  uploads: join(dataDir, "uploads"),
};

function writeAtomic(file, data, mode = 0o600) {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, data, { mode });
  renameSync(tmp, file);
}
function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

// ---------- Passwords ----------
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash, updatedAt: new Date().toISOString() };
}
function checkPassword(password) {
  const record = readJson(paths.admin, null);
  if (!record || typeof password !== "string") return false;
  const given = scryptSync(password, record.salt, 64);
  const stored = Buffer.from(record.hash, "hex");
  return given.length === stored.length && timingSafeEqual(given, stored);
}
export function setPassword(password) {
  if (typeof password !== "string" || password.length < 10)
    throw new Error("Use at least 10 characters for the admin password.");
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  writeAtomic(paths.admin, JSON.stringify(hashPassword(password)));
}

function init() {
  for (const dir of [dataDir, paths.versions, paths.uploads])
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  if (!existsSync(paths.secret))
    writeAtomic(paths.secret, randomBytes(32).toString("hex"));
  if (!existsSync(paths.published))
    writeAtomic(
      paths.published,
      JSON.stringify(normalizeContent(defaults, defaults)),
      0o644,
    );
  if (!existsSync(paths.draft))
    writeAtomic(paths.draft, readFileSync(paths.published));
  // Bring saved content up to the current format (adds new sections such as
  // pages, blog and menus with their defaults; keeps everything already edited).
  for (const [file, mode] of [
    [paths.published, 0o644],
    [paths.draft, 0o600],
  ]) {
    const before = readFileSync(file, "utf8");
    const after = JSON.stringify(
      normalizeContent(JSON.parse(before), defaults),
    );
    if (after !== before) writeAtomic(file, after, mode);
  }
  if (!existsSync(paths.admin)) {
    if (process.env.ADMIN_PASSWORD) setPassword(process.env.ADMIN_PASSWORD);
    else {
      const generated = randomBytes(15).toString("base64url");
      setPassword(generated);
      const file = join(dataDir, "initial-admin-password.txt");
      writeAtomic(file, `${generated}\n`);
      console.log(
        `Admin password created. Read it from ${file}, sign in, then change it and delete that file.`,
      );
    }
  }
}

// ---------- Sessions (signed, stateless) ----------
const secret = () => readFileSync(paths.secret, "utf8").trim();
function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}
function issueSession() {
  const admin = readJson(paths.admin, {});
  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + SESSION_HOURS * 3600e3,
      pw: admin.updatedAt,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
function validSession(req) {
  const cookie = (req.headers.cookie || "")
    .split(/;\s*/)
    .find((c) => c.startsWith("wtp_admin="));
  if (!cookie) return false;
  const [payload, sig] = cookie.slice(10).split(".");
  if (!payload || !sig) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given))
    return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    // Changing the password signs every existing session out.
    return (
      data.exp > Date.now() && data.pw === readJson(paths.admin, {}).updatedAt
    );
  } catch {
    return false;
  }
}
function isHttps(req) {
  return (
    process.env.CONTENT_SECURE_COOKIE === "true" ||
    req.headers["x-forwarded-proto"] === "https"
  );
}
function sessionCookie(req, value, maxAge) {
  return `wtp_admin=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isHttps(req) ? "; Secure" : ""}`;
}

// ---------- Login throttling ----------
const attempts = new Map();
function clientIp(req) {
  return (
    (process.env.TRUST_PROXY !== "false" && req.headers["x-real-ip"]) ||
    req.socket.remoteAddress ||
    "unknown"
  );
}
function throttled(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60e3);
  attempts.set(ip, list);
  return list.length >= 8;
}

// ---------- HTTP helpers ----------
function send(res, status, body, headers = {}) {
  const data =
    typeof body === "string" || Buffer.isBuffer(body)
      ? body
      : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    ...headers,
  });
  res.end(data);
}
function readBody(req, limit) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(
          Object.assign(new Error("That upload is too large."), {
            status: 413,
          }),
        );
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on("end", () => resolveBody(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
async function readJsonBody(req) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json"))
    throw Object.assign(new Error("Expected JSON."), { status: 415 });
  try {
    return JSON.parse(
      (await readBody(req, 6_000_000)).toString("utf8") || "{}",
    );
  } catch (error) {
    if (error.status) throw error;
    throw Object.assign(new Error("Invalid JSON."), { status: 400 });
  }
}
// Blocks cross-site requests to admin endpoints (in addition to SameSite cookies).
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function xml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function etag(buf) {
  return `"${createHash("sha1").update(buf).digest("base64url")}"`;
}

function listVersions() {
  return readdirSync(paths.versions)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse()
    .map((file) => {
      const meta = readJson(join(paths.versions, file), {}).meta || {};
      return {
        id: file.replace(/\.json$/, ""),
        publishedAt: meta.publishedAt,
        note: meta.note || "",
      };
    });
}
function saveVersion(content, note) {
  const publishedAt = new Date().toISOString();
  const id = publishedAt.replace(/[:.]/g, "-");
  writeAtomic(
    join(paths.versions, `${id}.json`),
    JSON.stringify({ meta: { publishedAt, note }, content }),
  );
  const all = readdirSync(paths.versions)
    .filter((f) => f.endsWith(".json"))
    .sort();
  for (const old of all.slice(0, Math.max(0, all.length - MAX_VERSIONS)))
    rmSync(join(paths.versions, old), { force: true });
}

const IMAGE_TYPES = {
  "image/png": {
    ext: ".png",
    magic: (b) =>
      b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  "image/jpeg": {
    ext: ".jpg",
    magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  "image/webp": {
    ext: ".webp",
    magic: (b) =>
      b.subarray(0, 4).toString() === "RIFF" &&
      b.subarray(8, 12).toString() === "WEBP",
  },
  "image/gif": {
    ext: ".gif",
    magic: (b) => b.subarray(0, 4).toString() === "GIF8",
  },
};
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".zip": "application/zip",
  ".txt": "text/plain; charset=utf-8",
};

function serveFile(res, file, cache) {
  const type = MIME[extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": statSync(file).size,
    "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(file).pipe(res);
}
function safeJoin(base, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const target = normalize(join(base, decoded));
  return target === base || target.startsWith(base + sep) ? target : null;
}

// ---------- Routes ----------
async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  const method = req.method;

  if (path === "/healthz") return send(res, 200, { ok: true });

  if (
    (path === "/sitemap.xml" || path === "/blog/rss.xml") &&
    method === "GET"
  ) {
    const site = readJson(paths.published, defaults);
    const proto = isHttps(req) ? "https" : "http";
    const origin = `${proto}://${req.headers["x-forwarded-host"] || req.headers.host}`;
    const posts = site.blog.enabled ? site.posts.filter((p) => p.visible) : [];
    if (path === "/sitemap.xml") {
      const urls = [
        "/",
        ...site.pages.filter((p) => p.visible).map((p) => `/${p.slug}`),
        ...(site.blog.enabled ? ["/blog"] : []),
        ...posts.map((p) => `/blog/${p.slug}`),
      ];
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map((u) => `  <url><loc>${xml(origin + u)}</loc></url>`)
        .join("\n")}\n</urlset>\n`;
      return send(res, 200, body, {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-cache",
      });
    }
    if (!site.blog.enabled) return send(res, 404, { error: "Not found." });
    const items = posts
      .slice(0, 30)
      .map(
        (p) => `  <item>
    <title>${xml(p.title)}</title>
    <link>${xml(`${origin}/blog/${p.slug}`)}</link>
    <guid isPermaLink="true">${xml(`${origin}/blog/${p.slug}`)}</guid>
    <pubDate>${new Date(`${p.date}T09:00:00+10:00`).toUTCString()}</pubDate>
${p.tags.map((t) => `    <category>${xml(t)}</category>`).join("\n")}
    <description>${xml(p.excerpt)}</description>
  </item>`,
      )
      .join("\n");
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xml(`${site.blog.title} | ${site.brand.name}`)}</title>
  <link>${xml(`${origin}/blog`)}</link>
  <atom:link href="${xml(`${origin}/blog/rss.xml`)}" rel="self" type="application/rss+xml"/>
  <description>${xml(site.blog.intro)}</description>
  <language>en-au</language>
${items}
</channel>
</rss>
`;
    return send(res, 200, body, {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-cache",
    });
  }

  if (path === "/api/content" && (method === "GET" || method === "HEAD")) {
    const buf = readFileSync(paths.published);
    const tag = etag(buf);
    if (req.headers["if-none-match"] === tag)
      return send(res, 304, "", { ETag: tag });
    return send(res, 200, buf, { ETag: tag, "Cache-Control": "no-cache" });
  }

  if (path.startsWith("/uploads/") && method === "GET") {
    const file = safeJoin(paths.uploads, path.slice(9));
    if (!file || !existsSync(file) || !statSync(file).isFile())
      return send(res, 404, { error: "Not found." });
    return serveFile(res, file, "public, max-age=31536000, immutable");
  }

  if (path.startsWith("/api/admin/")) {
    res.setHeader("Cache-Control", "no-store");
    const action = path.slice(11);
    if (method !== "GET" && !sameOrigin(req))
      return send(res, 403, {
        error:
          "This request was blocked for your security. Reload the page and try again.",
      });

    if (action === "login" && method === "POST") {
      const ip = clientIp(req);
      if (throttled(ip))
        return send(res, 429, {
          error: "Too many sign-in attempts. Wait 15 minutes and try again.",
        });
      const body = await readJsonBody(req);
      if (!checkPassword(body.password)) {
        attempts.get(ip).push(Date.now());
        return send(res, 401, { error: "That password is not correct." });
      }
      attempts.delete(ip);
      return send(
        res,
        200,
        { ok: true },
        {
          "Set-Cookie": sessionCookie(
            req,
            issueSession(),
            SESSION_HOURS * 3600,
          ),
        },
      );
    }
    if (action === "logout" && method === "POST")
      return send(
        res,
        200,
        { ok: true },
        { "Set-Cookie": sessionCookie(req, "", 0) },
      );
    if (action === "session" && method === "GET")
      return send(res, 200, { authenticated: validSession(req) });

    if (!validSession(req))
      return send(res, 401, { error: "Please sign in again." });

    if (action === "draft" && method === "GET") {
      const draft = readJson(paths.draft, defaults);
      const published = readFileSync(paths.published, "utf8");
      return send(res, 200, {
        content: draft,
        hasUnpublished:
          JSON.stringify(draft) !== JSON.stringify(JSON.parse(published)),
      });
    }
    if (action === "draft" && method === "PUT") {
      const body = await readJsonBody(req);
      const clean = normalizeContent(body.content, defaults);
      writeAtomic(paths.draft, JSON.stringify(clean));
      return send(res, 200, {
        content: clean,
        savedAt: new Date().toISOString(),
      });
    }
    if (action === "publish" && method === "POST") {
      const body = await readJsonBody(req);
      const content = body.content
        ? normalizeContent(body.content, defaults)
        : readJson(paths.draft, defaults);
      writeAtomic(paths.draft, JSON.stringify(content));
      // Keep the outgoing version so it can be restored later.
      saveVersion(readJson(paths.published, defaults), "Before publishing");
      writeAtomic(paths.published, JSON.stringify(content), 0o644);
      return send(res, 200, { content, publishedAt: new Date().toISOString() });
    }
    if (action === "discard" && method === "POST") {
      writeAtomic(paths.draft, readFileSync(paths.published));
      return send(res, 200, { content: readJson(paths.published, defaults) });
    }
    if (action === "reset-defaults" && method === "POST") {
      const content = normalizeContent(defaults, defaults);
      writeAtomic(paths.draft, JSON.stringify(content));
      return send(res, 200, { content });
    }
    if (action === "versions" && method === "GET")
      return send(res, 200, { versions: listVersions() });
    const restore = action.match(/^versions\/([\w-]+)\/restore$/);
    if (restore && method === "POST") {
      const file = join(paths.versions, `${restore[1]}.json`);
      if (!existsSync(file))
        return send(res, 404, { error: "That version no longer exists." });
      const content = normalizeContent(readJson(file, {}).content, defaults);
      writeAtomic(paths.draft, JSON.stringify(content));
      return send(res, 200, { content });
    }
    const view = action.match(/^versions\/([\w-]+)$/);
    if (view && method === "GET") {
      const file = join(paths.versions, `${view[1]}.json`);
      if (!existsSync(file))
        return send(res, 404, { error: "That version no longer exists." });
      return send(res, 200, readJson(file, {}));
    }
    if (action === "upload" && method === "POST") {
      const type = String(req.headers["content-type"] || "").split(";")[0];
      const kind = IMAGE_TYPES[type];
      if (!kind)
        return send(res, 415, {
          error: "Upload a PNG, JPEG, WebP or GIF image.",
        });
      const buf = await readBody(req, 8 * 1024 * 1024);
      if (!kind.magic(buf))
        return send(res, 415, { error: "That file is not a valid image." });
      const name =
        createHash("sha256").update(buf).digest("hex").slice(0, 24) + kind.ext;
      writeFileSync(join(paths.uploads, name), buf, { mode: 0o644 });
      return send(res, 200, { url: `/uploads/${name}` });
    }
    if (action === "uploads" && method === "GET") {
      const files = readdirSync(paths.uploads)
        .filter((f) => /\.(png|jpg|webp|gif)$/.test(f))
        .map((f) => ({
          url: `/uploads/${f}`,
          time: statSync(join(paths.uploads, f)).mtimeMs,
        }))
        .sort((a, b) => b.time - a.time);
      return send(res, 200, { files });
    }
    if (action === "password" && method === "POST") {
      const body = await readJsonBody(req);
      if (!checkPassword(body.current))
        return send(res, 400, {
          error: "Your current password is not correct.",
        });
      try {
        setPassword(body.next);
      } catch (error) {
        return send(res, 400, { error: error.message });
      }
      rmSync(join(dataDir, "initial-admin-password.txt"), { force: true });
      return send(
        res,
        200,
        { ok: true },
        {
          "Set-Cookie": sessionCookie(
            req,
            issueSession(),
            SESSION_HOURS * 3600,
          ),
        },
      );
    }
    return send(res, 404, { error: "Not found." });
  }

  // Optional: serve the built site directly (e.g. `npm start`).
  if (staticDir && (method === "GET" || method === "HEAD")) {
    let file = safeJoin(staticDir, path);
    if (file && existsSync(file) && statSync(file).isDirectory())
      file = join(file, "index.html");
    if (!file || !existsSync(file)) {
      if (path === "/admin") return send(res, 301, "", { Location: "/admin/" });
      file = path.startsWith("/admin/")
        ? join(staticDir, "admin/index.html")
        : join(staticDir, "index.html");
    }
    return serveFile(
      res,
      file,
      path.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    );
  }
  return send(res, 404, { error: "Not found." });
}

function start() {
  init();
  const server = http.createServer((req, res) => {
    handle(req, res).catch((error) => {
      if (!res.headersSent)
        send(res, error.status || 500, {
          error: error.status
            ? error.message
            : "Something went wrong. Please try again.",
        });
      if (!error.status) console.error(error);
    });
  });
  server.listen(Number(port), host, () =>
    console.log(
      `Content server listening on http://${host}:${port} (data: ${dataDir})`,
    ),
  );
  const stop = () => server.close(() => process.exit(0));
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

if (process.argv[2] === "set-password") {
  const fromEnv = process.env.NEW_ADMIN_PASSWORD;
  const done = (pw) => {
    try {
      setPassword(pw.trim());
      console.log("Admin password updated. Existing sessions are signed out.");
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  };
  if (fromEnv) done(fromEnv);
  else {
    process.stdout.write("New admin password (min 10 characters): ");
    process.stdin.once("data", (d) => {
      done(d.toString());
      process.stdin.pause();
    });
  }
} else start();
