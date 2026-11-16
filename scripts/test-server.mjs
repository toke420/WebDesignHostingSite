// Disposable backend for end-to-end tests. Never writes to development/customer data.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
const data = mkdtempSync(resolve(tmpdir(), "webtechpros-test-"));
const env = {
  ...process.env,
  HELPDESK_ADDR: "127.0.0.1:8081",
  HELPDESK_BASE_URL: "http://127.0.0.1:8081",
  HELPDESK_ALLOWED_ORIGINS: "http://127.0.0.1:4173",
  HELPDESK_DATA_DIR: data,
  HELPDESK_ADMIN_EMAIL: "test@example.test",
  HELPDESK_ADMIN_PASSWORD: randomBytes(30).toString("base64url"),
};
const backend = spawn(resolve(".local/bin/helpdesk"), [], {
  env,
  stdio: "inherit",
});
let site;
let stopped = false;
function stop() {
  if (stopped) return;
  stopped = true;
  site?.kill("SIGTERM");
  backend.kill("SIGTERM");
}
backend.on("exit", () => {
  rmSync(data, { recursive: true, force: true });
  if (!stopped) {
    stop();
    process.exitCode = 1;
  }
});
backend.on("error", (error) => {
  console.error(error.message);
  stop();
  process.exitCode = 1;
});
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
let ready = false;
for (let i = 0; i < 80; i++) {
  try {
    if (
      (
        await fetch("http://127.0.0.1:8081/healthz", {
          signal: AbortSignal.timeout(500),
        })
      ).ok
    ) {
      ready = true;
      break;
    }
  } catch {
    /* startup */
  }
  await delay(250);
}
if (!ready) {
  stop();
  throw new Error("Disposable Helpdesk failed to start.");
}
site = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--strictPort",
  ],
  {
    env: { ...process.env, HELPDESK_PROXY_TARGET: "http://127.0.0.1:8081" },
    stdio: "inherit",
  },
);
site.on("exit", () => stop());
