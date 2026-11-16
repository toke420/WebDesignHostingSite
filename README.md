# WebTechPros

Black and yellow service website for **webtechpros.net**, built with React, TypeScript, Vite and Tailwind 4. Self-hosted fonts and local WebP assets. Builds to static files for Virtualmin Pro / Nginx hosting.

## Run locally

Requires Node.js 22.12+ (tested with 24), npm, Git, curl, tar and Python 3 on Linux x64. Chromium is needed only for browser tests.

```sh
cd /workspace/WebDesignHostingSite
npm ci --cache /tmp/webtechpros-npm
npm run setup:helpdesk
npm run dev
```

`npm run dev` starts the website on port **5173** and the real Helpdesk backend on loopback port **8080**. It waits for backend readiness before starting Vite. Existing services are not stopped or silently reused. To intentionally use another backend, set `HELPDESK_PROXY_TARGET` in the shell before running the command.

The staff inbox is on port 8080. Local, randomly generated initial admin credentials are stored in **`.local/admin.json`**, mode 600. They are never printed or committed. First login requires a password change; also replace the placeholder operator email. Local installation is not a production deployment.

`npm run dev:site` starts the frontend alone. Consultation and chat still require Helpdesk. They show errors rather than claiming requests succeeded when the backend is unavailable.

Each cloud task is already isolated. Use this checkout; do not create a Git worktree unless explicitly requested.

## Edit the site

| Change                                                        | Location                             |
| ------------------------------------------------------------- | ------------------------------------ |
| Brand copy, prices, plan features, FAQs, project descriptions | `src/content.ts`                     |
| Colours, fonts, spacing, responsive layouts                   | `src/styles.css`                     |
| Section order and page components                             | `src/App.tsx`                        |
| Titles, metadata and canonical URL                            | `index.html`                         |
| Project images and illustrative concept pages                 | `public/images/`, `public/examples/` |
| Consultation API and official widget loader                   | `src/helpdesk.ts`                    |
| Chat greeting, branding, agents, notifications                | Helpdesk inbox → Settings            |

Use a numeric price or `null` for a quote-only package. All pricing is AUD. There is no browser CMS: the content file is the editable source; publish changes by rebuilding. The Helpdesk admin edits helpdesk settings, not the marketing page.

The supplied prices are preserved. **Pro hosting has no supplied price**, so it is quote-only. Design packages do not invent page counts, functionality or revision allowances. Final quotes confirm scope and tax treatment. Email storage is stated at package level, not assumed to be per mailbox for Pro.

## Consultation and chat

