// Builds the WebTechPros logo pack: SVG, PNG, JPEG, ICO, favicons and ad banners.
// Output: public/brand/webtechpros-logo-pack.zip (+ refreshed site favicons).
// Run: npm run build:logo   (uses Chromium; set CHROMIUM_PATH if needed)
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const G = JSON.parse(readFileSync(resolve(here, "glyphs.json"), "utf8"));
const work = resolve(root, ".local/logo-pack");
const pack = resolve(work, "webtechpros-logo-pack");
const YELLOW = "#efd929";
const DARK = "#111210";
const LIGHT = "#f3f2ed";
const SKEW = Math.tan((10 * Math.PI) / 180);

// ---------- Vector logo construction (glyph outlines, no fonts needed) ----------
function run(items, x, baseline) {
  // items: [text, weight, size, letterSpacingEm, fill]
  let cursor = x;
  let minX = Infinity, maxX = -Infinity, top = Infinity, bottom = -Infinity;
  const parts = [];
  for (const [text, weight, size, spacing, fill] of items) {
    const k = size / G.unitsPerEm;
    for (const ch of text) {
      const g = G[weight][ch];
      parts.push(
        `<path fill="${fill}" transform="translate(${r(cursor)} ${r(baseline)}) scale(${r(k, 5)} ${r(-k, 5)})" d="${g.d}"/>`,
      );
      const [x0, y0, x1, y1] = g.bounds;
      minX = Math.min(minX, cursor + x0 * k);
      maxX = Math.max(maxX, cursor + x1 * k);
      top = Math.min(top, baseline - y1 * k);
      bottom = Math.max(bottom, baseline - y0 * k);
      cursor += g.advance * k + spacing * size;
    }
  }
  return { svg: parts.join(""), minX, maxX, top, bottom, end: cursor };
}
const r = (n, d = 2) => Number(n.toFixed(d));

/** The skewed "w." brand mark, sized so its x-height is `size * 0.486`. */
function mark(x, baseline, size, wColor, dotColor) {
  const m = run(
    [
      ["w", "700", size, -0.147, wColor],
      [".", "700", size * (38 / 34), 0, dotColor],
    ],
    x,
    baseline,
  );
  const shift = SKEW * (baseline - m.top);
  return {
    ...m,
    svg: `<g transform="translate(${r(x)} ${r(baseline)}) skewX(-10) translate(${r(-x)} ${r(-baseline)})">${m.svg}</g>`,
    maxX: m.maxX + shift,
    minX: m.minX - SKEW * (m.bottom - baseline),
  };
}
function wordmark(x, baseline, size, ink, dot) {
  return run(
    [
      ["webtech", "700", size, -0.048, ink],
      ["pros", "400", size, -0.048, ink],
      [".", "700", size, -0.048, dot],
    ],
    x,
    baseline,
  );
}
function svgDoc(w, h, body, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}">${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}${body}</svg>`;
}

const schemes = {
  dark: { bg: DARK, ink: LIGHT, w: YELLOW, dot: YELLOW, jpgBg: DARK },
  light: { bg: null, ink: DARK, w: DARK, dot: YELLOW, jpgBg: "#ffffff" },
  black: { bg: null, ink: "#000000", w: "#000000", dot: "#000000", jpgBg: "#ffffff" },
  white: { bg: null, ink: "#ffffff", w: "#ffffff", dot: "#ffffff", jpgBg: DARK },
};

