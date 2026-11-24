// Validates and cleans site content before it is stored or published.
// Used by the content server on every save, so the public site only ever
// receives well-formed content and sanitised rich text.

const SERVICE_IDS = ["design", "hosting", "email", "support", "telephony"];

function str(value, max = 400, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}
function bool(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
function list(value, max = 50) {
  return Array.isArray(value) ? value.slice(0, max) : [];
}
function obj(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}
function price(value) {
  if (value === null || value === "" || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return null;
  return Math.round(n * 100) / 100;
}
function safeUrl(value, max = 500) {
  const url = str(value, max);
  if (!url) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url) && !/^\/\//.test(url))
    return url;
  return "";
}
function slug(value, fallback) {
  const s = str(value, 60)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || fallback;
}

// Tracking/analytics snippets: only external https scripts are accepted. Each
// <script src="https://…"> tag is reduced to its src plus a small allow-list of
// attributes (defer, async, crossorigin, id, data-*). Inline code is dropped.
export function parseTrackingScripts(snippet) {
  const out = [];
  const tags = String(snippet || "").match(/<script\b[^>]*>/gi) || [];
  for (const tag of tags.slice(0, 5)) {
    const attrs = {};
    const re =
      /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let m;
    const body = tag.replace(/^<script/i, "").replace(/\/?>$/, "");
    while ((m = re.exec(body))) {
      const name = m[1].toLowerCase();
      const value = m[2] ?? m[3] ?? m[4] ?? "";
      if (name === "src") attrs.src = value.trim();
      else if (name === "defer" || name === "async") attrs[name] = "";
      else if (
        (name === "crossorigin" ||
          name === "id" ||
          /^data-[a-z0-9-]{1,40}$/.test(name)) &&
        value.length <= 200
      )
        attrs[name] = value;
    }
    let url;
    try {
      url = new URL(attrs.src || "");
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.href.length > 500) continue;
    attrs.src = url.href;
    out.push(attrs);
  }
  return out;
}

const ENTITY = /^&(#\d{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,31});/i;
function escapeText(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "&") {
      const m = text.slice(i).match(ENTITY);
      out += m ? "&" : "&amp;";
    } else if (c === "<") out += "&lt;";
    else if (c === ">") out += "&gt;";
    else if (c === '"') out += "&quot;";
    else out += c;
  }
  return out;
}

const ALLOWED = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
]);
const ALLOWED_FULL = new Set([
  ...ALLOWED,
  "h2",
  "h3",
  "h4",
  "blockquote",
  "hr",
  "img",
  "pre",
  "code",
  "figure",
  "figcaption",
]);
const VOID = new Set(["br", "hr", "img"]);
const RENAME = { b: "strong", i: "em", h1: "h2" };

function attr(raw, name) {
  const m = raw.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return m ? (m[2] ?? m[3] ?? m[4] ?? "").replace(/&amp;/g, "&") : "";
}

/**
 * Keeps a small set of formatting tags; strips everything else.
 * `full` also allows headings, quotes, images, rules and code (pages and posts).
 */
export function sanitizeRichText(input, max = 6000, full = false) {
  if (typeof input !== "string") return "";
  let html = input
    .slice(0, max * 2)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|iframe|object|embed|template|svg|math|noscript|textarea|select)\b[\s\S]*?<\/\1\s*>/gi,
      "",
    )
    .replace(
      /<(script|style|iframe|object|embed|template|svg|math)\b[^>]*>/gi,
      "",
    );
  html = html.replace(/<div\b[^>]*>/gi, "<p>").replace(/<\/div\s*>/gi, "</p>");
  const out = [];
  const open = [];
  const re = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    out.push(escapeText(html.slice(last, m.index)));
    last = re.lastIndex;
    const closing = m[1] === "/";
    let tag = m[2].toLowerCase();
    tag = (full && RENAME[tag]) || (tag === "h1" ? tag : RENAME[tag]) || tag;
    if (!(full ? ALLOWED_FULL : ALLOWED).has(tag)) continue;
    if (VOID.has(tag)) {
      if (closing) continue;
      if (tag === "img") {
        const src = safeUrl(attr(m[3], "src"));
        if (!src || /^(mailto|tel|#)/i.test(src)) continue;
        out.push(
          `<img src="${escapeText(src)}" alt="${escapeText(attr(m[3], "alt").slice(0, 200))}" loading="lazy">`,
        );
      } else out.push(`<${tag}>`);
      continue;
    }
    if (closing) {
      const idx = open.lastIndexOf(tag);
      if (idx === -1) continue;
      while (open.length > idx) out.push(`</${open.pop()}>`);
      continue;
    }
    if (tag === "a") {
      const url = safeUrl(attr(m[3], "href"));
      if (!url) continue;
      const external = /^https?:/i.test(url);
      out.push(
        `<a href="${escapeText(url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`,
      );
    } else out.push(`<${tag}>`);
    open.push(tag);
  }
  out.push(escapeText(html.slice(last)));
  while (open.length) out.push(`</${open.pop()}>`);
  return out
    .join("")
    .replace(/<(p|h2|h3|h4)>(\s|<br>)*<\/\1>/g, "")
    .slice(0, max)
    .trim();
}