Uses [`toke420/Helpdesk`](https://github.com/toke420/Helpdesk), pinned at **`5a74ba74c6ec8ede2e3137aa7baa33c4a7dc1eb9`**. Upstream application files are unchanged; its source, binary, caches and database are ignored by Git.

1. Create/resume a visitor with `/api/widget/session`.
2. Record name/email with `/api/widget/profile`.
3. Post the selected service and message to `/api/widget/messages` as a new case.
4. Only a confirmed backend case number triggers success. Staff manage the case in the original Helpdesk inbox.
5. “Open your conversation” loads the **official** `/widget.js` and resumes that case. The floating chat button opens the official widget directly.

These are **consultation requests, not calendar appointments**. No automated scheduling or payment is claimed. SMTP and unattended notifications are not configured locally. Staff can read requests in the inbox; configure SMTP and `NOTIFY_EMAIL` or ntfy before relying on unattended notifications. No hosted AI provider is enabled by this integration.

Visitor tokens use the upstream `hd_visitor_token` local storage key. The site includes a privacy/pricing disclosure. Complete your business privacy policy and retention practices before production. Never send credentials in enquiries.

## Backend setup and integrity

The setup script downloads **Go 1.26.11** for Linux x64 and checks the published SHA-256. It builds Helpdesk using the committed dependency files, `-mod=readonly`, and `go mod verify`. It does not run `go mod tidy`, modify upstream files or disable TLS/module verification.

The cloud network may deny object-storage redirects for two large modernc modules. The tested fallback reconstructs module archives from pinned public release sources (`gitlab.com/cznic/libc` and the `modernc-org/sqlite` GitHub mirror), excluding nested modules according to the Go module ZIP format. **Go must still accept both archives against Helpdesk’s original `go.sum`.** A checksum mismatch aborts installation; hashes are never replaced. See `scripts/module-mirror.py`.

Setup uses `registry.npmjs.org`, `github.com`, `gitlab.com`, `go.dev`, `dl.google.com`, `proxy.golang.org`, and `sum.golang.org`. Normal Go downloads may also need `storage.googleapis.com`; the verified fallback avoids needing that domain here. Existing platform Git access is sufficient.

## Validation

```sh
npm run build
npm test
```

Tests use `/usr/bin/chromium`; override with `CHROMIUM_PATH` as needed. They start a disposable Helpdesk on **8081** and production preview on **4173**, exercising prices, real case creation, widget resume, backend failure handling, keyboard controls, project assets, FAQs and viewports from 360px to 1440px. A temporary database keeps test cases out of development/customer data.

Run upstream Helpdesk tests without changing its checkout:

```sh
cd .local/helpdesk-src
GOCACHE="$PWD/../go-cache" GOPATH="$PWD/../go-path" GOTOOLCHAIN=local ../go/bin/go test ./...
```

## Deploy on Virtualmin Pro / LEMP

1. Install dependencies and the pinned backend on the deployment host; run `npm run build`. Serve **only `dist/`** as the Nginx document root. Never expose the repository, `.local/`, `.data/`, or environment files.
2. Provision a dedicated service account, persistent data directory, real operator email and strong unique admin password. Use `ops/helpdesk.env.example` outside the public document root with mode 600.
3. Run the backend with a service manager; `ops/helpdesk.service.example` is a template, not an installed service. Replace paths and user. The Go binary does not source `.env` itself; the service injects variables.
4. Merge `ops/nginx.conf.example` into Virtualmin’s HTTPS server configuration. Route `/widget.js` and `/api/widget/` to the backend. Disable buffering for Server-Sent Events. Vite’s proxy is **not** part of static `dist/`.
5. Provision an HTTPS staff subdomain, for example `helpdesk.webtechpros.net`, and proxy all its paths to Helpdesk. Set `HELPDESK_BASE_URL` to the actual staff URL; restrict `HELPDESK_ALLOWED_ORIGINS` to the public site’s exact HTTPS origins. The suggested subdomain is not provisioned here.
6. Alternatively, set `VITE_HELPDESK_URL` to a separate public HTTPS Helpdesk origin **before building**, then configure its allowed origins. Never prefix secrets with `VITE_`; those values are public.
7. Configure email/notifications, sign in, replace the initial password/email, set availability and branding, and submit a live request. Verify inbox arrival and email delivery before announcing the site.
8. Use Helpdesk’s supported database backup flow. Agree backup retention and restore procedures separately from plan allowances.

No DNS, certificates, Virtualmin configuration, production inbox, email delivery or public deployment has been performed. Local tests do not establish production readiness.

## Assets and content

The four previews are original **illustrative concepts**, not client work. The CRM uses fictional sample data; the store has no checkout. Replace them with authorised portfolio work when available. Images are local generated artwork and screenshots of the included concepts, with no runtime stock-image requests.

Virtualmin copy is based on its [official feature list](https://github.com/virtualmin/virtualmin-gpl#virtualmin) and your supplied LEMP Pro infrastructure. Feature access, configuration and backup retention are plan-dependent. No unsupported uptime SLA, unlimited resources or backup guarantees are advertised.

The original `LICENSE` is retained. Font dependencies include their Open Font License notices. Helpdesk is separately retrieved; review its upstream terms before redistribution.