function horizontal(s, withBg = true) {
  const F = 100, pad = 34;
  const m = mark(pad, 0, F * 1.36, s.w, s.dot);
  const t = wordmark(m.maxX + F * 0.36, 0, F, s.ink, s.dot);
  const top = Math.min(m.top, t.top), bottom = Math.max(m.bottom, t.bottom);
  const w = t.maxX + pad, h = bottom - top + pad * 2;
  return svgDoc(w, h, `<g transform="translate(0 ${r(pad - top)})">${m.svg}${t.svg}</g>`, withBg ? s.bg : null);
}
function stacked(s, withBg = true) {
  const F = 100, pad = 40;
  const t0 = wordmark(0, 0, F, s.ink, s.dot);
  const m0 = mark(0, 0, F * 2.2, s.w, s.dot);
  const width = Math.max(t0.maxX - t0.minX, m0.maxX - m0.minX) + pad * 2;
  const mx = (width - (m0.maxX - m0.minX)) / 2 - m0.minX;
  const m = mark(mx, 0, F * 2.2, s.w, s.dot);
  const gap = F * 0.35;
  const tb = m.bottom + gap - t0.top;
  const t = wordmark((width - (t0.maxX - t0.minX)) / 2 - t0.minX, tb, F, s.ink, s.dot);
  const h = t.bottom - m.top + pad * 2;
  return svgDoc(width, h, `<g transform="translate(0 ${r(pad - m.top)})">${m.svg}${t.svg}</g>`, withBg ? s.bg : null);
}
function wordOnly(s, withBg = true) {
  const pad = 30;
  const t = wordmark(pad, 0, 100, s.ink, s.dot);
  return svgDoc(t.maxX + pad, t.bottom - t.top + pad * 2, `<g transform="translate(0 ${r(pad - t.top)})">${t.svg}</g>`, withBg ? s.bg : null);
}
/** Square app icon. `fill` is the background, null for transparent. */
function icon(bg, wColor, dotColor, { radius = 0.2, scale = 1 } = {}) {
  const S = 512;
  const m0 = mark(0, 0, 330 * scale, wColor, dotColor);
  const w = m0.maxX - m0.minX, h = m0.bottom - m0.top;
  const m = mark((S - w) / 2 - m0.minX, (S - h) / 2 - m0.top, 330 * scale, wColor, dotColor);
  return svgDoc(S, S, `${bg ? `<rect width="${S}" height="${S}" rx="${S * radius}" fill="${bg}"/>` : ""}${m.svg}`);
}

// ---------- Raster helpers ----------
let page;
async function rasterSvg(svg, width, height, file, { type = "png", bg } = {}) {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<html><body style="margin:0;background:${bg || "transparent"}"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" style="display:block;width:${width}px;height:${height}px"></body></html>`,
  );
  await page.locator("img").evaluate((img) => img.decode());
  await page.screenshot({
    path: file,
    type,
    omitBackground: type === "png" && !bg,
    ...(type === "jpeg" ? { quality: 92 } : {}),
  });
}
function size(svg) {
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  return { w, h };
}
function ico(pngs) {
  // ICO container with embedded PNG images (supported by all modern browsers and Windows).
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(([px, data], i) => {
    const e = 6 + i * 16;
    header.writeUInt8(px >= 256 ? 0 : px, e);
    header.writeUInt8(px >= 256 ? 0 : px, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p[1])]);
}

// ---------- Banners ----------
const font = (p) => readFileSync(resolve(root, "node_modules/@fontsource-variable", p)).toString("base64");
const fonts = `@font-face{font-family:SG;src:url(data:font/woff2;base64,${font("space-grotesk/files/space-grotesk-latin-wght-normal.woff2")}) format("woff2");font-weight:300 700}
@font-face{font-family:MR;src:url(data:font/woff2;base64,${font("manrope/files/manrope-latin-wght-normal.woff2")}) format("woff2");font-weight:200 800}`;
const art = `data:image/webp;base64,${readFileSync(resolve(root, "public/images/hero-sculpture.webp")).toString("base64")}`;