function plan(p) {
  p = obj(p);
  return {
    name: str(p.name, 80, "New package") || "New package",
    price: price(p.price),
    unit: str(p.unit, 40),
    description: str(p.description, 300),
    features: list(p.features, 20)
      .map((f) => str(f, 160))
      .filter(Boolean),
    featured: bool(p.featured),
    label: str(p.label, 40),
  };
}

function service(s, fallback) {
  s = obj(s);
  return {
    id: fallback.id,
    title: str(s.title, 60, fallback.title) || fallback.title,
    heading: str(s.heading, 160, fallback.heading),
    description: str(s.description, 400, fallback.description),
    plans: list(s.plans, 6).map(plan),
    note: str(s.note, 600, fallback.note),
  };
}

function textBlock(value, defaults, limits = {}) {
  const v = obj(value);
  const out = {};
  for (const [key, def] of Object.entries(defaults)) {
    if (typeof def === "string")
      out[key] = str(v[key], limits[key] || 400, def);
  }
  return out;
}

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "examples",
  "uploads",
  "brand",
  "assets",
  "images",
  "blog",
  "home",
];
export const BLOCK_TYPES = [
  "hero",
  "heading",
  "text",
  "image",
  "button",
  "cards",
  "quote",
  "pricing",
  "faq",
  "cta",
  "posts",
  "divider",
];

function unique(base, seen) {
  let id = base;
  let n = 2;
  while (seen.has(id)) id = `${base}-${n++}`;
  seen.add(id);
  return id;
}

function block(b, i, anchors) {
  b = obj(b);
  const type = BLOCK_TYPES.includes(b.type) ? b.type : "text";
  const base = {
    id: slug(b.id, `b${i + 1}`),
    type,
    anchor: b.anchor ? unique(slug(b.anchor, `section-${i + 1}`), anchors) : "",
  };
  switch (type) {
    case "hero":
      return {
        ...base,
        eyebrow: str(b.eyebrow, 80),
        heading: str(b.heading, 160),
        text: str(b.text, 600),
        buttonLabel: str(b.buttonLabel, 60),
        buttonLink: safeUrl(b.buttonLink),
        image: safeUrl(b.image),
      };
    case "heading":
      return { ...base, text: str(b.text, 160), level: b.level === 3 ? 3 : 2 };
    case "text":
      return { ...base, html: sanitizeRichText(b.html, 30000, true) };
    case "image":
      return {
        ...base,
        src: safeUrl(b.src),
        alt: str(b.alt, 200),
        caption: str(b.caption, 200),
        wide: bool(b.wide),
      };
    case "button":
      return {
        ...base,
        label: str(b.label, 60, "Find out more"),
        link: safeUrl(b.link),
        style: b.style === "outline" ? "outline" : "primary",
      };
    case "cards":
      return {
        ...base,
        heading: str(b.heading, 160),
        items: list(b.items, 6).map((c) => ({
          title: str(obj(c).title, 80),
          text: str(obj(c).text, 300),
          link: safeUrl(obj(c).link),
        })),
      };
    case "quote":
      return { ...base, text: str(b.text, 600), cite: str(b.cite, 120) };
    case "pricing":
      return {
        ...base,
        heading: str(b.heading, 160),
        service: SERVICE_IDS.includes(b.service) ? b.service : "hosting",
      };
    case "faq":
      return {
        ...base,
        heading: str(b.heading, 160),
        ids: list(b.ids, 40)
          .map((x) => slug(x, ""))
          .filter(Boolean),
      };
    case "cta":
      return {
        ...base,
        heading: str(b.heading, 160),
        text: str(b.text, 300),
        buttonLabel: str(b.buttonLabel, 60, "Free consultation"),
        buttonLink: safeUrl(b.buttonLink),
      };
    case "posts":
      return {
        ...base,
        heading: str(b.heading, 160),
        count: Math.min(12, Math.max(1, Math.round(Number(b.count) || 3))),
        tag: str(b.tag, 40),
      };
    default:
      return base;
  }
}

