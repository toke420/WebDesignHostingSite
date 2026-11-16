const base = (import.meta.env.VITE_HELPDESK_URL || "").replace(/\/$/, "");
declare global {
  interface Window {
    HelpDesk?: {
      open(): void;
      close(): void;
      identify(profile: { name: string; email: string }): Promise<unknown>;
    };
  }
}

async function request(path: string, body: object, token?: string) {
  const response = await fetch(`${base}/api/widget/${path}`, {
    method: "POST",
    credentials: "omit",
    signal: AbortSignal.timeout(15000),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.error ||
        "The helpdesk is temporarily unavailable. Please try again shortly.",
    );
  return data;
}

function readToken() {
  try {
    return localStorage.getItem("hd_visitor_token") || "";
  } catch {
    return "";
  }
}

export async function submitConsultation(
  name: string,
  email: string,
  service: string,
  message: string,
) {
  const session = await request("session", {
    token: readToken(),
    page: location.origin + location.pathname,
    create: true,
  });
  if (!session.token)
    throw new Error("We could not start your request. Please try again.");
  try {
    localStorage.setItem("hd_visitor_token", session.token);
  } catch {
    /* The submission still works without persistence. */
  }
  await request("profile", { name, email }, session.token);
  const result = await request(
    "messages",
    {
      body: `Free 30-minute consultation request\nService: ${service}\nName: ${name}\nEmail: ${email}\n\n${message}`,
      page: location.origin + location.pathname,
      new: true,
      via: "new",
    },
    session.token,
  );
  if (!result.case?.number)
    throw new Error(
      "Your request could not be confirmed. Please check chat before trying again.",
    );
  return result.case.number as string;
}

let widgetPromise: Promise<void> | null = null;
export function openChat() {
  if (window.HelpDesk) {
    window.HelpDesk.open();
    return Promise.resolve();
  }
  if (!widgetPromise) {
    widgetPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${base}/widget.js`;
      script.async = true;
      script.onload = () => {
        if (window.HelpDesk) resolve();
        else {
          script.remove();
          reject(new Error("Chat could not be loaded. Please try again."));
        }
      };
      script.onerror = () => {
        script.remove();
        reject(
          new Error(
            "Chat is temporarily unavailable. Please try again shortly.",
          ),
        );
      };
      document.body.appendChild(script);
    }).catch((error) => {
      widgetPromise = null;
      throw error;
    });
  }
  return widgetPromise.then(() => window.HelpDesk?.open());
}
