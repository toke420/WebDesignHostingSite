import { useEffect, useState } from "react";
import { parseTrackingScripts } from "../../content/schema.mjs";
import {
  ArrowSquareOutIcon,
  ClockCounterClockwiseIcon,
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  QuestionIcon,
  SquaresFourIcon,
  TextAaIcon,
  WarningIcon,
  CursorClickIcon,
  FilesIcon,
  NewspaperIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import {
  defaultContent,
  formatPrice,
  getPath,
  type Plan,
  type ServiceId,
  type SiteContent,
} from "../content";
import { api, type Version } from "./api";
import {
  Field,
  ImagePicker,
  ItemActions,
  PriceInput,
  RichText,
  StringList,
  TextInput,
  Toggle,
  move,
} from "./fields";

export type Selection = {
  panel?: string;
  service?: string;
  plan?: number;
  faq?: number;
  project?: number;
  group?: string;
  pageId?: string;
  postId?: string;
  block?: number;
  fromPreview?: boolean;
};
type PanelProps = {
  content: SiteContent;
  update: (path: string, value: unknown) => void;
  selection: Selection;
  select: (s: Selection) => void;
};

/** Scrolls an item into view and briefly highlights it when picked from the preview. */
function useFocusItem(id: string | null, deps: unknown[]) {
  useEffect(() => {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("flash");
    const t = setTimeout(() => el.classList.remove("flash"), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function HomePanel({ content, select }: PanelProps) {
  const cards = [
    {
      panel: "pages",
      icon: FilesIcon,
      title: "Add & edit pages",
      body: `${content.pages.length} extra page${content.pages.length === 1 ? "" : "s"} built from blocks, with links to any spot.`,
    },
    {
      panel: "blog",
      icon: NewspaperIcon,
      title: "Write a blog post",
      body: `${content.posts.filter((p) => p.visible).length} live posts. Draft privately, then publish.`,
    },
    {
      panel: "packages",
      icon: CurrencyDollarIcon,
      title: "Change prices & packages",
      body: "Edit prices, features and which plan is highlighted.",
    },
    {
      panel: "faqs",
      icon: QuestionIcon,
      title: "Edit questions & answers",
      body: `${content.faqs.length} questions. Add, reorder or rewrite them.`,
    },
    {
      panel: "showcase",
      icon: SquaresFourIcon,
      title: "Showcase sites",
      body: `${content.projects.filter((p) => p.visible).length} example sites shown under “What we build”.`,
    },
    {
      panel: "text",
      icon: TextAaIcon,
      title: "Page text",
      body: "Headlines and paragraphs for every section of the page.",
    },
  ];
  return (
    <div className="panel">
      <h1>Welcome back 👋</h1>
      <div className="tip">
        <CursorClickIcon size={22} />
        <p>
          <strong>Click any text in the preview and start typing.</strong>{" "}
          Headings, prices, features and answers all change right there on the
          page. Click a box (like a price card) to open its full settings here.
        </p>
      </div>
      <div className="quick-cards">
        {cards.map(({ panel, icon: Icon, title, body }) => (
          <button key={panel} type="button" onClick={() => select({ panel })}>
            <Icon size={26} />
            <strong>{title}</strong>
            <span>{body}</span>
          </button>
        ))}
      </div>
      <h2>How saving works</h2>
      <ol className="steps">
        <li>
          Your edits save automatically as a <strong>draft</strong>. Visitors
          can’t see drafts.
        </li>
        <li>
          Press <strong>Publish changes</strong> when you’re happy. The live
          site updates straight away.
        </li>
        <li>
          Made a mistake? Use <strong>Undo</strong>, or restore an earlier
          version from <strong>History</strong>.
        </li>
      </ol>
    </div>
  );
}

export function PackagesPanel({
  content,
  update,
  selection,
  select,
}: PanelProps) {
  const current = selection.service || "hosting";
  const serviceIndex = content.services.findIndex((s) => s.id === current);
  useFocusItem(
    selection.plan !== undefined ? `plan-${current}-${selection.plan}` : null,
    [selection.plan, selection.service],
  );
  return (
    <div className="panel">
      <h1>Packages & prices</h1>
      <p className="panel-intro">
        Choose a service, then edit its packages. All prices are in AUD.
      </p>
      <div className="segmented" role="tablist" aria-label="Service">
        {content.services.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={current === s.id}
            onClick={() => select({ panel: "packages", service: s.id })}
          >
            {s.title}
          </button>
        ))}
        <button
          role="tab"
          aria-selected={current === "logo"}
          onClick={() => select({ panel: "packages", service: "logo" })}
        >
          Logo pack
        </button>
      </div>

      {current === "logo" ? (
        <div className="card">
          <h2>Logo design pack</h2>
          <p className="panel-intro">Shown under the web design packages.</p>
          <PriceInput
            value={content.logoPackage.price}
            onChange={(v) => update("logoPackage.price", v)}
          />
          <TextInput
            label="Title"
            value={content.logoPackage.title}
            max={120}
            onChange={(v) => update("logoPackage.title", v)}
          />
          <TextInput
            label="Description"
            multiline
            value={content.logoPackage.description}
            max={400}
            onChange={(v) => update("logoPackage.description", v)}
          />
        </div>
      ) : serviceIndex >= 0 ? (
        <ServiceEditor content={content} update={update} index={serviceIndex} />
      ) : null}
    </div>
  );
}

function ServiceEditor({
  content,
  update,
  index,
}: {
  content: SiteContent;
  update: PanelProps["update"];
  index: number;
}) {
  const service = content.services[index];
  const base = `services.${index}`;
  const [open, setOpen] = useState<number | null>(null);
  const setPlans = (plans: Plan[]) => update(`${base}.plans`, plans);
  return (
    <>
      <details className="card">
        <summary>Service heading & notes</summary>
        <TextInput
          label="Tab name"
          value={service.title}
          max={60}
          onChange={(v) => update(`${base}.title`, v)}
        />
        <TextInput
          label="Heading"
          value={service.heading}
          max={160}
          onChange={(v) => update(`${base}.heading`, v)}
        />
        <TextInput
          label="Description"
          multiline
          value={service.description}
          max={400}
          onChange={(v) => update(`${base}.description`, v)}
        />
        <TextInput
          label="Small print under the prices"
          multiline
          value={service.note}
          max={600}
          onChange={(v) => update(`${base}.note`, v)}
        />
      </details>
      {service.plans.map((plan, i) => {
        const p = `${base}.plans.${i}`;
        const expanded = open === i || service.plans.length <= 3;
        return (
          <section
            className={`card plan-card ${plan.featured ? "is-featured" : ""}`}
            id={`plan-${service.id}-${i}`}
            key={i}
          >
            <header>
              <button
                type="button"
                className="plan-summary"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={expanded}
              >
                <strong>{plan.name || "Untitled package"}</strong>
                <span className="pill">
                  {plan.price === null
                    ? "Quote"
                    : `$${formatPrice(plan.price)} ${plan.unit}`}
                </span>
                {plan.featured && (
                  <span className="pill pill-yellow">Highlighted</span>
                )}
              </button>
              <ItemActions
                index={i}
                length={service.plans.length}
                name={plan.name}
                onMove={(a, b) => setPlans(move(service.plans, a, b))}
                onRemove={() =>
                  setPlans(service.plans.filter((_, j) => j !== i))
                }
                onDuplicate={
                  service.plans.length < 6
                    ? () =>
                        setPlans([
                          ...service.plans.slice(0, i + 1),
                          {
                            ...plan,
                            name: `${plan.name} copy`,
                            featured: false,
                          },
                          ...service.plans.slice(i + 1),
                        ])
                    : undefined
                }
              />
            </header>
            {expanded && (
              <div className="plan-fields">
                <TextInput
                  label="Package name"
                  value={plan.name}
                  max={80}
                  onChange={(v) => update(`${p}.name`, v)}
                />
                <PriceInput
                  value={plan.price}
                  onChange={(v) => update(`${p}.price`, v)}
                />
                <TextInput
                  label="Price wording after the amount"
                  hint="For example “/ month”, “/ hour” or “one-off”"
                  value={plan.unit}
                  max={40}
                  onChange={(v) => update(`${p}.unit`, v)}
                />
                <TextInput
                  label="Short description"
                  value={plan.description}
                  max={300}
                  onChange={(v) => update(`${p}.description`, v)}
                />
                <StringList
                  label="What’s included"
                  addLabel="Add a feature"
                  items={plan.features}
                  onChange={(v) => update(`${p}.features`, v)}
                />
                <Toggle
                  label="Highlight this package"
                  hint="Adds a yellow badge and makes it stand out"
                  checked={!!plan.featured}
                  onChange={(v) => update(`${p}.featured`, v)}
                />
                {plan.featured && (
                  <TextInput
                    label="Badge text"
                    value={plan.label || ""}
                    max={40}
                    placeholder="MOST POPULAR"
                    onChange={(v) => update(`${p}.label`, v.toUpperCase())}
                  />
                )}
              </div>
            )}
          </section>
        );
      })}
      {service.plans.length < 6 && (
        <button
          type="button"
          className="add-big"
          onClick={() => {
            setPlans([
              ...service.plans,
              {
                name: "New package",
                price: 0,
                unit: service.plans[0]?.unit || "",
                description: "",
                features: [""],
                featured: false,
                label: "",
              },
            ]);
            setOpen(service.plans.length);
          }}
        >
          <PlusIcon /> Add a package
        </button>
      )}
    </>
  );
}

export function FaqPanel({ content, update, selection }: PanelProps) {
  const faqs = content.faqs;
  useFocusItem(selection.faq !== undefined ? `faq-${selection.faq}` : null, [
    selection.faq,
  ]);
  return (
    <div className="panel">
      <h1>Questions & answers</h1>
      <p className="panel-intro">
        Shown in the FAQ section. Drag order with the arrows. Answers can
        include bold text, links and lists.
      </p>
      {faqs.map((faq, i) => (
        <section className="card" id={`faq-${i}`} key={i}>
          <header>
            <span className="pill">Question {i + 1}</span>
            <ItemActions
              index={i}
              length={faqs.length}
              name={faq.question || `question ${i + 1}`}
              onMove={(a, b) => update("faqs", move(faqs, a, b))}
              onRemove={() =>
                update(
                  "faqs",
                  faqs.filter((_, j) => j !== i),
                )
              }
            />
          </header>
          <TextInput
            label="Question"
            value={faq.question}
            max={200}
            onChange={(v) => update(`faqs.${i}.question`, v)}
          />
          <RichText
            label="Answer"
            value={faq.answer}
            onChange={(v) => update(`faqs.${i}.answer`, v)}
          />
        </section>
      ))}
      <button
        type="button"
        className="add-big"
        onClick={() =>
          update("faqs", [
            ...faqs,
            {
              question: "New question?",
              answer: "<p>Write the answer here.</p>",
            },
          ])
        }
      >
        <PlusIcon /> Add a question
      </button>
    </div>
  );
}

export function ShowcasePanel({ content, update, selection }: PanelProps) {
  const projects = content.projects;
  useFocusItem(
    selection.project !== undefined ? `project-${selection.project}` : null,
    [selection.project],
  );
  return (
    <div className="panel">
      <h1>Showcase sites</h1>
      <p className="panel-intro">
        The example websites under “What we build”. Hide any you don’t want
        shown, or add your real client work.
      </p>
      <details className="card">
        <summary>Section heading & intro</summary>
        <TextInput
          label="Heading"
          value={content.sections.projects.heading}
          onChange={(v) => update("sections.projects.heading", v)}
        />
        <TextInput
          label="Heading (second line, grey)"
          value={content.sections.projects.headingMuted}
          onChange={(v) => update("sections.projects.headingMuted", v)}
        />
        <TextInput
          label="Intro"
          multiline
          max={600}
          value={content.sections.projects.intro}
          onChange={(v) => update("sections.projects.intro", v)}
        />
        <TextInput
          label="Small print"
          multiline
          max={400}
          value={content.sections.projects.disclaimer}
          onChange={(v) => update("sections.projects.disclaimer", v)}
        />
      </details>
      {projects.map((project, i) => (
        <section
          className={`card ${project.visible ? "" : "is-hidden"}`}
          id={`project-${i}`}
          key={project.id}
        >
          <header>
            <button
              type="button"
              className="visibility"
              onClick={() => update(`projects.${i}.visible`, !project.visible)}
              aria-pressed={!project.visible}
            >
              {project.visible ? <EyeIcon /> : <EyeSlashIcon />}
              {project.visible ? "Shown" : "Hidden"}
            </button>
            <strong className="card-title">{project.type}</strong>
            <ItemActions
              index={i}
              length={projects.length}
              name={project.type}
              onMove={(a, b) => update("projects", move(projects, a, b))}
              onRemove={() =>
                update(
                  "projects",
                  projects.filter((_, j) => j !== i),
                )
              }
            />
          </header>
          <TextInput
            label="Category"
            value={project.type}
            max={60}
            onChange={(v) => update(`projects.${i}.type`, v)}
          />
          <TextInput
            label="Title"
            value={project.name}
            max={120}
            onChange={(v) => update(`projects.${i}.name`, v)}
          />
          <TextInput
            label="Description"
            multiline
            value={project.description}
            max={400}
            onChange={(v) => update(`projects.${i}.description`, v)}
          />
          <ImagePicker
            value={project.image}
            onChange={(v) => update(`projects.${i}.image`, v)}
            label="Preview image"
          />
          <TextInput
            label="Link to the site"
            hint="A full address (https://…) for real client sites, or /examples/… for the built-in concepts."
            value={project.url}
            onChange={(v) => update(`projects.${i}.url`, v)}
          />
          {project.url && (
            <a
              className="inline-link"
              href={project.url}
              target="_blank"
              rel="noreferrer"
            >
              Open link <ArrowSquareOutIcon />
            </a>
          )}
        </section>
      ))}
      <button
        type="button"
        className="add-big"
        onClick={() =>
          update("projects", [
            ...projects,
            {
              id: `project-${Date.now().toString(36)}`,
              type: "New project",
              name: "Project title",
              description: "",
              image: "/images/project-business.webp",
              url: "",
              visible: true,
            },
          ])
        }
      >
        <PlusIcon /> Add a showcase site
      </button>
    </div>
  );
}

type FieldSpec = [
  path: string,
  label: string,
  opts?: { multiline?: boolean; max?: number },
];
const textGroups: {
  id: string;
  title: string;
  fields: FieldSpec[];
  lists?: [string, string, string][];
}[] = [
  {
    id: "brand",
    title: "Top of page (hero)",
    fields: [
      ["brand.eyebrow", "Small line above the headline"],
      ["brand.headline.0", "Headline, first line"],
      ["brand.headline.1", "Headline, second line (yellow)"],
      ["brand.intro", "Intro paragraph", { multiline: true, max: 500 }],
    ],
  },
  {
    id: "services",
    title: "Services section",
    fields: [
      ["sections.services.kicker", "Small heading"],
      ["sections.services.heading", "Heading"],
      ["sections.services.headingMuted", "Heading (grey part)"],
      ["sections.services.aside", "Side note"],
    ],
  },
  {
    id: "projects",
    title: "What we build section",
    fields: [
      ["sections.projects.heading", "Heading"],
      ["sections.projects.headingMuted", "Heading (grey part)"],
      ["sections.projects.intro", "Intro", { multiline: true, max: 600 }],
      [
        "sections.projects.disclaimer",
        "Small print",
        { multiline: true, max: 400 },
      ],
    ],
  },
  {
    id: "about",
    title: "Why us section",
    fields: [
      ["sections.about.eyebrow", "Small heading"],
      ["sections.about.heading", "Heading"],
      ["sections.about.headingMuted", "Heading (grey part)"],
      ["sections.about.body", "Paragraph", { multiline: true, max: 800 }],
      ["sections.about.benefits.0.title", "Benefit 1 title"],
      ["sections.about.benefits.0.body", "Benefit 1 text", { multiline: true }],
      ["sections.about.benefits.1.title", "Benefit 2 title"],
      ["sections.about.benefits.1.body", "Benefit 2 text", { multiline: true }],
      ["sections.about.benefits.2.title", "Benefit 3 title"],
      ["sections.about.benefits.2.body", "Benefit 3 text", { multiline: true }],
    ],
    lists: [
      ["sections.about.locations", "Hosting locations", "Add a location"],
    ],
  },
  {
    id: "process",
    title: "How it works section",
    fields: [
      ["sections.process.heading", "Heading"],
      ["sections.process.headingMuted", "Heading (grey part)"],
      ["sections.process.steps.0.title", "Step 1 title"],
      ["sections.process.steps.0.body", "Step 1 text", { multiline: true }],
      ["sections.process.steps.1.title", "Step 2 title"],
      ["sections.process.steps.1.body", "Step 2 text", { multiline: true }],
      ["sections.process.steps.2.title", "Step 3 title"],
      ["sections.process.steps.2.body", "Step 3 text", { multiline: true }],
    ],
  },
  {
    id: "faq",
    title: "FAQ intro",
    fields: [
      ["sections.faq.heading", "Heading"],
      ["sections.faq.headingMuted", "Heading (grey part)"],
      ["sections.faq.intro", "Intro", { multiline: true }],
    ],
  },
  {
    id: "cta",
    title: "Call to action box",
    fields: [
      ["sections.cta.label", "Small label"],
      ["sections.cta.heading", "Heading", { multiline: true }],
      ["sections.cta.body", "Text", { multiline: true }],
      ["sections.cta.button", "Button text"],
    ],
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      ["brand.tagline", "Tagline under the logo"],
      ["brand.footerNote", "Small footer note"],
    ],
  },
];

export function TextPanel({ content, update, selection, select }: PanelProps) {
  useFocusItem(selection.group ? `group-${selection.group}` : null, [
    selection.group,
  ]);
  return (
    <div className="panel">
      <h1>Page text</h1>
      <p className="panel-intro">
        Every heading and paragraph on the home page. Tip: you can also click
        text in the preview and type over it.
      </p>
      {textGroups.map((group) => (
        <details
          className="card"
          key={group.id}
          id={`group-${group.id}`}
          open={selection.group === group.id}
          onToggle={(e) => {
            if (
              (e.currentTarget as HTMLDetailsElement).open &&
              selection.group !== group.id
            )
              select({ panel: "text", group: group.id });
          }}
        >
          <summary>{group.title}</summary>
          {group.fields.map(([path, label, opts]) => (
            <TextInput
              key={path}
              label={label}
              multiline={opts?.multiline}
              max={opts?.max}
              value={String(getPath(content, path) ?? "")}
              onChange={(v) => update(path, v)}
            />
          ))}
          {group.lists?.map(([path, label, add]) => (
            <StringList
              key={path}
              label={label}
              addLabel={add}
              max={8}
              items={(getPath(content, path) as string[]) || []}
              onChange={(v) => update(path, v)}
            />
          ))}
        </details>
      ))}
    </div>
  );
}

export function BrandPanel({ content, update }: PanelProps) {
  const { brand, seo } = content;
  return (
    <div className="panel">
      <h1>Business details & search</h1>
      <div className="card">
        <h2>Business details</h2>
        <TextInput
          label="Business name"
          value={brand.name}
          max={60}
          onChange={(v) => update("brand.name", v)}
        />
        <TextInput
          label="Website address"
          value={brand.domain}
          onChange={(v) => update("brand.domain", v)}
        />
        <TextInput
          label="Contact email (shown in the footer)"
          type="email"
          value={brand.email}
          placeholder="hello@webtechpros.net"
          onChange={(v) => update("brand.email", v)}
        />
        <TextInput
          label="Phone (shown in the footer)"
          type="tel"
          value={brand.phone}
          placeholder="03 9000 0000"
          onChange={(v) => update("brand.phone", v)}
        />
        <Field label="Free consultation length (minutes)">
          <input
            type="number"
            min={5}
            max={240}
            value={brand.consultationMinutes}
            onChange={(e) =>
              update("brand.consultationMinutes", Number(e.target.value))
            }
          />
        </Field>
      </div>
      <div className="card">
        <h2>How you appear in Google</h2>
        <TextInput
          label="Page title"
          value={seo.title}
          max={60}
          hint="Shown as the blue link in search results. Aim for under 60 characters."
          onChange={(v) => update("seo.title", v)}
        />
        <TextInput
          label="Description"
          multiline
          value={seo.description}
          max={160}
          hint="The grey text under the link. Aim for under 160 characters."
          onChange={(v) => update("seo.description", v)}
        />
        <div className="serp" aria-label="Search result preview">
          <span className="serp-url">https://{brand.domain}</span>
          <span className="serp-title">{seo.title || "Page title"}</span>
          <span className="serp-desc">
            {seo.description.slice(0, 160) || "Description"}
          </span>
        </div>
      </div>
      <div className="card">
        <h2>Brand assets</h2>
        <p className="panel-intro">
          Your logo in every common size and format (SVG, PNG, JPEG, ICO),
          favicons, social profile pictures and 17 ready-made advertising
          banners.
        </p>
        <div className="brand-previews">
          <img
            src="/brand/logo-horizontal-dark.png"
            alt="Logo on dark background"
          />
          <img
            src="/brand/logo-horizontal-light.png"
            alt="Logo on light background"
          />
          <img
            src="/brand/banner-preview.png"
            alt="Example advertising banner"
          />
        </div>
        <a
          className="button-primary"
          href="/brand/webtechpros-logo-pack.zip"
          download
        >
          <DownloadSimpleIcon /> Download logo pack (.zip)
        </a>
      </div>
    </div>
  );
}

export function SettingsPanel({ content, update }: PanelProps) {
  const a = content.settings.announcement;
  return (
    <div className="panel">
      <h1>Site settings</h1>
      <div className="card">
        <h2>Announcement bar</h2>
        <p className="panel-intro">
          A yellow strip across the top of the site, for specials, holidays or
          news.
        </p>
        <Toggle
          label="Show the announcement bar"
          checked={a.enabled}
          onChange={(v) => update("settings.announcement.enabled", v)}
        />
        <TextInput
          label="Message"
          value={a.text}
          max={200}
          placeholder="Closed 24–26 December. Merry Christmas!"
          onChange={(v) => update("settings.announcement.text", v)}
        />
        <TextInput
          label="Link (optional)"
          value={a.link}
          placeholder="#services or https://…"
          onChange={(v) => update("settings.announcement.link", v)}
        />
      </div>
      <div className="card">
        <h2>Live chat</h2>
        <Toggle
          label="Show the “Let’s chat” button"
          hint="Turn off if nobody can answer chats for a while"
          checked={content.settings.showChat}
          onChange={(v) => update("settings.showChat", v)}
        />
      </div>
      <AnalyticsCard content={content} update={update} />
    </div>
  );
}

function AnalyticsCard({
  content,
  update,
}: Pick<PanelProps, "content" | "update">) {
  const a = content.settings.analytics ?? { enabled: false, snippet: "" };
  const scripts = parseTrackingScripts(a.snippet);
  const ignored =
    (a.snippet.match(/<script\b/gi) || []).length - scripts.length;
  return (
    <div className="card">
      <h2>Analytics &amp; tracking</h2>
      <p className="panel-intro">
        Paste the tracking code from Rybbit, Plausible, Umami or similar. It
        loads on every public page (never in this editor) once you publish.
      </p>
      <Toggle
        label="Load the tracking script"
        checked={a.enabled}
        onChange={(v) => update("settings.analytics.enabled", v)}
      />
      <TextInput
        label="Tracking code"
        multiline
        max={2000}
        value={a.snippet}
        placeholder={
          '<script src="https://analytics.example.com/script.js" defer></script>'
        }
        hint={
          'Only <script src="https://…"> tags are used. Inline code is ignored for security.'
        }
        onChange={(v) => update("settings.analytics.snippet", v)}
      />
      {a.snippet.trim() &&
        (scripts.length ? (
          <p className="panel-intro">
            Will load: {scripts.map((s) => s.src).join(", ")}
          </p>
        ) : (
          <p className="panel-intro" role="alert">
            No usable script found. Paste a tag like{" "}
            <code>{'<script src="https://…"></script>'}</code>.
          </p>
        ))}
      {ignored > 0 && scripts.length > 0 && (
        <p className="panel-intro" role="alert">
          {ignored} script tag(s) without an https address will be ignored.
        </p>
      )}
    </div>
  );
}

export function HistoryPanel({
  onRestore,
  onReset,
}: {
  onRestore: (id: string) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.versions().then(
      (r) => setVersions(r.versions),
      (e) => setError(e.message),
    );
  }, []);
  return (
    <div className="panel">
      <h1>History</h1>
      <p className="panel-intro">
        Every time you publish, the previous live version is kept here (the last
        30). Restoring puts that version into your draft so you can check it
        before publishing.
      </p>
      {error && <p className="error">{error}</p>}
      {versions?.length === 0 && (
        <p className="empty">
          Nothing here yet. Versions appear after your first publish.
        </p>
      )}
      <ul className="versions">
        {versions?.map((v) => (
          <li key={v.id}>
            <ClockCounterClockwiseIcon />
            <span>
              <strong>
                {new Date(v.publishedAt).toLocaleString("en-AU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </strong>
              <small>Live version replaced at this time</small>
            </span>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                if (confirm("Replace your current draft with this version?"))
                  onRestore(v.id);
              }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
      <div className="card danger-zone">
        <h2>
          <WarningIcon /> Start over
        </h2>
        <p>
          Put the original website text, prices and examples back into your
          draft. Nothing changes on the live site until you publish.
        </p>
        <button
          type="button"
          className="button-danger"
          onClick={() => {
            if (
              confirm(
                "Replace your draft with the original content? You can still undo this.",
              )
            )
              onReset();
          }}
        >
          Restore original content
        </button>
      </div>
    </div>
  );
}

export function AccountPanel({ onLogout }: { onLogout: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmNext, setConfirmNext] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  return (
    <div className="panel">
      <h1>Account</h1>
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          if (next !== confirmNext)
            return setStatus({
              ok: false,
              text: "The new passwords don’t match.",
            });
          try {
            await api.password(current, next);
            setStatus({
              ok: true,
              text: "Password changed. Other devices have been signed out.",
            });
            setCurrent("");
            setNext("");
            setConfirmNext("");
          } catch (err) {
            setStatus({ ok: false, text: (err as Error).message });
          }
        }}
      >
        <h2>Change password</h2>
        <TextInput
          label="Current password"
          type="password"
          value={current}
          onChange={setCurrent}
        />
        <TextInput
          label="New password"
          type="password"
          value={next}
          hint="At least 10 characters. A short sentence is easy to remember."
          onChange={setNext}
        />
        <TextInput
          label="New password again"
          type="password"
          value={confirmNext}
          onChange={setConfirmNext}
        />
        {status && (
          <p className={status.ok ? "success" : "error"} role="status">
            {status.text}
          </p>
        )}
        <button className="button-primary" type="submit">
          Change password
        </button>
      </form>
      <button type="button" className="button-secondary" onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
}

export const panelScroll: Record<string, string> = {
  home: "home",
  packages: "services",
  faqs: "faq",
  showcase: "projects",
  text: "home",
  brand: "home",
  settings: "home",
};
export const groupScroll: Record<string, string> = {
  brand: "home",
  services: "services",
  projects: "projects",
  about: "about",
  process: "process",
  faq: "faq",
  cta: "contact",
  footer: "contact",
};
export const isServiceId = (v?: string): v is ServiceId =>
  !!v && defaultContent.services.some((s) => s.id === v);
