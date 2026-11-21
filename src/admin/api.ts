import type { SiteContent } from "../content";

export class AuthError extends Error {}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    credentials: "same-origin",
    ...init,
    headers:
      init.body && typeof init.body === "string"
        ? { "Content-Type": "application/json", ...init.headers }
        : init.headers,
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && path !== "login")
    throw new AuthError(data.error || "Please sign in again.");
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data as T;
}

const json = (body: unknown) => JSON.stringify(body);
export type Version = { id: string; publishedAt: string; note: string };

export const api = {
  session: () => call<{ authenticated: boolean }>("session"),
  login: (password: string) =>
    call("login", { method: "POST", body: json({ password }) }),
  logout: () => call("logout", { method: "POST", body: json({}) }),
  draft: () => call<{ content: SiteContent; hasUnpublished: boolean }>("draft"),
  save: (content: SiteContent) =>
    call<{ content: SiteContent; savedAt: string }>("draft", {
      method: "PUT",
      body: json({ content }),
    }),
  publish: (content: SiteContent) =>
    call<{ content: SiteContent; publishedAt: string }>("publish", {
      method: "POST",
      body: json({ content }),
    }),
  discard: () =>
    call<{ content: SiteContent }>("discard", {
      method: "POST",
      body: json({}),
    }),
  resetDefaults: () =>
    call<{ content: SiteContent }>("reset-defaults", {
      method: "POST",
      body: json({}),
    }),
  versions: () => call<{ versions: Version[] }>("versions"),
  restore: (id: string) =>
    call<{ content: SiteContent }>(`versions/${id}/restore`, {
      method: "POST",
      body: json({}),
    }),
  uploads: () => call<{ files: { url: string }[] }>("uploads"),
  upload: (file: File) =>
    call<{ url: string }>("upload", {
      method: "POST",
      body: file,
      headers: { "Content-Type": file.type },
    }),
  password: (current: string, next: string) =>
    call("password", { method: "POST", body: json({ current, next }) }),
};
