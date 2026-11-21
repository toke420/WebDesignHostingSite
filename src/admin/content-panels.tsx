// Admin panels for custom pages (block editor), the blog and the site menus.
import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowLeftIcon,
  ArticleIcon,
  ArrowSquareOutIcon,
  CardsIcon,
  CurrencyDollarIcon,
  FileIcon,
  ImageSquareIcon,
  ListIcon,
  MegaphoneIcon,
  MinusIcon,
  NewspaperIcon,
  PlusIcon,
  QuestionIcon,
  QuotesIcon,
  RectangleIcon,
  RocketLaunchIcon,
  StarIcon,
  TextAaIcon,
  TextHIcon,
  type IconProps,
} from "@phosphor-icons/react";
import {
  slugify,
  type BlockType,
  type MenuItem,
  type Page,
  type PageBlock,
  type Post,
  type SiteContent,
} from "../content";
import { defaultContent } from "../content";
import {
  Field,
  ImagePicker,
  ItemActions,
  RichText,
  TextInput,
  Toggle,
  move,
} from "./fields";
import { CopyLinkButton, LinkField } from "./links";
import type { Selection } from "./panels";

type Props = {
  content: SiteContent;
  update: (path: string, value: unknown) => void;
  selection: Selection;
  select: (s: Selection) => void;
};

