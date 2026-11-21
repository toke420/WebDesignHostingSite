// Custom pages (built from blocks), the blog and the "not found" page.
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ClockIcon,
  EyeSlashIcon,
  LinkSimpleIcon,
  MinusIcon,
  PlusIcon,
  RssSimpleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  formatDate,
  tagSlug,
  type Page,
  type PageBlock,
  type Post,
} from "./content";
import { T, useSite } from "./editable";
import {
  PlanGrid,
  selectAttr,
  useActions,
  useRouter,
  type Route,
} from "./site";

export function RouteView({
  route,
}: {
  route: Exclude<Route, { kind: "home" }>;
}) {
  if (route.kind === "page")
    return <PageView page={route.page} index={route.index} />;
  if (route.kind === "blog") return <BlogIndex tag={route.tag} />;
  if (route.kind === "post")
    return <PostView post={route.post} index={route.index} />;
  return <NotFound />;
}

function HiddenNotice({ what }: { what: string }) {
  return (
    <p className="hidden-notice container">
      <EyeSlashIcon size={18} /> This {what} is hidden. Visitors can’t see it
      until you switch it on and publish.
    </p>
  );
}

export function PageView({ page, index }: { page: Page; index: number }) {
  const { editing } = useSite();
  return (
    <div className="custom-page">
      {editing && !page.visible && <HiddenNotice what="page" />}
      {page.blocks.length === 0 && editing && (
        <p className="container empty-page">
          This page is empty. Add a block from the panel on the left.
        </p>
      )}
      {page.blocks.map((block, j) => (
        <Block
          key={block.id + j}
          block={block}
          base={`pages.${index}.blocks.${j}`}
          pageId={page.id}
          index={j}
        />
      ))}
    </div>
  );
}

