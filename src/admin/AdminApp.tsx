import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowArcLeftIcon,
  ArrowArcRightIcon,
  ArrowSquareOutIcon,
  ClockCounterClockwiseIcon,
  CurrencyDollarIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  GearSixIcon,
  HouseIcon,
  IdentificationCardIcon,
  QuestionIcon,
  RocketLaunchIcon,
  SquaresFourIcon,
  StorefrontIcon,
  TextAaIcon,
  UserCircleIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  WarningCircleIcon,
  ListIcon,
  EyeIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import { setPath, type SiteContent } from "../content";
import { api, AuthError } from "./api";
import {
  AccountPanel,
  BrandPanel,
  FaqPanel,
  HistoryPanel,
  HomePanel,
  PackagesPanel,
  SettingsPanel,
  ShowcasePanel,
  TextPanel,
  groupScroll,
  isServiceId,
  panelScroll,
  type Selection,
} from "./panels";

const nav = [
  { id: "home", label: "Start here", icon: HouseIcon },
  { id: "packages", label: "Packages & prices", icon: CurrencyDollarIcon },
  { id: "faqs", label: "Questions & answers", icon: QuestionIcon },
  { id: "showcase", label: "Showcase sites", icon: SquaresFourIcon },
  { id: "text", label: "Page text", icon: TextAaIcon },
  { id: "brand", label: "Business & Google", icon: IdentificationCardIcon },
  { id: "settings", label: "Site settings", icon: GearSixIcon },
  { id: "history", label: "History", icon: ClockCounterClockwiseIcon },
  { id: "account", label: "Account", icon: UserCircleIcon },
];
const devices = [
  { id: "desktop", label: "Desktop", icon: DesktopIcon, width: "100%" },
  { id: "tablet", label: "Tablet", icon: DeviceTabletIcon, width: "820px" },
  { id: "mobile", label: "Phone", icon: DeviceMobileIcon, width: "390px" },
];
type SaveState = "saved" | "saving" | "unsaved" | "error";

export default function AdminApp() {
  const [auth, setAuth] = useState<"checking" | "out" | "in">("checking");
  useEffect(() => {
    api.session().then(
      (s) => setAuth(s.authenticated ? "in" : "out"),
      () => setAuth("out"),
    );
  }, []);
  if (auth === "checking")
    return (
      <div className="center-screen">
        <CircleNotchIcon className="spin" size={32} />
      </div>
    );
  if (auth === "out") return <Login onDone={() => setAuth("in")} />;
  return <Editor onSignedOut={() => setAuth("out")} />;
}

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="center-screen login">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await api.login(password);
            onDone();
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="login-mark" aria-hidden="true">
          w<span>.</span>
        </div>
        <h1>Website editor</h1>
        <p>Sign in to update your prices, questions and page text.</p>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button-primary" disabled={busy} type="submit">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a className="back-link" href="/">
          ← Back to the website
        </a>
      </form>
    </div>
  );
}

