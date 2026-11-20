// Routing, internal links, deep links ("#anchor" and "?hl=exact text") and the
// shared package cards used by the home page and by pricing blocks on pages.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react";
import {
  formatPrice,
  planAnchor,
  type Page,
  type Post,
  type ServiceId,
  type SiteContent,
} from "./content";
import { T, useSite } from "./editable";

export type Route =
  | { kind: "home" }
  | { kind: "page"; page: Page; index: number }
  | { kind: "blog"; tag: string }
  | { kind: "post"; post: Post; index: number }
  | { kind: "notfound" };

type Location = { path: string; search: string; hash: string };
type RouterValue = Location & {
  route: Route;
  navigate: (href: string) => void;
};
const RouterContext = createContext<RouterValue>(null!);
export const useRouter = () => useContext(RouterContext);

const NOT_APP = /^\/(examples|admin|brand|uploads|api|assets|images)(\/|$)/;

/** True for addresses rendered by this app (home, pages, blog). */
export function isAppPath(path: string) {
  return !NOT_APP.test(path) && !/\.[a-z0-9]{2,5}$/i.test(path);
}

export function resolveRoute(
  path: string,
  search: string,
  content: SiteContent,
  editing: boolean,
): Route {
  const p = path.replace(/\/+$/, "") || "/";
  if (p === "/") return { kind: "home" };
  const blog = p.match(/^\/blog(?:\/([a-z0-9-]+))?$/);
  if (blog && (content.blog.enabled || editing)) {
    if (!blog[1])
      return {
        kind: "blog",
        tag: new URLSearchParams(search).get("tag") || "",
      };
    const index = content.posts.findIndex(
      (post) => post.slug === blog[1] && (post.visible || editing),
    );
    return index >= 0
      ? { kind: "post", post: content.posts[index], index }
      : { kind: "notfound" };
  }
  const slug = p.match(/^\/([a-z0-9-]+)$/)?.[1];
  const index = content.pages.findIndex(
    (page) => page.slug === slug && (page.visible || editing),
  );
  return index >= 0
    ? { kind: "page", page: content.pages[index], index }
    : { kind: "notfound" };
}

function current(): Location {
  return {
    path: location.pathname,
    search: location.search,
    hash: location.hash,
  };
}

export function RouterProvider({
  children,
  controlledPath,
}: {
  children: ReactNode;
  /** Set by the admin preview, which chooses the page to show. */
  controlledPath?: string;
}) {
  const { content, editing } = useSite();
  const [loc, setLoc] = useState<Location>(current);

  const navigate = useCallback((href: string) => {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !isAppPath(url.pathname)) {
      location.href = url.href;
      return;
    }
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash) location.hash = url.hash;
      setLoc(current());
      return;
    }
    history.pushState(null, "", url.pathname + url.search + url.hash);
    setLoc(current());
  }, []);

  useEffect(() => {
    if (controlledPath !== undefined) return;
    const update = () => setLoc(current());
    // Same-site links are handled here so the page doesn't reload.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as HTMLElement).closest("a");
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !isAppPath(url.pathname)) return;
      event.preventDefault();
      navigate(url.href);
    };
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
      document.removeEventListener("click", onClick);
    };
  }, [controlledPath, navigate]);

  const effective = useMemo(() => {
    if (controlledPath === undefined) return loc;
    const url = new URL(controlledPath, location.origin);
    return { path: url.pathname, search: url.search, hash: url.hash };
  }, [controlledPath, loc]);
  const route = resolveRoute(
    effective.path,
    effective.search,
    content,
    editing,
  );

  return (
    <RouterContext.Provider value={{ ...effective, route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

/** Finds `text` inside `root`, highlights it and returns the element holding it. */
export function highlightText(text: string, root: HTMLElement) {
  const wanted = text.trim().toLowerCase();
  if (!wanted) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: [Text, number][] = [];
  let all = "";
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    nodes.push([node, all.length]);
    all += node.data;
  }
  const start = all.toLowerCase().indexOf(wanted);
  if (start < 0) return null;
  const end = start + wanted.length;
  const locate = (offset: number) => {
    for (let i = nodes.length - 1; i >= 0; i--)
      if (nodes[i][1] <= offset)
        return [nodes[i][0], offset - nodes[i][1]] as const;
    return [nodes[0][0], 0] as const;
  };
  const [startNode, startOffset] = locate(start);
  const [endNode, endOffset] = locate(end);
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, Math.min(endOffset, endNode.length));
  if ("highlights" in CSS && typeof Highlight !== "undefined")
    CSS.highlights.set("wtp-target", new Highlight(range));
  return startNode.parentElement;
}

/**
 * After each navigation, scrolls to "#anchor" (opening FAQ answers and the
 * right package tab) and highlights "?hl=" text when a link asks for it.
 */
export function useDeepLinks(setService: (id: ServiceId) => void) {
  const { path, search, hash } = useRouter();
  const { editing, content } = useSite();
  useEffect(() => {
    if (editing) return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const hl = new URLSearchParams(search).get("hl") || "";
    if (id.startsWith("plan-")) {
      const service = content.services.find((s) =>
        id.startsWith(`plan-${s.id}-`),
      );
      if (service) setService(service.id);
    }
    let timer: ReturnType<typeof setTimeout>;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        let target = id ? document.getElementById(id) : null;
        if (target instanceof HTMLDetailsElement) target.open = true;
        if (hl) {
          const found = highlightText(
            hl,
            target || document.getElementById("main")!,
          );
          if (found) target = found;
        }
        if (target) {
          target.scrollIntoView({ block: hl ? "center" : "start" });
          target.classList.add("is-target");
          timer = setTimeout(() => target?.classList.remove("is-target"), 2600);
        } else if (!id) window.scrollTo(0, 0);
      }),
    );
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
    // Content is read for the services list only; re-running on edits isn't wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, search, hash, editing]);
}