function Link({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:/i.test(href) && !href.startsWith(location.origin);
  return (
    <a
      href={href || "#"}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function Block({
  block,
  base,
  pageId,
  index,
}: {
  block: PageBlock;
  base: string;
  pageId: string;
  index: number;
}) {
  const { content, editing } = useSite();
  const { consult } = useActions();
  const wrap = (children: React.ReactNode, extra = "") => (
    <section
      id={block.anchor || undefined}
      className={`block block-${block.type} ${extra}`}
      data-block-index={index}
      {...selectAttr({ panel: "pages", pageId, block: index })}
    >
      {children}
    </section>
  );

  switch (block.type) {
    case "hero":
      return wrap(
        <div
          className={`container block-hero-inner ${block.image ? "has-image" : ""}`}
        >
          <div>
            {(block.eyebrow || editing) && (
              <p className="eyebrow">
                <span className="eyebrow-line" /> <T path={`${base}.eyebrow`} />
              </p>
            )}
            <T as="h1" path={`${base}.heading`} multiline />
            <T as="p" className="hero-intro" path={`${base}.text`} multiline />
            {(block.buttonLabel || editing) && (
              <Link href={block.buttonLink} className="button button-yellow">
                <T path={`${base}.buttonLabel`} />{" "}
                <ArrowUpRightIcon size={18} />
              </Link>
            )}
          </div>
          {block.image && <img src={block.image} alt="" />}
        </div>,
      );
    case "heading":
      return wrap(
        <div className="container">
          <T as={block.level === 3 ? "h3" : "h2"} path={`${base}.text`} />
        </div>,
      );
    case "text":
      return wrap(
        <div className="container">
          <T as="div" className="prose" path={`${base}.html`} rich />
        </div>,
      );
    case "image":
      return wrap(
        <figure className={`container ${block.wide ? "" : "narrow"}`}>
          {block.src ? (
            <img src={block.src} alt={block.alt} loading="lazy" />
          ) : (
            <div className="image-placeholder">
              Choose an image in the panel
            </div>
          )}
          {(block.caption || editing) && (
            <T as="figcaption" path={`${base}.caption`} />
          )}
        </figure>,
      );
    case "button":
      return wrap(
        <div className="container">
          <Link
            href={block.link}
            className={`button ${block.style === "outline" ? "button-outline" : "button-yellow"}`}
          >
            <T path={`${base}.label`} /> <ArrowUpRightIcon size={18} />
          </Link>
        </div>,
      );
    case "cards":
      return wrap(
        <div className="container">
          {(block.heading || editing) && <T as="h2" path={`${base}.heading`} />}
          <div className={`card-grid cards-${block.items.length}`}>
            {block.items.map((item, i) => (
              <article className="info-card" key={i}>
                <T as="h3" path={`${base}.items.${i}.title`} />
                <T as="p" path={`${base}.items.${i}.text`} multiline />
                {item.link && (
                  <Link href={item.link} className="text-link">
                    Learn more <ArrowUpRightIcon size={16} />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>,
      );
    case "quote":
      return wrap(
        <blockquote className="container">
          <T as="p" path={`${base}.text`} multiline />
          {(block.cite || editing) && <T as="cite" path={`${base}.cite`} />}
        </blockquote>,
      );
    case "pricing": {
      const serviceIndex = content.services.findIndex(
        (s) => s.id === block.service,
      );
      if (serviceIndex < 0) return null;
      return wrap(
        <div className="container">
          {(block.heading || editing) && <T as="h2" path={`${base}.heading`} />}
          <PlanGrid serviceIndex={serviceIndex} />
          <T
            as="p"
            className="pricing-note"
            path={`services.${serviceIndex}.note`}
            multiline
          />
        </div>,
      );
    }
    case "faq": {
      const list = content.faqs
        .map((faq, i) => ({ faq, i }))
        .filter(({ faq }) => !block.ids.length || block.ids.includes(faq.id));
      return wrap(
        <div className="container faq-block">
          {(block.heading || editing) && <T as="h2" path={`${base}.heading`} />}
          <div className="faq-list">
            {list.map(({ faq, i }) => (
              <FaqItem key={faq.id} id={faq.id} index={i} />
            ))}
          </div>
        </div>,
      );
    }
    case "cta":
      return wrap(
        <div className="container">
          <div className="consultation-box">
            <span className="consultation-icon" aria-hidden="true">
              <ArrowUpRightIcon size={82} weight="light" />
            </span>
            <div>
              <T as="h2" path={`${base}.heading`} multiline />
              <T as="p" path={`${base}.text`} multiline />
              {block.buttonLink ? (
                <Link href={block.buttonLink} className="button button-dark">
                  <T path={`${base}.buttonLabel`} />{" "}
                  <ArrowUpRightIcon size={20} />
                </Link>
              ) : (
                <button
                  className="button button-dark"
                  onClick={() => consult()}
                >
                  <T path={`${base}.buttonLabel`} />{" "}
                  <ArrowUpRightIcon size={20} />
                </button>
              )}
            </div>
          </div>
        </div>,
        "consultation-section",
      );
    case "posts": {
      const posts = content.posts
        .filter(
          (p) =>
            p.visible &&
            (!block.tag ||
              p.tags.some((t) => tagSlug(t) === tagSlug(block.tag))),
        )
        .slice(0, block.count);
      return wrap(
        <div className="container">
          {(block.heading || editing) && <T as="h2" path={`${base}.heading`} />}
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>,
      );
    }
    case "divider":
      return wrap(<hr className="container" />);
  }
}

export function FaqItem({ id, index }: { id: string; index: number }) {
  const { content, editing } = useSite();
  if (editing)
    return (
      <div
        className="faq-edit"
        id={`faq-${id}`}
        {...selectAttr({ panel: "faqs", faq: index })}
      >
        <T as="div" className="faq-q" path={`faqs.${index}.question`} />
        <T as="div" className="faq-a" path={`faqs.${index}.answer`} rich />
      </div>
    );
  return (
    <details id={`faq-${id}`}>
      <summary>
        {content.faqs[index].question}
        <PlusIcon className="faq-plus" size={20} />
        <MinusIcon className="faq-minus" size={20} />
      </summary>
      <T as="div" className="faq-a" path={`faqs.${index}.answer`} rich />
    </details>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <a className="post-card" href={`/blog/${post.slug}`}>
      <div className="post-card-image">
        {post.cover ? (
          <img src={post.cover} alt="" loading="lazy" />
        ) : (
          <span aria-hidden="true">{post.title.charAt(0)}</span>
        )}
      </div>
      {post.tags[0] && <span className="post-tag">{post.tags[0]}</span>}
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="post-meta">{formatDate(post.date)}</span>
    </a>
  );
}

function BlogIndex({ tag }: { tag: string }) {
  const { content, editing } = useSite();
  const posts = content.posts.filter((p) => p.visible || editing);
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const activeTag = tags.find((t) => tagSlug(t) === tag);
  const shown = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;
  const featured = !activeTag
    ? shown.find((p) => p.featured) || shown[0]
    : undefined;
  const rest = shown.filter((p) => p !== featured);
  return (
    <div className="blog container" {...selectAttr({ panel: "blog" })}>
      <header className="blog-head">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" /> BLOG
          </p>
          <T as="h1" path="blog.title" />
          <T as="p" className="section-intro" path="blog.intro" multiline />
        </div>
        <a
          className="text-link"
          href="/blog/rss.xml"
          target="_blank"
          rel="noreferrer"
        >
          <RssSimpleIcon size={18} /> RSS feed
        </a>
      </header>
      {tags.length > 1 && (
        <nav className="tag-filter" aria-label="Filter by topic">
          <a href="/blog" aria-current={!activeTag ? "page" : undefined}>
            All
          </a>
          {tags.map((t) => (
            <a
              key={t}
              href={`/blog?tag=${tagSlug(t)}`}
              aria-current={t === activeTag ? "page" : undefined}
            >
              {t}
            </a>
          ))}
        </nav>
      )}
      {featured && (
        <a className="post-featured" href={`/blog/${featured.slug}`}>
          {featured.cover && (
            <img src={featured.cover} alt={featured.coverAlt} />
          )}
          <div>
            <span className="post-tag">
              Featured{featured.tags[0] ? ` · ${featured.tags[0]}` : ""}
            </span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className="post-meta">
              {featured.author && `${featured.author} · `}
              {formatDate(featured.date)}
            </span>
          </div>
        </a>
      )}
      <div className="post-grid">
        {rest.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {shown.length === 0 && <p className="section-intro">No posts yet.</p>}
    </div>
  );
}

function readingTime(html: string) {
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function PostView({ post, index }: { post: Post; index: number }) {
  const { content, editing } = useSite();
  const { consult } = useActions();
  const { path } = useRouter();
  const [copied, setCopied] = useState(false);
  const related = content.posts
    .filter((p) => p.visible && p.id !== post.id)
    .sort(
      (a, b) =>
        Number(b.tags.some((t) => post.tags.includes(t))) -
        Number(a.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3);
  const base = `posts.${index}`;
  return (
    <article
      className="post"
      {...selectAttr({ panel: "blog", postId: post.id })}
    >
      {editing && !post.visible && <HiddenNotice what="post" />}
      <header className="container post-head">
        <a className="text-link back" href="/blog">
          <ArrowLeftIcon size={16} /> All posts
        </a>
        <div className="post-tags">
          {post.tags.map((t) => (
            <a key={t} className="post-tag" href={`/blog?tag=${tagSlug(t)}`}>
              {t}
            </a>
          ))}
        </div>
        <T as="h1" path={`${base}.title`} multiline />
        <T as="p" className="post-excerpt" path={`${base}.excerpt`} multiline />
        <p className="post-meta">
          {post.author && `${post.author} · `}
          {formatDate(post.date)} · <ClockIcon size={14} />{" "}
          {readingTime(post.body)} min read
        </p>
      </header>
      {post.cover && (
        <img
          className="post-cover container"
          src={post.cover}
          alt={post.coverAlt}
        />
      )}
      <T
        as="div"
        className="prose post-body container"
        path={`${base}.body`}
        rich
      />
      <div className="container post-foot">
        <button
          className="text-link"
          onClick={() => {
            navigator.clipboard?.writeText(location.origin + path).then(
              () => setCopied(true),
              () => {},
            );
          }}
        >
          <LinkSimpleIcon size={18} /> {copied ? "Link copied" : "Copy link"}
        </button>
        <div className="consultation-box small">
          <div>
            <h2>Want help with this?</h2>
            <p>
              Talk it through in a free {content.brand.consultationMinutes}
              -minute consultation.
            </p>
            <button
              className="button button-dark"
              onClick={() => consult("Not sure yet", `I read “${post.title}”.`)}
            >
              Free consultation <ArrowUpRightIcon size={20} />
            </button>
          </div>
        </div>
        {related.length > 0 && (
          <section className="related">
            <h2>Keep reading</h2>
            <div className="post-grid">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">
        <span className="eyebrow-line" /> PAGE NOT FOUND
      </p>
      <h1>
        That page has moved on.
        <br />
        <span className="muted">Let’s get you back on track.</span>
      </h1>
      <div className="hero-actions">
        <a className="button button-yellow" href="/">
          Back to home <ArrowUpRightIcon size={18} />
        </a>
        <a className="text-link" href="/blog">
          Read the blog <ArrowUpRightIcon size={18} />
        </a>
      </div>
    </section>
  );
}
