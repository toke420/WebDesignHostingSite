import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "./styles.css";
import App from "./App";
import { ContentContext } from "./editable";
import { RouterProvider } from "./site";
import {
  defaultContent,
  loadContent,
  setPath,
  type SiteContent,
} from "./content";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const editMode =
  new URLSearchParams(location.search).has("edit") && window.parent !== window;

function post(message: object) {
  window.parent.postMessage(message, location.origin);
}

/** Runs inside the /admin preview frame: the page becomes the editor. */
function EditBridge() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [previewPath, setPreviewPath] = useState("/");

  useEffect(() => {
    document.documentElement.classList.add("is-edit-mode");
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== window.parent)
        return;
      const { type } = event.data || {};
      if (type === "wtp:content") setContent(event.data.content);
      if (type === "wtp:scroll-block")
        setTimeout(
          () =>
            document
              .querySelector(`[data-block-index="${Number(event.data.index)}"]`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" }),
          60,
        );
      if (type === "wtp:navigate" && typeof event.data.path === "string") {
        setPreviewPath(event.data.path);
        window.scrollTo(0, 0);
      }
      if (type === "wtp:scroll")
        document
          .getElementById(event.data.target)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // Clicking a block in the page opens the matching settings in the admin panel.
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-select]",
      );
      const link = (event.target as HTMLElement).closest("a");
      if (link && !link.getAttribute("href")?.startsWith("#"))
        event.preventDefault();
      if (target)
        post({ type: "wtp:select", ...JSON.parse(target.dataset.select!) });
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    post({ type: "wtp:ready" });
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  if (!content) return null;
  return (
    <ContentContext.Provider
      value={{
        content,
        editing: true,
        onEdit: (path, value) => {
          setContent((c) => (c ? setPath(c, path, value) : c));
          post({ type: "wtp:edit", path, value });
        },
      }}
    >
      <RouterProvider controlledPath={previewPath}>
        <App />
      </RouterProvider>
    </ContentContext.Provider>
  );
}

if (editMode) {
  root.render(
    <React.StrictMode>
      <EditBridge />
    </React.StrictMode>,
  );
} else {
  loadContent().then((content) =>
    root.render(
      <React.StrictMode>
        <ContentContext.Provider
          value={{
            content: content || defaultContent,
            editing: false,
            onEdit: () => {},
          }}
        >
          <RouterProvider>
            <App />
          </RouterProvider>
        </ContentContext.Provider>
      </React.StrictMode>,
    ),
  );
}
