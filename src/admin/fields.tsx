import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  LinkIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  PlusIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TrashIcon,
  UploadSimpleIcon,
  EraserIcon,
  ImagesIcon,
} from "@phosphor-icons/react";
import { api } from "./api";

export function Field({
  label,
  hint,
  children,
  count,
  max,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  count?: number;
  max?: number;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {max !== undefined && count !== undefined && (
          <span className={`counter ${count > max ? "over" : ""}`}>
            {count}/{max}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  max,
  multiline,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  max?: number;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint} count={value.length} max={max}>
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export function PriceInput({
  value,
  onChange,
  label = "Price (AUD)",
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  label?: string;
}) {
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => {
    setText((t) =>
      Number(t) === value && t !== "" ? t : value === null ? "" : String(value),
    );
  }, [value]);
  const quote = value === null;
  return (
    <div className="price-input">
      <Field label={label}>
        <div className="money">
          <span>$</span>
          <input
            inputMode="decimal"
            value={quote ? "" : text}
            disabled={quote}
            placeholder={quote ? "Quote only" : "0"}
            onChange={(e) => {
              const t = e.target.value.replace(/[^0-9.]/g, "");
              setText(t);
              if (t !== "" && Number.isFinite(Number(t))) onChange(Number(t));
            }}
          />
        </div>
      </Field>
      <Toggle
        label="Quote only"
        hint="Shows “Let’s talk” instead of a price"
        checked={quote}
        onChange={(q) => onChange(q ? null : Number(text) || 0)}
      />
    </div>
  );
}

/** Up / down / duplicate / delete controls for an item in a list. */
export function ItemActions({
  index,
  length,
  onMove,
  onRemove,
  onDuplicate,
  name,
}: {
  index: number;
  length: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  name: string;
}) {
  return (
    <div className="item-actions">
      <button
        type="button"
        title="Move up"
        aria-label={`Move ${name} up`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUpIcon />
      </button>
      <button
        type="button"
        title="Move down"
        aria-label={`Move ${name} down`}
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDownIcon />
      </button>
      {onDuplicate && (
        <button
          type="button"
          title="Duplicate"
          aria-label={`Duplicate ${name}`}
          onClick={onDuplicate}
        >
          <CopyIcon />
        </button>
      )}
      <button
        type="button"
        className="danger"
        title="Delete"
        aria-label={`Delete ${name}`}
        onClick={() => {
          if (
            confirm(`Delete “${name}”? You can undo this with the Undo button.`)
          )
            onRemove();
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export function move<T>(list: T[], from: number, to: number) {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function StringList({
  label,
  items,
  onChange,
  addLabel,
  max = 20,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  addLabel: string;
  max?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  useEffect(() => {
    if (focusIndex !== null) refs.current[focusIndex]?.focus();
    setFocusIndex(null);
  }, [focusIndex]);
  return (
    <fieldset className="string-list">
      <legend>{label}</legend>
      {items.map((item, i) => (
        <div className="string-row" key={i}>
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={item}
            aria-label={`${label} ${i + 1}`}
            onChange={(e) =>
              onChange(items.map((v, j) => (j === i ? e.target.value : v)))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && items.length < max) {
                e.preventDefault();
                const copy = [...items];
                copy.splice(i + 1, 0, "");
                onChange(copy);
                setFocusIndex(i + 1);
              }
            }}
          />
          <button
            type="button"
            title="Move up"
            aria-label={`Move ${label} ${i + 1} up`}
            disabled={i === 0}
            onClick={() => onChange(move(items, i, i - 1))}
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            className="danger"
            title="Remove"
            aria-label={`Remove ${label} ${i + 1}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          className="add-row"
          onClick={() => {
            onChange([...items, ""]);
            setFocusIndex(items.length);
          }}
        >
          <PlusIcon /> {addLabel}
        </button>
      )}
    </fieldset>
  );
}

/** Small word-processor style editor: bold, italic, links and lists. */
export function RichText({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (document.activeElement !== el && el.innerHTML !== value)
      el.innerHTML = value;
  }, [value]);
  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current!.innerHTML);
  };
  const tools: [string, ReactNode, () => void][] = [
    ["Bold", <TextBIcon key="b" />, () => exec("bold")],
    ["Italic", <TextItalicIcon key="i" />, () => exec("italic")],
    ["Underline", <TextUnderlineIcon key="u" />, () => exec("underline")],
    [
      "Add link",
      <LinkIcon key="l" />,
      () => {
        const url = prompt(
          "Link address (https://…, mailto: or /page)",
          "https://",
        );
        if (url) exec("createLink", url);
      },
    ],
    [
      "Bulleted list",
      <ListBulletsIcon key="ul" />,
      () => exec("insertUnorderedList"),
    ],
    [
      "Numbered list",
      <ListNumbersIcon key="ol" />,
      () => exec("insertOrderedList"),
    ],
    ["Clear formatting", <EraserIcon key="c" />, () => exec("removeFormat")],
  ];
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="rich">
        <div
          className="rich-toolbar"
          role="toolbar"
          aria-label={`${label} formatting`}
        >
          {tools.map(([name, icon, run]) => (
            <button
              key={name}
              type="button"
              title={name}
              aria-label={name}
              onMouseDown={(e) => e.preventDefault()}
              onClick={run}
            >
              {icon}
            </button>
          ))}
        </div>
        <div
          ref={ref}
          className="rich-body"
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}

export function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [library, setLibrary] = useState<string[] | null>(null);
  const builtIn = [
    "business",
    "store",
    "restaurant",
    "trades",
    "clinic",
    "saas",
    "blog",
    "crm",
  ].map((id) => `/images/project-${id}.webp`);
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="image-picker">
        {value ? (
          <img src={value} alt="" />
        ) : (
          <div className="image-empty">No image</div>
        )}
        <div className="image-buttons">
          <label className="button-secondary">
            <UploadSimpleIcon /> {busy ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setBusy(true);
                setError("");
                try {
                  onChange((await api.upload(file)).url);
                } catch (err) {
                  setError((err as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <button
            type="button"
            className="button-secondary"
            onClick={async () => {
              if (library) return setLibrary(null);
              const uploaded = await api.uploads().catch(() => ({ files: [] }));
              setLibrary([...uploaded.files.map((f) => f.url), ...builtIn]);
            }}
          >
            <ImagesIcon /> {library ? "Close library" : "Choose existing"}
          </button>
        </div>
      </div>
      <span className="field-hint">
        PNG, JPEG, WebP or GIF up to 8 MB. Landscape (3:2) looks best.
      </span>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {library && (
        <div className="library">
          {library.map((url) => (
            <button
              key={url}
              type="button"
              className={url === value ? "is-selected" : ""}
              onClick={() => {
                onChange(url);
                setLibrary(null);
              }}
            >
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