function Editor({ onSignedOut }: { onSignedOut: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [panel, setPanel] = useState("home");
  const [selection, setSelection] = useState<Selection>({});
  const [device, setDevice] = useState("desktop");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [unpublished, setUnpublished] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [publishing, setPublishing] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const frameReady = useRef(false);
  const undoStack = useRef<SiteContent[]>([]);
  const redoStack = useRef<SiteContent[]>([]);
  const lastPush = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = useRef<SiteContent | null>(null);
  const [, forceRender] = useState(0);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof AuthError) onSignedOut();
      else setToast({ text: (err as Error).message, ok: false });
    },
    [onSignedOut],
  );

  useEffect(() => {
    api.draft().then((d) => {
      setContent(d.content);
      latest.current = d.content;
      setUnpublished(d.hasUnpublished);
    }, handleError);
  }, [handleError]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  // Send the draft to the preview whenever it changes.
  const postToFrame = useCallback((message: object) => {
    frame.current?.contentWindow?.postMessage(message, location.origin);
  }, []);
  useEffect(() => {
    if (content && frameReady.current)
      postToFrame({ type: "wtp:content", content });
  }, [content, postToFrame]);

  const scheduleSave = useCallback(() => {
    setSaveState("unsaved");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!latest.current) return;
      setSaveState("saving");
      try {
        await api.save(latest.current);
        setSaveState("saved");
        setUnpublished(true);
      } catch (err) {
        setSaveState("error");
        handleError(err);
      }
    }, 900);
  }, [handleError]);

  const apply = useCallback(
    (next: SiteContent, recordUndo = true) => {
      const prev = latest.current;
      if (recordUndo && prev) {
        // Group quick typing into one undo step.
        if (Date.now() - lastPush.current > 800) {
          undoStack.current.push(prev);
          if (undoStack.current.length > 100) undoStack.current.shift();
        }
        lastPush.current = Date.now();
        redoStack.current = [];
      }
      latest.current = next;
      setContent(next);
      scheduleSave();
    },
    [scheduleSave],
  );
  const update = useCallback(
    (path: string, value: unknown) => {
      if (latest.current) apply(setPath(latest.current, path, value));
    },
    [apply],
  );
  const undo = () => {
    const prev = undoStack.current.pop();
    if (!prev || !latest.current) return;
    redoStack.current.push(latest.current);
    lastPush.current = 0;
    apply(prev, false);
    forceRender((n) => n + 1);
  };
  const redo = () => {
    const next = redoStack.current.pop();
    if (!next || !latest.current) return;
    undoStack.current.push(latest.current);
    apply(next, false);
    forceRender((n) => n + 1);
  };

  const select = useCallback(
    (s: Selection) => {
      const next = s.panel || "home";
      setPanel(next);
      setSelection(s);
      setMenuOpen(false);
      if (isServiceId(s.service))
        postToFrame({ type: "wtp:service", id: s.service });
      if (s.service === "logo")
        postToFrame({ type: "wtp:service", id: "design" });
      const target = s.group ? groupScroll[s.group] : panelScroll[next];
      if (target && !s.fromPreview) postToFrame({ type: "wtp:scroll", target });
    },
    [postToFrame],
  );

  // Messages from the preview: ready, inline edits and clicks on blocks.
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      const data = event.data || {};
      if (data.type === "wtp:ready") {
        frameReady.current = true;
        if (latest.current)
          postToFrame({ type: "wtp:content", content: latest.current });
      }
      if (data.type === "wtp:edit") update(data.path, data.value);
      if (data.type === "wtp:select") {
        const { type: _type, ...rest } = data;
        select({ ...rest, fromPreview: true });
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [update, select, postToFrame]);

  // Keyboard shortcuts and leave warning.
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const tag = (e.target as HTMLElement).tagName;
      if (
        ["INPUT", "TEXTAREA"].includes(tag) ||
        (e.target as HTMLElement).isContentEditable
      )
        return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        e.key.toLowerCase() === "y" ||
        (e.key.toLowerCase() === "z" && e.shiftKey)
      ) {
        e.preventDefault();
        redo();
      }
    };
    const leave = (e: BeforeUnloadEvent) => {
      if (saveState !== "saved") e.preventDefault();
    };
    window.addEventListener("keydown", keys);
    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("keydown", keys);
      window.removeEventListener("beforeunload", leave);
    };
  });

  const replaceAll = (next: SiteContent, message: string) => {
    apply(next);
    setToast({ text: message, ok: true });
    forceRender((n) => n + 1);
  };

  const publish = async () => {
    if (!latest.current) return;
    setPublishing(true);
    clearTimeout(saveTimer.current);
    try {
      const result = await api.publish(latest.current);
      latest.current = result.content;
      setContent(result.content);
      setSaveState("saved");
      setUnpublished(false);
      setToast({ text: "Published! Your changes are now live.", ok: true });
    } catch (err) {
      handleError(err);
    } finally {
      setPublishing(false);
    }
  };

  if (!content)
    return (
      <div className="center-screen">
        <CircleNotchIcon className="spin" size={32} />
      </div>
    );

  const props = { content, update, selection, select };
  const statusText = {
    saved: unpublished ? "Draft saved · not live yet" : "Everything is live",
    saving: "Saving draft…",
    unsaved: "Saving draft…",
    error: "Couldn’t save. Check your connection.",
  }[saveState];
  const StatusIcon =
    saveState === "error"
      ? WarningCircleIcon
      : saveState === "saved"
        ? CheckCircleIcon
        : CircleNotchIcon;

  return (
    <div className={`admin device-${device} view-${mobileView}`}>
      <header className="topbar">
        <button
          className="icon-button menu-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <ListIcon size={22} />
        </button>
        <a className="admin-brand" href="/" target="_blank" rel="noreferrer">
          <span aria-hidden="true">
            w<b>.</b>
          </span>
          Website editor
        </a>
        <span className={`status status-${saveState}`} role="status">
          <StatusIcon
            className={
              saveState === "saving" || saveState === "unsaved" ? "spin" : ""
            }
          />
          {statusText}
        </span>
        <div className="topbar-actions">
          <button
            className="icon-button"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            disabled={!undoStack.current.length}
            onClick={undo}
          >
            <ArrowArcLeftIcon size={20} />
          </button>
          <button
            className="icon-button"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            disabled={!redoStack.current.length}
            onClick={redo}
          >
            <ArrowArcRightIcon size={20} />
          </button>
          <div className="devices" role="group" aria-label="Preview size">
            {devices.map((d) => (
              <button
                key={d.id}
                className="icon-button"
                aria-pressed={device === d.id}
                title={d.label}
                aria-label={`${d.label} preview`}
                onClick={() => setDevice(d.id)}
              >
                <d.icon size={20} />
              </button>
            ))}
          </div>
          <a
            className="button-secondary hide-small"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            <StorefrontIcon /> View live site <ArrowSquareOutIcon />
          </a>
          {unpublished && (
            <button
              className="button-secondary hide-small"
              onClick={async () => {
                if (
                  !confirm("Throw away all changes since you last published?")
                )
                  return;
                try {
                  clearTimeout(saveTimer.current);
                  const r = await api.discard();
                  undoStack.current.push(latest.current!);
                  latest.current = r.content;
                  setContent(r.content);
                  setSaveState("saved");
                  setUnpublished(false);
                  setToast({
                    text: "Changes discarded. Showing the live version.",
                    ok: true,
                  });
                } catch (err) {
                  handleError(err);
                }
              }}
            >
              Discard changes
            </button>
          )}
          <button
            className="button-primary"
            disabled={publishing || (!unpublished && saveState === "saved")}
            onClick={publish}
          >
            <RocketLaunchIcon />{" "}
            {publishing ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </header>

      <nav
        className={`sidebar ${menuOpen ? "is-open" : ""}`}
        aria-label="Editor sections"
      >
        {nav.map((item) => (
          <button
            key={item.id}
            aria-current={panel === item.id ? "page" : undefined}
            onClick={() => select({ panel: item.id })}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <main className="editor-panel">
        {panel === "home" && <HomePanel {...props} />}
        {panel === "packages" && <PackagesPanel {...props} />}
        {panel === "faqs" && <FaqPanel {...props} />}
        {panel === "showcase" && <ShowcasePanel {...props} />}
        {panel === "text" && <TextPanel {...props} />}
        {panel === "brand" && <BrandPanel {...props} />}
        {panel === "settings" && <SettingsPanel {...props} />}
        {panel === "history" && (
          <HistoryPanel
            onRestore={async (id) => {
              try {
                replaceAll(
                  (await api.restore(id)).content,
                  "Version restored to your draft. Publish to make it live.",
                );
              } catch (err) {
                handleError(err);
              }
            }}
            onReset={async () => {
              try {
                replaceAll(
                  (await api.resetDefaults()).content,
                  "Original content restored to your draft.",
                );
              } catch (err) {
                handleError(err);
              }
            }}
          />
        )}
        {panel === "account" && (
          <AccountPanel
            onLogout={async () => {
              await api.logout().catch(() => {});
              onSignedOut();
            }}
          />
        )}
      </main>

      <section className="preview" aria-label="Live preview">
        <div className="preview-label">
          <PencilSimpleIcon /> Preview: click any text to edit it
        </div>
        <div className="preview-frame">
          <iframe
            ref={frame}
            title="Website preview (editable)"
            src="/?edit=1"
            onLoad={() => {
              frameReady.current = false;
            }}
          />
        </div>
      </section>

      <div className="mobile-switch" role="group" aria-label="Show">
        <button
          aria-pressed={mobileView === "edit"}
          onClick={() => setMobileView("edit")}
        >
          <PencilSimpleIcon /> Edit
        </button>
        <button
          aria-pressed={mobileView === "preview"}
          onClick={() => setMobileView("preview")}
        >
          <EyeIcon /> Preview
        </button>
      </div>

      {toast && (
        <div
          className={`toast ${toast.ok ? "" : "toast-error"}`}
          role={toast.ok ? "status" : "alert"}
        >
          {toast.ok ? (
            <CheckCircleIcon size={20} />
          ) : (
            <WarningCircleIcon size={20} />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
}
