import { spawn } from "node:child_process";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { setup, root, local, binary } from "./setup-helpdesk.mjs";

const children = [];
let exiting = false;
function stop(code = 0) {
  if (exiting) return;
  exiting = true;
  children.forEach((child) => child.kill("SIGTERM"));
  process.exitCode = code;
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
function start(command, args, env) {
  const child = spawn(command, args, { cwd: root, stdio: "inherit", env });
  children.push(child);
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!exiting) stop(code || 0);
  });
  return child;
}

async function main() {
  if (!process.env.HELPDESK_PROXY_TARGET) {
    if (!existsSync(binary)) await setup();
    const credentials = JSON.parse(
      readFileSync(resolve(local, "admin.json"), "utf8"),
    );
    const dataDir = resolve(root, ".data/helpdesk");
    mkdirSync(dataDir, { recursive: true, mode: 0o700 });
    try {
      await fetch("http://127.0.0.1:8080/healthz", {
        signal: AbortSignal.timeout(500),
      });
      throw new Error(
        "Port 8080 is already in use. Stop the existing service, or explicitly set HELPDESK_PROXY_TARGET to reuse a Helpdesk instance.",
      );
    } catch (error) {
      if (error.message.startsWith("Port 8080")) throw error;
    }
    start(binary, [], {
      ...process.env,
      HELPDESK_ADDR: "127.0.0.1:8080",
      HELPDESK_BASE_URL: "http://127.0.0.1:8080",
      HELPDESK_ALLOWED_ORIGINS:
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
      HELPDESK_DATA_DIR: dataDir,
      HELPDESK_ADMIN_EMAIL: credentials.email,
      HELPDESK_ADMIN_PASSWORD: credentials.password,
    });
    let ready = false;
    for (let i = 0; i < 80 && !exiting; i++) {
      try {
        const r = await fetch("http://127.0.0.1:8080/healthz", {
          signal: AbortSignal.timeout(1000),
        });
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {
        /* startup pending */
      }
      await delay(250);
    }
    if (!ready)
      throw new Error(
        "Helpdesk did not become healthy. Review the startup output.",
      );
    // Branding is only seeded once, preserving subsequent edits made in Helpdesk Settings.
    const brandMarker = resolve(root, ".data/helpdesk/brand-initialized");
    if (!existsSync(brandMarker)) {
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync(
        "python3",
        [
          "-c",
          `import sqlite3,sys\nc=sqlite3.connect(sys.argv[1])\nsettings={'brand_name':'WebTechPros','accent_color':'#8a7600','greeting':'Tell us about your next move. Ask us about a free 30-minute consultation.','offline_message':'Leave your ideas and email address. We will get back to you to arrange a free 30-minute consultation.'}\nc.executemany('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',settings.items())\nc.commit()`,
          resolve(dataDir, "helpdesk.db"),
        ],
        { stdio: "inherit" },
      );
      if (result.status !== 0)
        throw new Error("Could not initialize Helpdesk branding.");
      const { writeFileSync } = await import("node:fs");
      writeFileSync(
        brandMarker,
        "Configured once; edit branding in Helpdesk Settings.\n",
      );
    }
    console.log(
      "Helpdesk is healthy. Staff inbox: port 8080. Credentials: .local/admin.json.",
    );
  }
  if (!exiting)
    start(
      process.execPath,
      ["node_modules/vite/bin/vite.js", "--host", "0.0.0.0"],
      process.env,
    );
}
main().catch((error) => {
  console.error(error.message);
  stop(1);
});
