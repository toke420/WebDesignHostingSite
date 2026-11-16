import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  createReadStream,
  chmodSync,
} from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const local = resolve(root, ".local");
export const source = resolve(local, "helpdesk-src");
export const binary = resolve(local, "bin/helpdesk");
export const revision = "5a74ba74c6ec8ede2e3137aa7baa33c4a7dc1eb9";
const goVersion = "1.26.11";
const goChecksum =
  "9849f4e04ee35303714e34fbc3ac8ab44ea3e448a95aa182f91e3b9b79c710ec";
const go = resolve(local, "go/bin/go");
const goEnv = {
  ...process.env,
  GOCACHE: resolve(local, "go-cache"),
  GOPATH: resolve(local, "go-path"),
  GOTOOLCHAIN: "local",
};
function run(command, args, cwd = root, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, stdio: "inherit" });
  if (result.status !== 0)
    throw new Error(
      `${command} failed (${result.status ?? result.error?.message})`,
    );
}

export async function setup() {
  mkdirSync(local, { recursive: true });
  mkdirSync(resolve(local, "bin"), { recursive: true });
  if (!existsSync(go)) {
    if (process.platform !== "linux" || process.arch !== "x64")
      throw new Error(
        "Automatic Go setup supports Linux x64. Supply a prebuilt .local/bin/helpdesk on other platforms.",
      );
    const archive = resolve(local, "go.tar.gz");
    console.log(
      `Installing Go ${goVersion} with published SHA-256 verification…`,
    );
    run("curl", [
      "-fsSL",
      "--retry",
      "2",
      `https://go.dev/dl/go${goVersion}.linux-amd64.tar.gz`,
      "-o",
      archive,
    ]);
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(archive)) hash.update(chunk);
    if (hash.digest("hex") !== goChecksum)
      throw new Error("Go archive checksum mismatch. Installation stopped.");
    run("tar", ["-xzf", archive, "-C", local]);
  }
  if (!existsSync(source)) {
    run("git", [
      "clone",
      "--no-checkout",
      "https://github.com/toke420/Helpdesk.git",
      source,
    ]);
    run("git", ["checkout", "--detach", revision], source);
  }
  const head = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: source,
    encoding: "utf8",
  });
  if (head.status !== 0 || head.stdout.trim() !== revision)
    throw new Error(
      "Helpdesk source revision differs from the pinned version. Refusing to replace local work.",
    );
  const binaryStamp = resolve(local, "helpdesk-build-revision");
  if (
    !existsSync(binary) ||
    !existsSync(binaryStamp) ||
    readFileSync(binaryStamp, "utf8") !== revision
  ) {
    console.log(
      "Verifying Helpdesk dependencies and building the pinned backend…",
    );
    try {
      run(go, ["mod", "download"], source, goEnv);
    } catch {
      console.log(
        "Trying the pinned public source mirrors for the two large modules. Upstream go.sum verification remains mandatory.",
      );
      run("python3", [resolve(root, "scripts/module-mirror.py"), local]);
      run(go, ["mod", "download"], source, {
        ...goEnv,
        GOPROXY: `file://${resolve(local, "module-proxy")},https://proxy.golang.org`,
      });
    }
    run(go, ["mod", "verify"], source, goEnv);
    run(
      go,
      ["build", "-mod=readonly", "-trimpath", "-o", binary, "."],
      source,
      { ...goEnv, CGO_ENABLED: "0" },
    );
    writeFileSync(binaryStamp, revision);
  }
  const credentials = resolve(local, "admin.json");
  if (!existsSync(credentials)) {
    writeFileSync(
      credentials,
      JSON.stringify(
        {
          email: "admin@webtechpros.test",
          password: randomBytes(24).toString("base64url"),
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );
  }
  chmodSync(credentials, 0o600);
  console.log(
    "Helpdesk is installed. Development admin credentials are in .local/admin.json (not printed or committed).",
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  setup().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