function page(pg, i, slugs) {
  pg = obj(pg);
  const anchors = new Set();
  let s = slug(pg.slug || pg.title, `page-${i + 1}`);
  if (RESERVED_SLUGS.includes(s)) s = `${s}-page`;
  return {
    id: slug(pg.id, `p${i + 1}`),
    slug: unique(s, slugs),
    title: str(pg.title, 120, "Untitled page") || "Untitled page",
    description: str(pg.description, 300),
    visible: bool(pg.visible, true),
    blocks: list(pg.blocks, 60).map((b, j) => block(b, j, anchors)),
  };
}

function isoDate(value) {
  const v = str(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v))
    ? v
    : new Date().toISOString().slice(0, 10);
}

function post(p, i, slugs) {
  p = obj(p);
  return {
    id: slug(p.id, `post-${i + 1}`),
    slug: unique(slug(p.slug || p.title, `post-${i + 1}`), slugs),
    title: str(p.title, 160, "Untitled post") || "Untitled post",
    excerpt: str(p.excerpt, 400),
    author: str(p.author, 80),
    date: isoDate(p.date),
    tags: list(p.tags, 8)
      .map((t) => str(t, 30))
      .filter(Boolean),
    cover: safeUrl(p.cover),
    coverAlt: str(p.coverAlt, 200),
    body: sanitizeRichText(p.body, 60000, true),
    visible: bool(p.visible, true),
    featured: bool(p.featured),
  };
}

function menu(items, fallback) {
  return (Array.isArray(items) ? items : fallback)
    .slice(0, 12)
    .map((m) => ({ label: str(obj(m).label, 40), href: safeUrl(obj(m).href) }))
    .filter((m) => m.label && m.href);
}