type Actions = { consult: (service?: string, detail?: string) => void };
export const ActionsContext = createContext<Actions>({ consult: () => {} });
export const useActions = () => useContext(ActionsContext);

/** Click-to-edit-aware attribute that tells the admin which panel to open. */
export function selectAttr(value: object) {
  return { "data-select": JSON.stringify(value) };
}

/** The package cards for one service (home page tabs and pricing blocks). */
export function PlanGrid({ serviceIndex }: { serviceIndex: number }) {
  const { content, editing } = useSite();
  const { consult } = useActions();
  const service = content.services[serviceIndex];
  return (
    <div className={`pricing-grid plans-${service.plans.length}`}>
      {service.plans.map((plan, planIndex) => {
        const base = `services.${serviceIndex}.plans.${planIndex}`;
        return (
          <article
            key={planIndex}
            id={planAnchor(service.id, plan.name)}
            className={`plan ${plan.featured ? "plan-featured" : ""}`}
            {...selectAttr({
              panel: "packages",
              service: service.id,
              plan: planIndex,
            })}
          >
            <div className="plan-label">
              {plan.featured ? (
                <>
                  <span className="plan-label-mark">↗</span>{" "}
                  <T path={`${base}.label`} />
                </>
              ) : (
                <span aria-hidden="true">&nbsp;</span>
              )}
            </div>
            <div className="plan-inner">
              <T as="h4" path={`${base}.name`} />
              <T
                as="p"
                className="plan-description"
                path={`${base}.description`}
              />
              <div
                className={`price ${plan.price === null && !editing ? "price-quote" : ""}`}
              >
                {plan.price === null && !editing ? (
                  <span>Let’s talk.</span>
                ) : (
                  <>
                    <span className="price-from">
                      {["hosting", "design", "support"].includes(service.id)
                        ? "FROM"
                        : "AUD"}
                    </span>
                    <span className="price-amount">
                      <span className="currency">$</span>
                      {editing ? (
                        <T
                          path={`${base}.price`}
                          number
                          label={`${plan.name} price (leave empty for quote only)`}
                        />
                      ) : (
                        formatPrice(plan.price!)
                      )}
                      <T as="small" path={`${base}.unit`} />
                    </span>
                  </>
                )}
              </div>
              <ul className="plan-features">
                {plan.features.map((_, i) => (
                  <li key={i}>
                    <CheckIcon size={16} weight="bold" />
                    <T path={`${base}.features.${i}`} />
                  </li>
                ))}
              </ul>
              <button
                className={`button ${plan.featured ? "button-yellow" : "button-outline"}`}
                onClick={() =>
                  consult(service.title, `I'm interested in ${plan.name}.`)
                }
              >
                {plan.price === null
                  ? "Request a quote"
                  : `Enquire about ${plan.name.replace(" Email", "")}`}
                <ArrowUpRightIcon size={18} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
