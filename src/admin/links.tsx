// Link picker: choose any page, section, package, question or blog post on the
// site (optionally highlighting exact text), or an outside website, email or phone.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowSquareOutIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  XIcon,
} from "@phosphor-icons/react";
import { planAnchor, type SiteContent } from "../content";

export const AdminContent = createContext<SiteContent>(null!);
export const useAdminContent = () => useContext(AdminContent);

type Target = { group: string; label: string; detail?: string; href: string };

const HOME_SECTIONS: [string, string][] = [
  ["#home", "Top of the home page"],
  ["#services", "Services & prices"],
  ["#projects", "What we build"],
  ["#about", "Why us"],
  ["#process", "How it works"],
  ["#faq", "Questions & answers"],
  ["#contact", "Free consultation box"],
];

export function linkTargets(content: SiteContent): Target[] {
  const targets: Target[] = [{ group: "Pages", label: "Home page", href: "/" }];
  for (const page of content.pages) {
    targets.push({
      group: "Pages",
      label: page.title,
      detail: `/${page.slug}${page.visible ? "" : " · hidden"}`,
      href: `/${page.slug}`,
    });
    page.blocks.forEach((b) => {
      if (!b.anchor) return;
      const name =
        ("heading" in b && b.heading) ||
        ("text" in b && typeof b.text === "string" && b.text) ||
        ("label" in b && b.label) ||
        b.type;
      targets.push({
        group: "Spots on your pages",
        label: `${page.title} › ${String(name).slice(0, 60)}`,
        detail: `/${page.slug}#${b.anchor}`,
        href: `/${page.slug}#${b.anchor}`,
      });
    });
  }
  for (const [hash, label] of HOME_SECTIONS)
    targets.push({
      group: "Home page sections",
      label,
      detail: `/${hash}`,
      href: `/${hash}`,
    });
  for (const service of content.services)
    for (const plan of service.plans)
      targets.push({
        group: "Packages",
        label: `${service.title} › ${plan.name}`,
        href: `/#${planAnchor(service.id, plan.name)}`,
      });
  for (const faq of content.faqs)
    targets.push({
      group: "Questions",
      label: faq.question,
      href: `/#faq-${faq.id}`,
    });
  targets.push({
    group: "Blog",
    label: content.blog.title || "Blog",
    detail: "/blog",
    href: "/blog",
  });
  for (const post of content.posts)
    targets.push({
      group: "Blog",
      label: post.title,
      detail: `/blog/${post.slug}${post.visible ? "" : " · hidden"}`,
      href: `/blog/${post.slug}`,
    });
  const tags = [...new Set(content.posts.flatMap((p) => p.tags))];
  for (const tag of tags)
    targets.push({
      group: "Blog",
      label: `Posts tagged “${tag}”`,
      href: `/blog?tag=${tag
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
    });
  targets.push({
    group: "Example sites",
    label: "Example sites (all)",
    href: "/#projects",
  });
  for (const p of content.projects)
    if (p.url)
      targets.push({
        group: "Example sites",
        label: p.type,
        detail: p.url,
        href: p.url,
      });
  return targets;
}

/** Splits "/page?hl=text#anchor" into its parts. */
function parse(href: string) {
  try {
    const url = new URL(href, "https://site.invalid");
    const hl = url.searchParams.get("hl") || "";
    url.searchParams.delete("hl");
    const base = href.startsWith("/")
      ? url.pathname + url.search + url.hash
      : href;
    return { base: hl ? base : href, hl };
  } catch {
    return { base: href, hl: "" };
  }
}
function compose(base: string, hl: string) {
  if (!hl.trim() || !base.startsWith("/")) return base;
  const url = new URL(base, "https://site.invalid");
  url.searchParams.set("hl", hl.trim());
  return url.pathname + url.search + url.hash;
}

/** Friendly description of a link, e.g. "Page: Australian web hosting › Hosting plans". */
export function describeLink(href: string, content: SiteContent) {
  if (!href) return "No link";
  const { base, hl } = parse(href);
  const match = linkTargets(content).find((t) => t.href === base);
  const text = match
    ? `${match.group === "Pages" ? "Page" : match.group.replace(/s$/, "")}: ${match.label}`
    : base.startsWith("mailto:")
      ? `Email ${base.slice(7)}`
      : base.startsWith("tel:")
        ? `Phone ${base.slice(4)}`
        : base;
  return hl ? `${text} · highlights “${hl}”` : text;
}

type Mode = "site" | "web" | "email" | "phone";

export function LinkPicker({
  value,
  onPick,
  onClose,
  title = "Choose a link",
}: {
  value: string;
  onPick: (href: string) => void;
  onClose: () => void;
  title?: string;
}) {
  const content = useAdminContent();
  const ref = useRef<HTMLDialogElement>(null);
  const initial = parse(value);
  const [mode, setMode] = useState<Mode>(
    value.startsWith("mailto:")
      ? "email"
      : value.startsWith("tel:")
        ? "phone"
        : /^https?:/.test(value)
          ? "web"
          : "site",
  );
  const [query, setQuery] = useState("");
  const [base, setBase] = useState(
    initial.base.startsWith("/") || initial.base.startsWith("#")
      ? initial.base
      : "",
  );
  const [hl, setHl] = useState(initial.hl);
  const [web, setWeb] = useState(/^https?:/.test(value) ? value : "https://");
  const [email, setEmail] = useState(
    value.startsWith("mailto:") ? value.slice(7) : "",
  );
  const [phone, setPhone] = useState(
    value.startsWith("tel:") ? value.slice(4) : "",
  );
  const targets = useMemo(() => linkTargets(content), [content]);
  const shown = targets.filter((t) =>
    `${t.group} ${t.label} ${t.detail || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const groups = [...new Set(shown.map((t) => t.group))];

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const result =
    mode === "site"
      ? compose(base, hl)
      : mode === "web"
        ? web === "https://"
          ? ""
          : web.trim()
        : mode === "email"
          ? email.trim()
            ? `mailto:${email.trim()}`
            : ""
          : phone.trim()
            ? `tel:${phone.replace(/[^+\d]/g, "")}`
            : "";
  const valid =
    mode === "web" ? /^https?:\/\/[^\s.]+\.[^\s]+$/.test(result) : !!result;

  return (
    <dialog
      ref={ref}
      className="link-dialog"
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
    >
      <header>
        <h2>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Close"
          onClick={onClose}
        >
          <XIcon size={20} />
        </button>
      </header>
      <div className="segmented" role="tablist" aria-label="Link type">
        {(
          [
            ["site", "This website", LinkSimpleIcon],
            ["web", "Other website", GlobeIcon],
            ["email", "Email", EnvelopeSimpleIcon],
            ["phone", "Phone", PhoneIcon],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>
      {mode === "site" && (
        <>
          <label className="search-box">
            <MagnifyingGlassIcon />
            <input
              autoFocus
              placeholder="Search pages, sections, packages, questions, posts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search link targets"
            />
          </label>
          <div
            className="targets"
            role="listbox"
            aria-label="Where should the link go?"
          >
            {groups.map((g) => (
              <div key={g}>
                <p className="target-group">{g}</p>
                {shown
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={base === t.href}
                      key={t.group + t.href + t.label}
                      onClick={() => setBase(t.href)}
                    >
                      <span>
                        {t.label}
                        {t.detail && <small>{t.detail}</small>}
                      </span>
                      {base === t.href && <CheckIcon />}
                    </button>
                  ))}
              </div>
            ))}
            {!shown.length && (
              <p className="empty">Nothing matches “{query}”.</p>
            )}
          </div>
          <label className="field">
            <span className="field-label">Highlight exact text (optional)</span>
            <input
              value={hl}
              placeholder="e.g. Melbourne and Sydney"
              onChange={(e) => setHl(e.target.value)}
              disabled={!base}
            />
            <span className="field-hint">
              Copy a phrase from the destination. Visitors are scrolled to it
              and it’s highlighted in yellow.
            </span>
          </label>
        </>
      )}
      {mode === "web" && (
        <label className="field">
          <span className="field-label">Website address</span>
          <input
            autoFocus
            type="url"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
          />
          <span className="field-hint">Opens in a new tab.</span>
        </label>
      )}
      {mode === "email" && (
        <label className="field">
          <span className="field-label">Email address</span>
          <input
            autoFocus
            type="email"
            value={email}
            placeholder="hello@webtechpros.net"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      )}
      {mode === "phone" && (
        <label className="field">
          <span className="field-label">Phone number</span>
          <input
            autoFocus
            type="tel"
            value={phone}
            placeholder="03 9000 0000"
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
      )}
      <footer>
        <code className="link-preview">
          {result || "Choose where the link goes"}
        </code>
        {mode === "site" && result && (
          <a
            className="inline-link"
            href={result}
            target="_blank"
            rel="noreferrer"
          >
            Test <ArrowSquareOutIcon />
          </a>
        )}
        <button type="button" className="button-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="button-primary"
          disabled={!valid}
          onClick={() => {
            // Close first: content behind a modal dialog can't be focused or edited.
            ref.current?.close();
            onPick(result);
          }}
        >
          Use this link
        </button>
      </footer>
    </dialog>
  );
}

/** A link setting: shows where it goes in plain words, with a picker. */
export function LinkField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (href: string) => void;
  hint?: string;
}) {
  const content = useAdminContent();
  const [open, setOpen] = useState(false);
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="link-field">
        <span className={value ? "" : "muted"}>
          {describeLink(value, content)}
        </span>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setOpen(true)}
        >
          <LinkSimpleIcon /> {value ? "Change" : "Choose"}
        </button>
        {value && (
          <button
            type="button"
            className="icon-button"
            aria-label={`Remove ${label.toLowerCase()}`}
            title="Remove link"
            onClick={() => onChange("")}
          >
            <XIcon />
          </button>
        )}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
      {open && (
        <LinkPicker
          value={value}
          title={label}
          onClose={() => setOpen(false)}
          onPick={(href) => {
            onChange(href);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/** Copies a full link to the clipboard and briefly confirms. */
export function CopyLinkButton({
  href,
  label = "Copy link",
}: {
  href: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-link"
      title={`${location.origin}${href}`}
      onClick={() => {
        navigator.clipboard?.writeText(`${location.origin}${href}`).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          },
          () => prompt("Copy this link:", `${location.origin}${href}`),
        );
      }}
    >
      {done ? <CheckIcon /> : <LinkSimpleIcon />} {done ? "Copied" : label}
    </button>
  );
}
