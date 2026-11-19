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
const RENAME = { b: "strong", i: "em" };

/** Keeps a small set of formatting tags; strips everything else. */
export function sanitizeRichText(input, max = 6000) {
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
    if (!ALLOWED.has(tag)) continue;
    tag = RENAME[tag] || tag;
    if (tag === "br") {
      out.push("<br>");
      continue;
    }
    if (closing) {
      const idx = open.lastIndexOf(tag);
      if (idx === -1) continue;
      while (open.length > idx) out.push(`</${open.pop()}>`);
      continue;
    }
    if (tag === "a") {
      const href = (
        m[3].match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i) || []
      )
        .slice(2)
        .find((v) => v !== undefined);
      const url = safeUrl((href || "").replace(/&amp;/g, "&"));
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
    .replace(/<p>(\s|<br>)*<\/p>/g, "")
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
        question: str(obj(f).question, 200),
        answer: sanitizeRichText(obj(f).answer),
      }))
      .filter((f) => f.question),
  };
}