const RESERVED = [
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
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const blockInfo: Record<
  BlockType,
  { name: string; description: string; icon: ComponentType<IconProps> }
> = {
  hero: {
    name: "Hero banner",
    description: "Big headline, intro, button and image",
    icon: RocketLaunchIcon,
  },
  heading: { name: "Heading", description: "A section title", icon: TextHIcon },
  text: {
    name: "Text",
    description: "Paragraphs, lists, links, quotes and images",
    icon: TextAaIcon,
  },
  image: {
    name: "Image",
    description: "A photo or graphic with a caption",
    icon: ImageSquareIcon,
  },
  button: {
    name: "Button",
    description: "A single call-to-action button",
    icon: RectangleIcon,
  },
  cards: {
    name: "Cards",
    description: "2–6 short feature or service cards",
    icon: CardsIcon,
  },
  quote: {
    name: "Quote",
    description: "A testimonial or pull quote",
    icon: QuotesIcon,
  },
  pricing: {
    name: "Prices",
    description: "Live package prices for one service",
    icon: CurrencyDollarIcon,
  },
  faq: {
    name: "Questions",
    description: "Some or all of your Q&As",
    icon: QuestionIcon,
  },
  cta: {
    name: "Call to action",
    description: "Yellow box with a consultation button",
    icon: MegaphoneIcon,
  },
  posts: {
    name: "Latest posts",
    description: "Recent blog posts, optionally by topic",
    icon: NewspaperIcon,
  },
  divider: {
    name: "Divider",
    description: "A thin line between sections",
    icon: MinusIcon,
  },
};

export function newBlock(type: BlockType): PageBlock {
  const base = { id: uid("b"), anchor: "" };
  switch (type) {
    case "hero":
      return {
        ...base,
        type,
        eyebrow: "",
        heading: "A clear, confident headline.",
        text: "One or two sentences that explain what this page is about.",
        buttonLabel: "Free consultation",
        buttonLink: "/#contact",
        image: "",
      };
    case "heading":
      return { ...base, type, text: "Section heading", level: 2 };
    case "text":
      return {
        ...base,
        type,
        html: "<p>Start writing here. Select text to make it bold, add a link or turn it into a list.</p>",
      };
    case "image":
      return { ...base, type, src: "", alt: "", caption: "", wide: false };
    case "button":
      return {
        ...base,
        type,
        label: "Find out more",
        link: "",
        style: "primary",
      };
    case "cards":
      return {
        ...base,
        type,
        heading: "Why choose us",
        items: [
          {
            title: "First point",
            text: "A short supporting sentence.",
            link: "",
          },
          {
            title: "Second point",
            text: "A short supporting sentence.",
            link: "",
          },
          {
            title: "Third point",
            text: "A short supporting sentence.",
            link: "",
          },
        ],
      };
    case "quote":
      return {
        ...base,
        type,
        text: "A great quote from a happy customer.",
        cite: "Customer name, Business",
      };
    case "pricing":
      return { ...base, type, heading: "Plans & prices", service: "hosting" };
    case "faq":
      return { ...base, type, heading: "Questions", ids: [] };
    case "cta":
      return {
        ...base,
        type,
        heading: "Let’s talk about your next move.",
        text: "Bring the idea. We’ll help you work out the rest.",
        buttonLabel: "Free consultation",
        buttonLink: "",
      };
    case "posts":
      return { ...base, type, heading: "From the blog", count: 3, tag: "" };
    case "divider":
      return { ...base, type };
  }
}

const templates: {
  id: string;
  name: string;
  description: string;
  blocks: () => PageBlock[];
}[] = [
  {
    id: "blank",
    name: "Blank page",
    description: "Just a headline. Add blocks as you go.",
    blocks: () => [newBlock("hero")],
  },
  {
    id: "about",
    name: "About us",
    description: "Story, values, a testimonial and a call to action",
    blocks: () => [
      { ...newBlock("hero"), heading: "About us" } as PageBlock,
      newBlock("text"),
      newBlock("cards"),
      newBlock("quote"),
      newBlock("cta"),
    ],
  },
  {
    id: "service",
    name: "Service page",
    description: "Hero, benefits, live prices, questions and a call to action",
    blocks: () => [
      newBlock("hero"),
      { ...newBlock("cards"), anchor: "benefits" } as PageBlock,
      { ...newBlock("pricing"), anchor: "prices" } as PageBlock,
      { ...newBlock("faq"), anchor: "questions" } as PageBlock,
      newBlock("cta"),
    ],
  },
  {
    id: "contact",
    name: "Contact",
    description: "Ways to reach you and a consultation button",
    blocks: () => [
      {
        ...newBlock("hero"),
        heading: "Get in touch",
        buttonLabel: "",
      } as PageBlock,
      {
        ...newBlock("text"),
        html: "<p><strong>Email:</strong> hello@yourbusiness.com<br><strong>Phone:</strong> 03 9000 0000</p><p>We usually reply within one business day.</p>",
      } as PageBlock,
      newBlock("cta"),
    ],
  },
];

function slugProblem(slug: string, content: SiteContent, selfId?: string) {
  if (!slug) return "Choose a web address.";
  if (!/^[a-z0-9-]+$/.test(slug))
    return "Use lowercase letters, numbers and dashes only.";
  if (RESERVED.includes(slug))
    return `“${slug}” is used by the site. Choose another address.`;
  if (content.pages.some((p) => p.slug === slug && p.id !== selfId))
    return "Another page already uses this address.";
  return "";
}

// ---------------------------------------------------------------- Pages

export function PagesPanel(props: Props) {
  const { content, selection, select } = props;
  const page = content.pages.find((p) => p.id === selection.pageId);
  if (page)
    return (
      <PageEditor {...props} page={page} index={content.pages.indexOf(page)} />
    );
  return (
    <PageList
      {...props}
      onOpen={(id) => select({ panel: "pages", pageId: id })}
    />
  );
}

function PageList({
  content,
  update,
  onOpen,
}: Props & { onOpen: (id: string) => void }) {
  const [choosing, setChoosing] = useState(false);
  const pages = content.pages;
  const create = (template: (typeof templates)[number]) => {
    const n = pages.length + 1;
    let slug =
      template.id === "blank"
        ? `new-page-${n}`
        : template.id === "service"
          ? "our-service"
          : template.id === "about"
            ? "about"
            : "contact";
    while (slugProblem(slug, content)) slug = `${slug}-${n}`;
    const page: Page = {
      id: uid("p"),
      slug,
      title: template.id === "blank" ? "New page" : template.name,
      description: "",
      visible: false,
      blocks: template.blocks(),
    };
    update("pages", [...pages, page]);
    setChoosing(false);
    onOpen(page.id);
  };
  return (
    <div className="panel">
      <h1>Pages</h1>
      <p className="panel-intro">
        Build extra pages from blocks. New pages start hidden, so you can finish
        them before they go live.
      </p>
      <div className="card page-row home-row">
        <FileIcon size={22} />
        <span>
          <strong>Home page</strong>
          <small>
            / · edit it under Page text, Packages &amp; prices and Questions
          </small>
        </span>
      </div>
      {pages.map((p, i) => (
        <div className="card page-row" key={p.id}>
          <button
            type="button"
            className="page-open"
            onClick={() => onOpen(p.id)}
          >
            <FileIcon size={22} />
            <span>
              <strong>{p.title}</strong>
              <small>
                /{p.slug} · {p.blocks.length} block
                {p.blocks.length === 1 ? "" : "s"}
              </small>
            </span>
            {!p.visible && <span className="pill">Hidden</span>}
          </button>
          <ItemActions
            index={i}
            length={pages.length}
            name={p.title}
            onMove={(a, b) => update("pages", move(pages, a, b))}
            onRemove={() =>
              update(
                "pages",
                pages.filter((x) => x.id !== p.id),
              )
            }
            onDuplicate={() => {
              let slug = `${p.slug}-copy`;
              while (slugProblem(slug, content)) slug += "-2";
              update("pages", [
                ...pages.slice(0, i + 1),
                {
                  ...structuredClone(p),
                  id: uid("p"),
                  slug,
                  title: `${p.title} (copy)`,
                  visible: false,
                  blocks: p.blocks.map((b) => ({
                    ...structuredClone(b),
                    id: uid("b"),
                  })),
                },
                ...pages.slice(i + 1),
              ]);
            }}
          />
        </div>
      ))}
      {choosing ? (
        <div className="card">
          <h2>Start from…</h2>
          <div className="template-grid">
            {templates.map((t) => (
              <button type="button" key={t.id} onClick={() => create(t)}>
                <strong>{t.name}</strong>
                <span>{t.description}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setChoosing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="add-big"
          onClick={() => setChoosing(true)}
        >
          <PlusIcon /> Add a page
        </button>
      )}
    </div>
  );
}

function PageEditor({
  content,
  update,
  selection,
  select,
  page,
  index,
}: Props & { page: Page; index: number }) {
  const base = `pages.${index}`;
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState<number | null>(null);
  const [slugDraft, setSlugDraft] = useState(page.slug);
  useEffect(() => setSlugDraft(page.slug), [page.id, page.slug]);
  const problem = slugProblem(slugDraft, content, page.id);
  const inMenu = content.menus.header.some((m) => m.href === `/${page.slug}`);
  const setBlocks = (blocks: PageBlock[]) => update(`${base}.blocks`, blocks);

  useEffect(() => {
    if (selection.block === undefined) return;
    const b = page.blocks[selection.block];
    if (!b) return;
    setOpen(b.id);
    requestAnimationFrame(() => {
      const el = document.getElementById(`block-${b.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      el?.classList.add("flash");
      setTimeout(() => el?.classList.remove("flash"), 1400);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.block, selection.pageId]);

  const insert = (at: number, type: BlockType) => {
    const block = newBlock(type);
    setBlocks([...page.blocks.slice(0, at), block, ...page.blocks.slice(at)]);
    setAdding(null);
    setOpen(block.id);
  };

  return (
    <div className="panel">
      <button
        type="button"
        className="back-button"
        onClick={() => select({ panel: "pages" })}
      >
        <ArrowLeftIcon /> All pages
      </button>
      <h1>{page.title || "Untitled page"}</h1>
      <div className="card">
        <Toggle
          label={page.visible ? "Shown on the site" : "Hidden"}
          hint={
            page.visible
              ? "Visitors can see this page after you publish."
              : "Only you can see it. Switch on when it’s ready, then publish."
          }
          checked={page.visible}
          onChange={(v) => update(`${base}.visible`, v)}
        />
        <TextInput
          label="Page title"
          value={page.title}
          max={120}
          onChange={(v) => update(`${base}.title`, v)}
        />
        <Field label="Web address">
          <div className="slug-input">
            <span>{location.host}/</span>
            <input
              value={slugDraft}
              aria-label="Web address"
              aria-invalid={!!problem}
              onChange={(e) => {
                const v = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-");
                setSlugDraft(v);
                if (!slugProblem(v, content, page.id))
                  update(`${base}.slug`, v);
              }}
            />
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                const v = slugify(page.title);
                setSlugDraft(v);
                if (!slugProblem(v, content, page.id))
                  update(`${base}.slug`, v);
              }}
            >
              Use title
            </button>
          </div>
        </Field>
        {problem && <p className="error">{problem}</p>}
        <TextInput
          label="Google description"
          multiline
          max={160}
          value={page.description}
          hint="The grey text under your page in search results."
          onChange={(v) => update(`${base}.description`, v)}
        />
        <div className="row-actions">
          <CopyLinkButton href={`/${page.slug}`} label="Copy page link" />
          <a
            className="inline-link"
            href={`/${page.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            Open page <ArrowSquareOutIcon />
          </a>
          {inMenu ? (
            <span className="pill">In the top menu</span>
          ) : (
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                update("menus.header", [
                  ...content.menus.header,
                  { label: page.title, href: `/${page.slug}` },
                ])
              }
            >
              <ListIcon /> Add to top menu
            </button>
          )}
        </div>
      </div>

      <h2 className="blocks-title">Blocks</h2>
      {page.blocks.length === 0 && <p className="empty">No blocks yet.</p>}
      {page.blocks.map((block, j) => {
        const info = blockInfo[block.type];
        const expanded = open === block.id;
        return (
          <div key={block.id}>
            <InsertButton
              active={adding === j}
              onClick={() => setAdding(adding === j ? null : j)}
              onPick={(t) => insert(j, t)}
            />
            <section
              className={`card block-card ${expanded ? "is-open" : ""}`}
              id={`block-${block.id}`}
            >
              <header>
                <button
                  type="button"
                  className="plan-summary"
                  aria-expanded={expanded}
                  onClick={() => {
                    setOpen(expanded ? null : block.id);
                    if (!expanded)
                      select({
                        panel: "pages",
                        pageId: page.id,
                        block: j,
                        fromPreview: false,
                      });
                  }}
                >
                  <info.icon size={20} />
                  <strong>{info.name}</strong>
                  <span className="block-summary">{summary(block)}</span>
                </button>
                <ItemActions
                  index={j}
                  length={page.blocks.length}
                  name={info.name}
                  onMove={(a, b) => setBlocks(move(page.blocks, a, b))}
                  onRemove={() =>
                    setBlocks(page.blocks.filter((x) => x.id !== block.id))
                  }
                  onDuplicate={() =>
                    setBlocks([
                      ...page.blocks.slice(0, j + 1),
                      { ...structuredClone(block), id: uid("b"), anchor: "" },
                      ...page.blocks.slice(j + 1),
                    ])
                  }
                />
              </header>
              {expanded && (
                <div className="plan-fields">
                  <BlockFields
                    block={block}
                    base={`${base}.blocks.${j}`}
                    update={update}
                    content={content}
                  />
                  <div className="anchor-row">
                    <TextInput
                      label="Link name (optional)"
                      value={block.anchor}
                      placeholder={slugify(summary(block)) || block.type}
                      hint="Give this block a name to link straight to it, e.g. “prices”."
                      onChange={(v) =>
                        update(
                          `${base}.blocks.${j}.anchor`,
                          v.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                        )
                      }
                    />
                    <CopyLinkButton
                      href={`/${page.slug}#${block.anchor || slugify(summary(block)) || block.type}`}
                      label="Copy link to block"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        );
      })}
      <InsertButton
        big
        active={adding === page.blocks.length}
        onClick={() =>
          setAdding(adding === page.blocks.length ? null : page.blocks.length)
        }
        onPick={(t) => insert(page.blocks.length, t)}
      />
    </div>
  );
}

function summary(b: PageBlock) {
  switch (b.type) {
    case "hero":
    case "cards":
    case "pricing":
    case "faq":
    case "cta":
    case "posts":
      return b.heading;
    case "heading":
    case "quote":
      return b.text;
    case "text":
      return b.html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    case "image":
      return b.caption || b.alt;
    case "button":
      return b.label;
    default:
      return "";
  }
}

function InsertButton({
  active,
  onClick,
  onPick,
  big,
}: {
  active: boolean;
  onClick: () => void;
  onPick: (t: BlockType) => void;
  big?: boolean;
}) {
  return (
    <div className={`insert ${big ? "insert-big" : ""}`}>
      <button
        type="button"
        className={big ? "add-big" : "insert-line"}
        onClick={onClick}
        aria-expanded={active}
      >
        <PlusIcon />{" "}
        {big ? (
          "Add a block"
        ) : (
          <span className="sr-only">Add a block here</span>
        )}
      </button>
      {active && (
        <div className="block-picker" role="menu" aria-label="Choose a block">
          {(Object.keys(blockInfo) as BlockType[]).map((t) => {
            const info = blockInfo[t];
            return (
              <button
                type="button"
                role="menuitem"
                key={t}
                onClick={() => onPick(t)}
              >
                <info.icon size={22} />
                <strong>{info.name}</strong>
                <span>{info.description}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlockFields({
  block,
  base,
  update,
  content,
}: {
  block: PageBlock;
  base: string;
  update: Props["update"];
  content: SiteContent;
}) {
  const set = (key: string) => (v: unknown) => update(`${base}.${key}`, v);
  switch (block.type) {
    case "hero":
      return (
        <>
          <TextInput
            label="Small line above the headline"
            value={block.eyebrow}
            max={80}
            onChange={set("eyebrow")}
          />
          <TextInput
            label="Headline"
            multiline
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          <TextInput
            label="Intro"
            multiline
            value={block.text}
            max={600}
            onChange={set("text")}
          />
          <TextInput
            label="Button text"
            value={block.buttonLabel}
            max={60}
            hint="Leave empty for no button."
            onChange={set("buttonLabel")}
          />
          <LinkField
            label="Button link"
            value={block.buttonLink}
            onChange={set("buttonLink")}
          />
          <ImagePicker
            label="Image (optional)"
            value={block.image}
            onChange={set("image")}
          />
          {block.image && (
            <button
              type="button"
              className="button-secondary"
              onClick={() => set("image")("")}
            >
              Remove image
            </button>
          )}
        </>
      );
    case "heading":
      return (
        <>
          <TextInput
            label="Heading"
            value={block.text}
            max={160}
            onChange={set("text")}
          />
          <Field label="Size">
            <select
              value={block.level}
              onChange={(e) => set("level")(Number(e.target.value))}
            >
              <option value={2}>Large</option>
              <option value={3}>Small</option>
            </select>
          </Field>
        </>
      );
    case "text":
      return (
        <RichText full label="Text" value={block.html} onChange={set("html")} />
      );
    case "image":
      return (
        <>
          <ImagePicker value={block.src} onChange={set("src")} />
          <TextInput
            label="Describe the image"
            hint="Read aloud by screen readers and used by Google."
            value={block.alt}
            max={200}
            onChange={set("alt")}
          />
          <TextInput
            label="Caption (optional)"
            value={block.caption}
            max={200}
            onChange={set("caption")}
          />
          <Toggle
            label="Full width"
            checked={block.wide}
            onChange={set("wide")}
          />
        </>
      );
    case "button":
      return (
        <>
          <TextInput
            label="Button text"
            value={block.label}
            max={60}
            onChange={set("label")}
          />
          <LinkField
            label="Button link"
            value={block.link}
            onChange={set("link")}
          />
          <Field label="Style">
            <select
              value={block.style}
              onChange={(e) => set("style")(e.target.value)}
            >
              <option value="primary">Yellow</option>
              <option value="outline">Outline</option>
            </select>
          </Field>
        </>
      );
    case "cards":
      return (
        <>
          <TextInput
            label="Heading"
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          {block.items.map((item, i) => (
            <fieldset className="sub-card" key={i}>
              <legend>Card {i + 1}</legend>
              <TextInput
                label="Title"
                value={item.title}
                max={80}
                onChange={set(`items.${i}.title`)}
              />
              <TextInput
                label="Text"
                multiline
                value={item.text}
                max={300}
                onChange={set(`items.${i}.text`)}
              />
              <LinkField
                label="Link (optional)"
                value={item.link}
                onChange={set(`items.${i}.link`)}
              />
              <button
                type="button"
                className="button-secondary"
                onClick={() =>
                  set("items")(block.items.filter((_, j) => j !== i))
                }
              >
                Remove card
              </button>
            </fieldset>
          ))}
          {block.items.length < 6 && (
            <button
              type="button"
              className="add-row"
              onClick={() =>
                set("items")([
                  ...block.items,
                  { title: "New card", text: "", link: "" },
                ])
              }
            >
              <PlusIcon /> Add a card
            </button>
          )}
        </>
      );
    case "quote":
      return (
        <>
          <TextInput
            label="Quote"
            multiline
            value={block.text}
            max={600}
            onChange={set("text")}
          />
          <TextInput
            label="Who said it"
            value={block.cite}
            max={120}
            onChange={set("cite")}
          />
        </>
      );
    case "pricing":
      return (
        <>
          <TextInput
            label="Heading"
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          <Field label="Which service’s packages?">
            <select
              value={block.service}
              onChange={(e) => set("service")(e.target.value)}
            >
              {content.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <p className="field-hint">
            Prices stay in sync with Packages &amp; prices automatically.
          </p>
        </>
      );
    case "faq":
      return (
        <>
          <TextInput
            label="Heading"
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          <fieldset className="string-list">
            <legend>Which questions? (none ticked = all)</legend>
            {content.faqs.map((f) => (
              <label className="check-row" key={f.id}>
                <input
                  type="checkbox"
                  checked={block.ids.includes(f.id)}
                  onChange={(e) =>
                    set("ids")(
                      e.target.checked
                        ? [...block.ids, f.id]
                        : block.ids.filter((x) => x !== f.id),
                    )
                  }
                />
                {f.question}
              </label>
            ))}
          </fieldset>
        </>
      );
    case "cta":
      return (
        <>
          <TextInput
            label="Heading"
            multiline
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          <TextInput
            label="Text"
            multiline
            value={block.text}
            max={300}
            onChange={set("text")}
          />
          <TextInput
            label="Button text"
            value={block.buttonLabel}
            max={60}
            onChange={set("buttonLabel")}
          />
          <LinkField
            label="Button link"
            hint="Leave empty to open the free consultation form."
            value={block.buttonLink}
            onChange={set("buttonLink")}
          />
        </>
      );
    case "posts": {
      const tags = [...new Set(content.posts.flatMap((p) => p.tags))];
      return (
        <>
          <TextInput
            label="Heading"
            value={block.heading}
            max={160}
            onChange={set("heading")}
          />
          <Field label="How many posts">
            <input
              type="number"
              min={1}
              max={12}
              value={block.count}
              onChange={(e) => set("count")(Number(e.target.value))}
            />
          </Field>
          <Field label="Topic">
            <select
              value={block.tag}
              onChange={(e) => set("tag")(e.target.value)}
            >
              <option value="">All topics</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </>
      );
    }
    default:
      return <p className="field-hint">A divider has no settings.</p>;
  }
}

// ---------------------------------------------------------------- Blog

export function BlogPanel(props: Props) {
  const { content, selection, select } = props;
  const post = content.posts.find((p) => p.id === selection.postId);
  if (post)
    return (
      <PostEditor {...props} post={post} index={content.posts.indexOf(post)} />
    );
  const { update } = props;
  const create = () => {
    const post: Post = {
      id: uid("post"),
      slug: `new-post-${content.posts.length + 1}`,
      title: "New post",
      excerpt: "",
      author: content.posts[0]?.author || `${content.brand.name} team`,
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      cover: "",
      coverAlt: "",
      body: "<p>Start writing…</p>",
      visible: false,
      featured: false,
    };
    update("posts", [post, ...content.posts]);
    select({ panel: "blog", postId: post.id });
  };
  return (
    <div className="panel">
      <h1>Blog</h1>
      <div className="card">
        <Toggle
          label="Show the blog"
          hint={`At ${location.host}/blog, with an RSS feed for readers.`}
          checked={content.blog.enabled}
          onChange={(v) => update("blog.enabled", v)}
        />
        <TextInput
          label="Blog name"
          value={content.blog.title}
          max={80}
          onChange={(v) => update("blog.title", v)}
        />
        <TextInput
          label="Intro"
          multiline
          value={content.blog.intro}
          max={400}
          onChange={(v) => update("blog.intro", v)}
        />
        <div className="row-actions">
          <CopyLinkButton href="/blog" label="Copy blog link" />
          <a
            className="inline-link"
            href="/blog/rss.xml"
            target="_blank"
            rel="noreferrer"
          >
            RSS feed <ArrowSquareOutIcon />
          </a>
        </div>
      </div>
      <button type="button" className="add-big" onClick={create}>
        <PlusIcon /> Write a new post
      </button>
      {content.posts.map((p) => (
        <button
          type="button"
          key={p.id}
          className="card page-row post-row"
          onClick={() => select({ panel: "blog", postId: p.id })}
        >
          {p.cover ? <img src={p.cover} alt="" /> : <ArticleIcon size={28} />}
          <span>
            <strong>{p.title}</strong>
            <small>
              {p.date} · {p.tags.join(", ") || "No topics"}
            </small>
          </span>
          {p.featured && (
            <StarIcon weight="fill" className="star" aria-label="Featured" />
          )}
          <span className={`pill ${p.visible ? "pill-green" : ""}`}>
            {p.visible ? "Live" : "Hidden draft"}
          </span>
        </button>
      ))}
    </div>
  );
}

function PostEditor({
  content,
  update,
  select,
  post,
  index,
}: Props & { post: Post; index: number }) {
  const base = `posts.${index}`;
  const [slugDraft, setSlugDraft] = useState(post.slug);
  useEffect(() => setSlugDraft(post.slug), [post.id, post.slug]);
  const taken = content.posts.some(
    (p) => p.slug === slugDraft && p.id !== post.id,
  );
  const [tagText, setTagText] = useState(post.tags.join(", "));
  useEffect(() => setTagText(post.tags.join(", ")), [post.id]);
  return (
    <div className="panel">
      <button
        type="button"
        className="back-button"
        onClick={() => select({ panel: "blog" })}
      >
        <ArrowLeftIcon /> All posts
      </button>
      <h1>{post.title || "Untitled post"}</h1>
      <div className="card">
        <Toggle
          label={post.visible ? "Live on the blog" : "Hidden draft"}
          hint={
            post.visible
              ? "Readers can see this post after you publish."
              : "Only you can see it. Switch on when it’s ready, then publish."
          }
          checked={post.visible}
          onChange={(v) => update(`${base}.visible`, v)}
        />
        <TextInput
          label="Title"
          multiline
          value={post.title}
          max={160}
          onChange={(v) => update(`${base}.title`, v)}
        />
        <TextInput
          label="Summary"
          multiline
          value={post.excerpt}
          max={400}
          hint="Shown on the blog page, in search results and in the RSS feed."
          onChange={(v) => update(`${base}.excerpt`, v)}
        />
        <RichText
          full
          label="Post"
          value={post.body}
          onChange={(v) => update(`${base}.body`, v)}
        />
      </div>
      <div className="card">
        <h2>Details</h2>
        <Field label="Web address">
          <div className="slug-input">
            <span>/blog/</span>
            <input
              value={slugDraft}
              aria-label="Web address"
              aria-invalid={taken}
              onChange={(e) => {
                const v = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-");
                setSlugDraft(v);
                if (
                  v &&
                  !content.posts.some((p) => p.slug === v && p.id !== post.id)
                )
                  update(`${base}.slug`, v);
              }}
            />
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                const v = slugify(post.title);
                setSlugDraft(v);
                if (
                  v &&
                  !content.posts.some((p) => p.slug === v && p.id !== post.id)
                )
                  update(`${base}.slug`, v);
              }}
            >
              Use title
            </button>
          </div>
        </Field>
        {taken && (
          <p className="error">Another post already uses this address.</p>
        )}
        <div className="two-col">
          <Field label="Date">
            <input
              type="date"
              value={post.date}
              onChange={(e) =>
                e.target.value && update(`${base}.date`, e.target.value)
              }
            />
          </Field>
          <TextInput
            label="Author"
            value={post.author}
            max={80}
            onChange={(v) => update(`${base}.author`, v)}
          />
        </div>
        <TextInput
          label="Topics"
          value={tagText}
          hint="Separate with commas, e.g. Hosting, Guides"
          onChange={(v) => {
            setTagText(v);
            update(
              `${base}.tags`,
              v
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 8),
            );
          }}
        />
        <ImagePicker
          label="Cover image"
          value={post.cover}
          onChange={(v) => update(`${base}.cover`, v)}
        />
        {post.cover && (
          <TextInput
            label="Describe the cover image"
            value={post.coverAlt}
            max={200}
            onChange={(v) => update(`${base}.coverAlt`, v)}
          />
        )}
        <Toggle
          label="Feature this post"
          hint="Shown large at the top of the blog page."
          checked={post.featured}
          onChange={(v) => update(`${base}.featured`, v)}
        />
        <div className="row-actions">
          <CopyLinkButton href={`/blog/${post.slug}`} label="Copy post link" />
          <a
            className="inline-link"
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            Open post <ArrowSquareOutIcon />
          </a>
          <button
            type="button"
            className="button-danger"
            onClick={() => {
              if (
                !confirm(
                  `Delete “${post.title}”? You can undo this with the Undo button.`,
                )
              )
                return;
              update(
                "posts",
                content.posts.filter((p) => p.id !== post.id),
              );
              select({ panel: "blog" });
            }}
          >
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Menus

export function MenusPanel({ content, update }: Props) {
  const menus: ["header" | "footer", string, string][] = [
    ["header", "Top menu", "Shown in the header on every page."],
    ["footer", "Footer links", "Shown at the bottom of every page."],
  ];
  return (
    <div className="panel">
      <h1>Menus</h1>
      <p className="panel-intro">
        Choose which links appear at the top and bottom of every page. Link to
        pages, posts, sections or exact spots.
      </p>
      {menus.map(([key, title, hint]) => {
        const items = content.menus[key];
        const set = (v: MenuItem[]) => update(`menus.${key}`, v);
        return (
          <div className="card" key={key}>
            <h2>{title}</h2>
            <p className="field-hint">{hint}</p>
            {items.map((item, i) => (
              <fieldset className="sub-card" key={i}>
                <legend className="menu-legend">
                  <span>{item.label || `Link ${i + 1}`}</span>
                  <ItemActions
                    index={i}
                    length={items.length}
                    name={item.label || "link"}
                    onMove={(a, b) => set(move(items, a, b))}
                    onRemove={() => set(items.filter((_, j) => j !== i))}
                  />
                </legend>
                <TextInput
                  label="Text"
                  value={item.label}
                  max={40}
                  onChange={(v) => update(`menus.${key}.${i}.label`, v)}
                />
                <LinkField
                  label="Goes to"
                  value={item.href}
                  onChange={(v) => update(`menus.${key}.${i}.href`, v)}
                />
              </fieldset>
            ))}
            {items.length < 12 && (
              <button
                type="button"
                className="add-row"
                onClick={() =>
                  set([...items, { label: "New link", href: "/" }])
                }
              >
                <PlusIcon /> Add a link
              </button>
            )}
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                if (confirm(`Put the original ${title.toLowerCase()} back?`))
                  set(defaultContent.menus[key]);
              }}
            >
              Restore original {title.toLowerCase()}
            </button>
          </div>
        );
      })}
      <p className="field-hint">
        Links to hidden pages still show in menus (visitors would see “page not
        found”). Remove them until the page is ready.
      </p>
    </div>
  );
}