function bannerHtml(w, h, logoSvg, iconSvg) {
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
  const iconUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString("base64")}`;
  const ratio = w / h;
  const kind = h <= 100 ? "strip" : ratio >= 1.9 ? "wide" : ratio <= 0.7 ? "tall" : "box";
  const u = Math.min(w, h) / 100; // 1 unit = 1% of the short side
  const k = Math.min(h, w * 0.2); // strip banners: scale to fit narrow widths
  const base = `${fonts}*{box-sizing:border-box;margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${DARK};color:${LIGHT};font-family:MR,sans-serif;position:relative}
.logo{display:block}.h{font-family:SG;font-weight:500;letter-spacing:-.04em;line-height:1.02}.h span{color:${YELLOW}}
.cta{display:inline-flex;align-items:center;gap:.6em;background:${YELLOW};color:${DARK};font-weight:800;border-radius:4px;white-space:nowrap}
.sub{color:#b9bbae}.dom{color:#8d8f84;letter-spacing:.06em}
.corner{position:absolute;border-color:${YELLOW};border-style:solid;opacity:.9}
.art{position:absolute;background:url(${art}) center/cover no-repeat}`;
  const L = {
    strip: `body{display:flex;align-items:center;gap:${k * 0.3}px;padding:0 ${k * 0.3}px}
.logo{height:${k * 0.4}px;flex-shrink:0}.h{font-size:${k * 0.21}px;flex:1;white-space:nowrap;letter-spacing:-.02em}.cta{font-size:${k * 0.18}px;padding:${k * 0.15}px ${k * 0.22}px;flex-shrink:0}
${w < 400 ? ".h{display:none}body{justify-content:space-between}" : ""}`,
    wide: `body{display:flex;align-items:center}
.copy{padding:0 ${u * 9}px;display:flex;flex-direction:column;gap:${u * 5}px;align-items:flex-start;position:relative;z-index:1;max-width:58%}
.logo{height:${u * 9}px}.h{font-size:${u * 13}px}.sub{font-size:${u * 4.4}px}.cta{font-size:${u * 4.6}px;padding:${u * 3.4}px ${u * 5}px}
.art{right:0;top:0;bottom:0;width:50%;-webkit-mask-image:linear-gradient(90deg,transparent,#000 35%);mask-image:linear-gradient(90deg,transparent,#000 35%)}
.corner.a{right:${u * 4}px;top:${u * 4}px;width:${u * 10}px;height:${u * 10}px;border-width:${u * 0.8}px ${u * 0.8}px 0 0}
.dom{position:absolute;right:${u * 5}px;bottom:${u * 4}px;font-size:${u * 3.6}px}`,
    box: `body{display:flex;flex-direction:column;padding:${u * 8}px;gap:${u * 4}px}
.logo{height:${u * 8}px}.h{font-size:${u * 11}px;margin-top:${u * 6}px}.sub{font-size:${u * 4.2}px;margin-top:${u * 3}px}
.cta{font-size:${u * 4.2}px;padding:${u * 3.4}px ${u * 4.6}px}.foot{display:flex;justify-content:space-between;align-items:center;gap:${u * 3}px;margin-top:auto;position:relative;z-index:1}.dom{font-size:${u * 3}px}
.sub{max-width:${w < 400 ? 100 : 50}%}
.art{right:0;top:${ratio > 1.3 ? 30 : 36}%;bottom:${ratio > 1.3 ? 4 : 12}%;width:${ratio > 1.3 ? 50 : 45}%;background-size:contain;background-position:right center;${w < 400 ? "display:none;" : ""}}
.corner.a{right:${u * 6}px;top:${u * 6}px;width:${u * 9}px;height:${u * 9}px;border-width:${u * 0.7}px ${u * 0.7}px 0 0}
.dom{display:none}`,
    tall: `body{display:flex;flex-direction:column;padding:${u * 10}px ${u * 9}px;gap:${u * 6}px}
.logo{height:${u * 10}px}.h{font-size:${u * 13.5}px;margin-top:${u * 7}px}.sub{font-size:${u * 6}px;margin-top:${u * 5}px}
.art{position:static;flex:1;min-height:0;background-size:contain;margin:0 -${u * 9}px}
.cta{font-size:${u * (w < 200 ? 7.5 : 6.4)}px;padding:${u * 5}px ${u * 6}px;white-space:normal}.dom{font-size:${u * 5}px;margin-top:${u * 5}px}
.corner.a{right:${u * 7}px;top:${u * 7}px;width:${u * 12}px;height:${u * 12}px;border-width:${u}px ${u}px 0 0}`,
  }[kind];
  const head = `<img class="logo" src="${w <= 200 && kind !== "strip" ? iconUri : logo}" alt="">`;
  const headline = `<p class="h">Your next move.<br><span>Made digital.</span></p>`;
  const sub = `<p class="sub">Web design · Hosting · Email · IT support · Phone systems</p>`;
  const cta = `<span class="cta">Free 30-min consultation ↗</span>`;
  const body = {
    strip: `${head}<p class="h">Your next move. <span>Made digital.</span></p>${cta.replace("Free 30-min consultation", w < 400 ? "Free consult" : "Free consultation")}`,
    wide: `<div class="art"></div><div class="corner a"></div><div class="copy">${head}${headline}${h > 200 ? sub : ""}${cta}</div><p class="dom">WEBTECHPROS.NET</p>`,
    box: `<div class="corner a"></div><div class="art"></div><div class="top">${head}${headline}${sub}</div><div class="foot">${w < 400 ? cta.replace("Free 30-min consultation", "Free consultation") : cta}<p class="dom">WEBTECHPROS.NET</p></div>`,
    tall: `<div class="corner a"></div><div>${head}${headline}${w < 200 ? "" : sub}</div><div class="art"></div><div>${w < 200 ? cta.replace("Free 30-min consultation", "Free consultation") : cta}<p class="dom">WEBTECHPROS.NET</p></div>`,
  }[kind];
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base}${L}</style></head><body>${body}</body></html>`;
}

const banners = [
  ["leaderboard-728x90", 728, 90, "Google Display leaderboard"],
  ["billboard-970x250", 970, 250, "Google Display billboard"],
  ["mobile-banner-320x50", 320, 50, "Google Display mobile banner"],
  ["large-mobile-320x100", 320, 100, "Google Display large mobile"],
  ["medium-rectangle-300x250", 300, 250, "Google Display / Facebook right column"],
  ["large-rectangle-336x280", 336, 280, "Google Display large rectangle"],
  ["skyscraper-160x600", 160, 600, "Google Display wide skyscraper"],
  ["half-page-300x600", 300, 600, "Google Display half page"],
  ["social-link-1200x628", 1200, 628, "Facebook / LinkedIn link and ad image"],
  ["instagram-square-1080x1080", 1080, 1080, "Instagram & Facebook feed post"],
  ["instagram-portrait-1080x1350", 1080, 1350, "Instagram portrait post"],
  ["story-1080x1920", 1080, 1920, "Instagram / Facebook story and reel cover"],
  ["facebook-cover-820x312", 820, 312, "Facebook page cover"],
  ["linkedin-banner-1584x396", 1584, 396, "LinkedIn page banner"],
  ["x-header-1500x500", 1500, 500, "X (Twitter) header"],
  ["youtube-banner-2560x1440", 2560, 1440, "YouTube channel art (safe area centred)"],
  ["email-signature-600x150", 600, 150, "Email signature banner"],
];

// ---------- Build ----------
async function main() {
  rmSync(work, { recursive: true, force: true });
  for (const d of ["svg", "png", "jpg", "favicon", "social", "banners/png", "banners/jpg"])
    mkdirSync(resolve(pack, d), { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  page = await browser.newPage();

  const logos = {};
  for (const [name, s] of Object.entries(schemes)) {
    logos[`logo-horizontal-${name}`] = [horizontal(s, name === "dark"), s];
    logos[`logo-stacked-${name}`] = [stacked(s, name === "dark"), s];
    logos[`wordmark-${name}`] = [wordOnly(s, name === "dark"), s];
  }
  // Transparent version of the dark-background logo, for placing on your own dark imagery.
  logos["logo-horizontal-on-dark-transparent"] = [horizontal(schemes.dark, false), schemes.dark];
  const icons = {
    "icon-dark": icon(DARK, YELLOW, YELLOW),
    "icon-yellow": icon(YELLOW, DARK, DARK),
    "icon-dark-circle": icon(DARK, YELLOW, YELLOW, { radius: 0.5, scale: 0.92 }),
    "mark-yellow-transparent": icon(null, YELLOW, YELLOW, { scale: 1.15 }),
    "mark-dark-transparent": icon(null, DARK, YELLOW, { scale: 1.15 }),
  };

  for (const [name, [svg, s]] of Object.entries(logos)) {
    writeFileSync(resolve(pack, "svg", `${name}.svg`), svg);
    const { w, h } = size(svg);
    for (const width of [400, 800, 1600, 3200]) {
      const height = Math.round((h / w) * width);
      await rasterSvg(svg, width, height, resolve(pack, "png", `${name}-${width}w.png`));
    }
    await rasterSvg(svg, 1600, Math.round((h / w) * 1600), resolve(pack, "jpg", `${name}-1600w.jpg`), {
      type: "jpeg",
      bg: s.jpgBg,
    });
  }
  for (const [name, svg] of Object.entries(icons)) {
    writeFileSync(resolve(pack, "svg", `${name}.svg`), svg);
    for (const px of [16, 32, 48, 64, 128, 256, 512, 1024])
      await rasterSvg(svg, px, px, resolve(pack, "png", `${name}-${px}.png`));
    await rasterSvg(svg, 1024, 1024, resolve(pack, "jpg", `${name}-1024.jpg`), {
      type: "jpeg",
      bg: name.includes("transparent") ? "#ffffff" : name === "icon-yellow" ? YELLOW : DARK,
    });
  }

  // Favicons & app icons
  const fav = resolve(pack, "favicon");
  writeFileSync(resolve(fav, "favicon.svg"), icons["icon-dark"]);
  const icoParts = [];
  for (const px of [16, 32, 48]) {
    const file = resolve(fav, `favicon-${px}x${px}.png`);
    await rasterSvg(icons["icon-dark"], px, px, file);
    icoParts.push([px, readFileSync(file)]);
  }
  writeFileSync(resolve(fav, "favicon.ico"), ico(icoParts));
  const full = icon(DARK, YELLOW, YELLOW, { radius: 0 });
  await rasterSvg(full, 180, 180, resolve(fav, "apple-touch-icon.png"));
  await rasterSvg(icons["icon-dark"], 192, 192, resolve(fav, "android-chrome-192x192.png"));
  await rasterSvg(icons["icon-dark"], 512, 512, resolve(fav, "android-chrome-512x512.png"));
  await rasterSvg(icon(DARK, YELLOW, YELLOW, { radius: 0, scale: 0.72 }), 512, 512, resolve(fav, "maskable-512x512.png"));
  writeFileSync(
    resolve(fav, "site.webmanifest"),
    JSON.stringify(
      {
        name: "WebTechPros",
        short_name: "WebTechPros",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        theme_color: DARK,
        background_color: DARK,
        display: "standalone",
      },
      null,
      2,
    ),
  );
  writeFileSync(
    resolve(fav, "html-snippet.txt"),
    `<!-- Paste into <head>. Upload the files in this folder to your website root. -->
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${DARK}">
`,
  );

  // Social profile pictures
  await rasterSvg(icons["icon-dark-circle"], 400, 400, resolve(pack, "social", "profile-dark-400.png"));
  await rasterSvg(icon(DARK, YELLOW, YELLOW, { radius: 0, scale: 0.85 }), 1080, 1080, resolve(pack, "social", "profile-dark-1080.jpg"), { type: "jpeg" });
  await rasterSvg(icon(YELLOW, DARK, DARK, { radius: 0, scale: 0.85 }), 1080, 1080, resolve(pack, "social", "profile-yellow-1080.jpg"), { type: "jpeg" });

  // Advertising banners
  const bannerLogo = horizontal(schemes.dark, false);
  for (const [name, w, h] of banners) {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(bannerHtml(w, h, bannerLogo, icons["mark-yellow-transparent"]));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(50);
    await page.screenshot({ path: resolve(pack, "banners/png", `${name}.png`) });
    await page.screenshot({ path: resolve(pack, "banners/jpg", `${name}.jpg`), type: "jpeg", quality: 90 });
  }
  await browser.close();

  writeFileSync(
    resolve(pack, "README.txt"),
    `WEBTECHPROS LOGO PACK
=====================

FOLDERS
  svg/       Vector logos. Best for print, signage and design tools. Text is converted to outlines,
             so no fonts are needed.
  png/       Transparent images at 400, 800, 1600 and 3200 px wide. Icons from 16 to 1024 px.
  jpg/       Logos on a solid background (for apps that don't support transparency).
  favicon/   Website icons: favicon.ico, favicon.svg, Apple and Android icons, web manifest
             and the HTML snippet to paste into your site.
  social/    Profile pictures for Facebook, Instagram, LinkedIn, Google Business and X.
  banners/   Ready-to-upload advertising and cover images (PNG and JPG):
${banners.map(([n, w, h, use]) => `             ${`${n}`.padEnd(32)} ${w}x${h}  ${use}`).join("\n")}

WHICH LOGO SHOULD I USE?
  On dark backgrounds   logo-horizontal-dark (has its own dark box) or logo-horizontal-white
                        / logo-horizontal-on-dark-transparent
  On light backgrounds  logo-horizontal-light
  One colour printing   logo-horizontal-black or logo-horizontal-white
  Small square spaces   icon-dark or icon-yellow

COLOURS
  Signal yellow   #EFD929   RGB 239 217 41
  Ink black       #111210   RGB 17 18 16
  Paper white     #F3F2ED   RGB 243 242 237
  Muted grey      #8D8F84   RGB 141 143 132

FONTS
  Headings & logo   Space Grotesk (SIL Open Font License)
  Body text         Manrope (SIL Open Font License)

CLEAR SPACE & SIZE
  Keep empty space around the logo at least the height of the "w." mark.
  Don't use the horizontal logo smaller than 120 px wide on screen or 30 mm in print;
  use the icon instead.

PLEASE DON'T
  Stretch, rotate or recolour the logo, add shadows or outlines, or place the yellow
  version on light or busy backgrounds.

Regenerate this pack from the website repository with: npm run build:logo
`,
  );

  // Refresh the website's own favicons from the same artwork.
  for (const f of ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png", "maskable-512x512.png", "site.webmanifest"])
    copyFileSync(resolve(fav, f), resolve(root, "public", f));

  const outDir = resolve(root, "public/brand");
  mkdirSync(outDir, { recursive: true });
  const zip = resolve(outDir, "webtechpros-logo-pack.zip");
  rmSync(zip, { force: true });
  execFileSync("zip", ["-rq9X", zip, "webtechpros-logo-pack"], { cwd: work });
  // Preview images used by the admin "Brand assets" panel.
  copyFileSync(resolve(pack, "png", "logo-horizontal-dark-800w.png"), resolve(outDir, "logo-horizontal-dark.png"));
  copyFileSync(resolve(pack, "png", "logo-horizontal-light-800w.png"), resolve(outDir, "logo-horizontal-light.png"));
  copyFileSync(resolve(pack, "banners/png", "social-link-1200x628.png"), resolve(outDir, "banner-preview.png"));
  console.log(`Logo pack written to ${zip}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