/** Returns a complete, cleaned content document. Missing parts fall back to defaults. */
export function normalizeContent(input, defaults) {
  const c = obj(input);
  const d = defaults;
  const brandIn = obj(c.brand);
  const sectionsIn = obj(c.sections);
  const servicesIn = list(c.services, 10);
  const projectsIn = Array.isArray(c.projects) ? c.projects : d.projects;
  const faqsIn = Array.isArray(c.faqs) ? c.faqs : d.faqs;
  const seen = new Set();
  const faqIds = new Set();
  const pageSlugs = new Set();
  const postSlugs = new Set();

  return {
    version: 1,
    brand: {
      ...textBlock(brandIn, d.brand, { intro: 500 }),
      headline: [0, 1].map((i) =>
        str(list(brandIn.headline)[i], 80, d.brand.headline[i]),
      ),
      consultationMinutes: Math.min(
        240,
        Math.max(5, Math.round(Number(brandIn.consultationMinutes) || 30)),
      ),
      email: str(brandIn.email, 254),
      phone: str(brandIn.phone, 40),
    },
    seo: textBlock(c.seo, d.seo, { description: 300 }),
    settings: {
      announcement: {
        enabled: bool(obj(obj(c.settings).announcement).enabled),
        text: str(obj(obj(c.settings).announcement).text, 200),
        link: safeUrl(obj(obj(c.settings).announcement).link),
      },
      showChat: bool(obj(c.settings).showChat, true),
      analytics: (() => {
        const raw = obj(c.settings).analytics;
        const a = raw === undefined ? obj(obj(d.settings).analytics) : obj(raw);
        const snippet = str(a.snippet, 2000);
        return {
          enabled: bool(a.enabled),
          snippet,
          scripts: parseTrackingScripts(snippet),
        };
      })(),
    },
    sections: {
      services: textBlock(sectionsIn.services, d.sections.services),
      projects: textBlock(sectionsIn.projects, d.sections.projects, {
        intro: 600,
        disclaimer: 400,
      }),
      about: {
        ...textBlock(sectionsIn.about, d.sections.about, { body: 800 }),
        locations: (Array.isArray(obj(sectionsIn.about).locations)
          ? obj(sectionsIn.about).locations
          : d.sections.about.locations
        )
          .slice(0, 8)
          .map((l) => str(l, 40))
          .filter(Boolean),
        benefits: (Array.isArray(obj(sectionsIn.about).benefits)
          ? obj(sectionsIn.about).benefits
          : d.sections.about.benefits
        )
          .slice(0, 3)
          .map((b) => ({
            title: str(obj(b).title, 80),
            body: str(obj(b).body, 300),
          })),
      },
      process: {
        ...textBlock(sectionsIn.process, d.sections.process),
        steps: (Array.isArray(obj(sectionsIn.process).steps)
          ? obj(sectionsIn.process).steps
          : d.sections.process.steps
        )
          .slice(0, 3)
          .map((s) => ({
            title: str(obj(s).title, 80),
            body: str(obj(s).body, 300),
          })),
      },
      faq: textBlock(sectionsIn.faq, d.sections.faq),
      cta: textBlock(sectionsIn.cta, d.sections.cta),
    },
    services: SERVICE_IDS.map((id) => {
      const fallback = d.services.find((s) => s.id === id);
      const found = servicesIn.find((s) => obj(s).id === id);
      return found ? service(found, fallback) : fallback;
    }).sort((a, b) => {
      const pos = (id) => {
        const i = servicesIn.findIndex((s) => obj(s).id === id);
        return i < 0 ? 99 : i;
      };
      return pos(a.id) - pos(b.id);
    }),
    logoPackage: {
      price: price(obj(c.logoPackage).price),
      title: str(obj(c.logoPackage).title, 120, d.logoPackage.title),
      description: str(
        obj(c.logoPackage).description,
        400,
        d.logoPackage.description,
      ),
    },
    projects: projectsIn.slice(0, 24).map((p, i) => {
      p = obj(p);
      let id = slug(p.id, `project-${i + 1}`);
      while (seen.has(id)) id += "-2";
      seen.add(id);
      return {
        id,
        type: str(p.type, 60, "Website") || "Website",
        name: str(p.name, 120),
        description: str(p.description, 400),
        image: safeUrl(p.image) || "/images/project-business.webp",
        url: safeUrl(p.url),
        visible: bool(p.visible, true),
      };
    }),
    faqs: faqsIn
      .slice(0, 40)
      .map((f) => ({
        // Questions saved before ids existed reuse the default id for the same question.
        id:
          obj(f).id ||
          (d.faqs || []).find((x) => x.question === str(obj(f).question, 200))
            ?.id,
        question: str(obj(f).question, 200),
        answer: sanitizeRichText(obj(f).answer),
      }))
      .filter((f) => f.question)
      .map((f) => ({
        ...f,
        // Stable id so other pages can link to a specific question.
        id: unique(
          slug(
            f.id || f.question.split(/\s+/).slice(0, 6).join("-"),
            "question",
          ),
          faqIds,
        ),
      })),
    pages: (Array.isArray(c.pages) ? c.pages : d.pages || [])
      .slice(0, 60)
      .map((pg, i) => page(pg, i, pageSlugs)),
    blog: {
      title: str(obj(c.blog).title, 80, d.blog?.title || "Blog") || "Blog",
      intro: str(obj(c.blog).intro, 400, d.blog?.intro || ""),
      enabled: bool(obj(c.blog).enabled, d.blog?.enabled ?? true),
    },
    posts: (Array.isArray(c.posts) ? c.posts : d.posts || [])
      .slice(0, 300)
      .map((p, i) => post(p, i, postSlugs))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    menus: {
      header: menu(obj(c.menus).header, d.menus?.header || []),
      footer: menu(obj(c.menus).footer, d.menus?.footer || []),
    },
  };
}
