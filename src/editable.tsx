import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  type ElementType,
} from "react";
import { getPath, formatPrice, type SiteContent } from "./content";

type EditContext = {
  content: SiteContent;
  editing: boolean;
  onEdit: (path: string, value: unknown) => void;
};
export const ContentContext = createContext<EditContext>(null!);
export const useSite = () => useContext(ContentContext);

type Props = {
  path: string;
  as?: ElementType;
  className?: string;
  /** Allows bold, italic, links and lists (FAQ answers). */
  rich?: boolean;
  /** Edits a price: empty means "quote only". */
  number?: boolean;
  multiline?: boolean;
  label?: string;
};

/**
 * Renders a piece of site text. In the admin visual editor the same element
 * becomes directly editable, so people change the real page in place.
 */
export function T({
  path,
  as = "span",
  className,
  rich,
  number,
  multiline,
  label,
}: Props) {
  const { content, editing, onEdit } = useSite();
  const raw = getPath(content, path);
  const text =
    number && typeof raw === "number" ? formatPrice(raw) : String(raw ?? "");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (rich) {
      if (el.innerHTML !== text) el.innerHTML = text;
    } else if (el.textContent !== text) el.textContent = text;
  }, [text, rich, editing]);

  if (!editing) {
    if (rich)
      return createElement(as, {
        className,
        dangerouslySetInnerHTML: { __html: text },
      });
    return createElement(as, { className }, text);
  }

  const commit = (el: HTMLElement) => {
    if (rich) return onEdit(path, el.innerHTML);
    const value = el.innerText.replace(/\u00a0/g, " ");
    if (!number)
      return onEdit(path, multiline ? value : value.replace(/\n/g, " "));
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = cleaned === "" ? null : Number(cleaned);
    if (parsed !== null && !Number.isFinite(parsed)) el.textContent = text;
    else onEdit(path, parsed);
  };

  return createElement(as, {
    ref,
    className: `${className || ""} is-editable${number ? " is-number" : ""}`,
    contentEditable: rich ? true : "plaintext-only",
    suppressContentEditableWarning: true,
    spellCheck: true,
    role: "textbox",
    "aria-label": label || `Edit ${path}`,
    "aria-multiline": rich || multiline ? true : undefined,
    "data-edit-path": path,
    "data-placeholder": number ? "Quote" : "Click to type…",
    onInput: (e: React.FormEvent<HTMLElement>) => {
      if (!number) commit(e.currentTarget);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => commit(e.currentTarget),
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" && !rich && !multiline) {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (e.key === " ") e.stopPropagation();
    },
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
  });
}
