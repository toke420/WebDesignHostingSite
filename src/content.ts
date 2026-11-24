// Site content model. The live copy is edited at /admin and served by the
// content server (/api/content). content/default-content.json is the fallback
// used before anything is published, or if the content server is unreachable.
// A null price displays "Request a quote" rather than inventing a price.
import defaults from "../content/default-content.json";

export type ServiceId =
  "design" | "hosting" | "email" | "support" | "telephony";
export type Plan = {
  name: string;
  price: number | null;
  unit: string;
  description: string;
  features: string[];
  featured?: boolean;
  label?: string;
};
export type Service = {
  id: ServiceId;
  title: string;
  heading: string;
  description: string;
  plans: Plan[];
  note: string;
};
export type Project = {
  id: string;
  type: string;
  name: string;
  description: string;
  image: string;
  url: string;
  visible: boolean;
};
export type Faq = { id: string; question: string; answer: string };
type Block = { title: string; body: string };

export type MenuItem = { label: string; href: string };
type BlockBase = { id: string; anchor: string };
export type PageBlock = BlockBase &
  (
    | {
        type: "hero";
        eyebrow: string;
        heading: string;
        text: string;
        buttonLabel: string;
        buttonLink: string;
        image: string;
      }
    | { type: "heading"; text: string; level: 2 | 3 }
    | { type: "text"; html: string }
    | {
        type: "image";
        src: string;
        alt: string;
        caption: string;
        wide: boolean;
      }
    | {
        type: "button";
        label: string;
        link: string;
        style: "primary" | "outline";
      }
    | {
        type: "cards";
        heading: string;
        items: { title: string; text: string; link: string }[];
      }
    | { type: "quote"; text: string; cite: string }
    | { type: "pricing"; heading: string; service: ServiceId }
    | { type: "faq"; heading: string; ids: string[] }
    | {
        type: "cta";
        heading: string;
        text: string;
        buttonLabel: string;
        buttonLink: string;
      }
    | { type: "posts"; heading: string; count: number; tag: string }
    | { type: "divider" }
  );
export type BlockType = PageBlock["type"];
export type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  visible: boolean;
  blocks: PageBlock[];
};
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  body: string;
  visible: boolean;
  featured: boolean;
};

export type SiteContent = {
  version: number;
  brand: {
    name: string;
    domain: string;
    tagline: string;
    eyebrow: string;
    headline: string[];
    intro: string;
    consultationMinutes: number;
    email: string;
    phone: string;
    footerNote: string;
  };
  seo: { title: string; description: string };
  settings: {
    announcement: { enabled: boolean; text: string; link: string };
    showChat: boolean;
    analytics?: { enabled: boolean; snippet: string };
  };
  sections: {
    services: {
      kicker: string;
      heading: string;
      headingMuted: string;
      aside: string;
    };
    projects: {
      heading: string;
      headingMuted: string;
      intro: string;
      disclaimer: string;
    };
    about: {
      eyebrow: string;
      heading: string;
      headingMuted: string;
      body: string;
      locations: string[];
      benefits: Block[];
    };
    process: { heading: string; headingMuted: string; steps: Block[] };
    faq: { heading: string; headingMuted: string; intro: string };
    cta: { label: string; heading: string; body: string; button: string };
  };
  services: Service[];
  logoPackage: { price: number | null; title: string; description: string };
  projects: Project[];
  faqs: Faq[];
  pages: Page[];
  blog: { title: string; intro: string; enabled: boolean };
  posts: Post[];
  menus: { header: MenuItem[]; footer: MenuItem[] };
};

export const defaultContent = defaults as SiteContent;

/** Loads published content, falling back to the bundled defaults. */
export async function loadContent(): Promise<SiteContent> {
  try {
    const response = await fetch("/api/content", {
      signal: AbortSignal.timeout(2500),
      credentials: "omit",
    });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    if (!data?.services?.length) throw new Error("Empty content");
    return data as SiteContent;
  } catch {
    return defaultContent;
  }
}

export function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value == null ? undefined : (value as Record<string, unknown>)[key],
      obj,
    );
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (v: unknown) =>
    Array.isArray(v) ? [...v] : { ...(v as Record<string, unknown>) };
  const root = clone(obj) as Record<string, unknown>;
  let cursor = root;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) cursor[key] = value;
    else {
      cursor[key] = clone(cursor[key]);
      cursor = cursor[key] as Record<string, unknown>;
    }
  });
  return root as T;
}

/** URL-safe version of a name, used for page addresses and link names. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Anchor for a package, e.g. "plan-hosting-standard". */
export function planAnchor(serviceId: string, planName: string) {
  return `plan-${serviceId}-${slugify(planName) || "package"}`;
}

export function tagSlug(tag: string) {
  return slugify(tag);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPrice(price: number) {
  return Number.isInteger(price) ? String(price) : price.toFixed(2);
}

export const serviceOrder: ServiceId[] = [
  "design",
  "hosting",
  "email",
  "support",
  "telephony",
];
