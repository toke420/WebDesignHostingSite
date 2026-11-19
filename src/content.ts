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
export type Faq = { question: string; answer: string };
type Block = { title: string; body: string };

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
