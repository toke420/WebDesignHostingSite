import { test, expect } from "@playwright/test";

test("all service packages expose the supplied prices and specifications", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next move.",
  );
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("250 GB bandwidth / month");
  await expect(panel).toContainText("700 GB bandwidth / month");
  await expect(panel.locator(".price-amount")).toHaveText([
    "$10/ month",
    "$20/ month",
  ]);
  await page.getByRole("tab", { name: "Web & logo design" }).click();
  await expect(panel.locator(".price-amount")).toHaveText([
    "$50one-off",
    "$150one-off",
    "$500one-off",
  ]);
  await expect(panel.locator(".logo-offer")).toContainText("From $110 AUD");
  await page.getByRole("tab", { name: "Hosted email" }).click();
  await expect(panel).toContainText("10 GB cloud storage");
  await expect(panel).toContainText("60 GB cloud storage");
  await expect(panel.locator(".price-amount")).toHaveText([
    "$6/ seat / month",
    "$60/ 5 seats / month",
  ]);
  await page.getByRole("tab", { name: "IT support" }).click();
  await expect(panel.locator(".price-amount")).toHaveText([
    "$110/ hour",
    "$150/ hour",
  ]);
  await expect(panel).toContainText("MikroTik networking included");
  await page.getByRole("tab", { name: "IP telephony" }).click();
  await expect(panel).toContainText("Hosted 3CX");
  await expect(panel).toContainText("Hosted FreePBX");
  await expect(
    panel.getByRole("button", { name: "Request a quote" }),
  ).toHaveCount(2);
  expect(errors).toEqual([]);
});

test("consultation creates a real persisted Helpdesk case and the official widget resumes it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Hosted email" }).click();
  await page.getByRole("button", { name: "Enquire about Pro" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("What can we help with?")).toHaveValue(
    "Hosted email",
  );
  await expect(dialog.getByLabel("A little about your project")).toHaveValue(
    "I'm interested in Pro Email.",
  );
  await dialog.getByLabel("Your name").fill("Website Integration Test");
  await dialog.getByLabel("Email address").fill("integration@example.test");
  await dialog
    .getByLabel("A little about your project")
    .fill("We would like to discuss migrating five mailboxes to Pro Email.");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Request consultation" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Your next move starts here." }),
  ).toBeVisible();
  await expect(dialog).toContainText(/HD-\d+/);
  const persisted = await page.evaluate(async () => {
    const r = await fetch("/api/widget/cases", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hd_visitor_token")}`,
      },
    });
    return r.json();
  });
  expect(persisted.cases).toHaveLength(1);
  expect(persisted.cases[0].subject).toContain(
    "Free 30-minute consultation request",
  );
  await dialog.getByRole("button", { name: "Open your conversation" }).click();
  await expect(page.locator("#helpdesk-widget")).toBeAttached();
  await expect(
    page
      .locator("#helpdesk-widget")
      .getByText(
        "We would like to discuss migrating five mailboxes to Pro Email.",
        { exact: false },
      ),
  ).toBeVisible();
  await page.reload();
  const afterReload = await page.evaluate(async () =>
    (
      await fetch("/api/widget/cases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hd_visitor_token")}`,
        },
      })
    ).json(),
  );
  expect(afterReload.cases[0].number).toBe(persisted.cases[0].number);
});

test("backend failure keeps the form and never reports success", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Free consultation" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your name").fill("Error Test");
  await dialog.getByLabel("Email address").fill("error@example.test");
  await dialog
    .getByLabel("A little about your project")
    .fill("A business website with a contact page.");
  await dialog.getByRole("checkbox").check();
  await page.route("**/api/widget/session", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "The helpdesk is temporarily unavailable. Please try again shortly.",
      }),
    }),
  );
  await dialog.getByRole("button", { name: "Request consultation" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "temporarily unavailable",
  );
  await expect(dialog.getByLabel("Your name")).toHaveValue("Error Test");
  await expect(
    dialog.getByRole("button", { name: "Request consultation" }),
  ).toBeEnabled();
  await expect(dialog.getByText("Your next move starts here.")).toHaveCount(0);
});

test("keyboard tabs, FAQ disclosures, project images and modal focus work", async ({
  page,
}) => {
  await page.goto("/");
  const hostingTab = page.getByRole("tab", { name: "Web hosting" });
  await hostingTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Web & logo design" }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "A logo that feels like you.",
  );
  const question = page
    .locator("summary")
    .filter({ hasText: "Where will my website be hosted?" });
  await question.click();
  await expect(question.locator("..")).toContainText("Melbourne and Sydney");
  for (const name of [
    "Business website",
    "Ecommerce store",
    "Restaurant & hospitality",
    "Trades & services",
    "Health clinic",
    "Software & SaaS",
    "Blog & publication",
    "CRM application",
  ]) {
    const trigger = page.getByRole("button", { name: `View ${name} example` });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog
        .locator("img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    ).toBeTruthy();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("mobile navigation, forms and all sections fit narrow screens", async ({
  page,
}) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    if (width < 768) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Our services" })
        .click();
      await expect(
        page.getByRole("button", { name: "Open menu" }),
      ).toHaveAttribute("aria-expanded", "false");
    }
    await page
      .getByRole("button", { name: "Free consultation" })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const rect = await page.getByRole("dialog").boundingBox();
    expect(rect!.width).toBeLessThan(width);
    await page.keyboard.press("Escape");
    for (const id of ["services", "projects", "about", "faq"]) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
    }
  }
});

test("admin: sign in, edit a price and an FAQ, publish, and the live site updates", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/admin");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toContainText("not correct");
  await page.getByLabel("Password").fill("test-admin-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: /Welcome back/ }),
  ).toBeVisible();

  // Inline edit directly in the page preview.
  const preview = page.frameLocator("iframe");
  const price = preview.locator('[data-edit-path="services.0.plans.0.price"]');
  await price.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("12");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Packages & prices" }),
  ).toBeVisible();
  await expect(page.locator("#plan-hosting-0 .money input")).toHaveValue("12");

  // Form edit, mirrored live in the preview.
  await page.getByRole("button", { name: "Questions & answers" }).click();
  await page
    .getByLabel("Question")
    .first()
    .fill("What happens in the free chat?");
  await expect(
    preview.locator('[data-edit-path="faqs.0.question"]'),
  ).toHaveText("What happens in the free chat?");
  await page.getByRole("button", { name: "Add a question" }).click();
  await page.getByLabel("Question").last().fill("Do you build online stores?");

  // Drafts are private until published.
  await expect(page.locator(".status-saved")).toBeVisible({ timeout: 5000 });
  const live = await context.newPage();
  await live.goto("/");
  await expect(live.locator(".price-amount").first()).toHaveText("$10/ month");

  await page.getByRole("button", { name: "Publish changes" }).click();
  await expect(
    page.getByText("Published! Your changes are now live."),
  ).toBeVisible();
  await live.reload();
  await expect(live.locator(".price-amount").first()).toHaveText("$12/ month");
  await expect(live.locator("summary").first()).toContainText(
    "What happens in the free chat?",
  );
  await expect(live.locator("summary").last()).toContainText(
    "Do you build online stores?",
  );

  // History keeps the previous version and can restore it into the draft.
  await page.getByRole("button", { name: "History" }).click();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Restore", exact: true })
    .first()
    .click();
  await expect(page.getByText("Version restored")).toBeVisible();
  await page.getByRole("button", { name: "Publish changes" }).click();
  await expect(page.getByText("Published!")).toBeVisible();
  await live.reload();
  await expect(live.locator(".price-amount").first()).toHaveText("$10/ month");
  expect(errors).toEqual([]);
});

test("admin API rejects unauthenticated and cross-site writes", async ({
  request,
}) => {
  const draft = await request.get("/api/admin/draft");
  expect(draft.status()).toBe(401);
  const crossSite = await request.put("/api/admin/draft", {
    headers: {
      Origin: "https://evil.example",
      "Content-Type": "application/json",
    },
    data: { content: {} },
  });
  expect(crossSite.status()).toBe(403);
  const content = await request.get("/api/content");
  expect((await content.json()).services.length).toBe(5);
});

test("example sites open from the showcase and their pages work", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "View Restaurant & hospitality example" })
    .click();
  const [site] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Open live concept" }).click(),
  ]);
  await site.waitForLoadState();
  await expect(site).toHaveURL(/\/examples\/restaurant\/$/);
  await site
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Menu" })
    .click();
  await site.getByRole("tab", { name: "Dinner" }).click();
  await expect(site.getByRole("tabpanel")).toContainText("Dry-aged ribeye");

  await site.goto("/examples/store/shop.html");
  await site.locator('[data-add="loop"]').click();
  await expect(site.locator(".cart-count").first()).toHaveText("1");
  await site.goto("/examples/store/cart.html");
  await expect(site.locator(".line")).toHaveCount(1);
});

test("custom pages, blog, menus and deep links work on the public site", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Blog" })
    .click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Notes & guides",
  );
  await page.getByRole("link", { name: "Guides", exact: true }).click();
  await expect(page).toHaveURL(/tag=guides/);
  await page
    .getByRole("link", { name: /How to choose web hosting/ })
    .first()
    .click();
  await expect(page).toHaveTitle(/How to choose web hosting/);

  // A link to a specific question opens it on the home page.
  await page
    .getByRole("link", { name: "Melbourne and Sydney, with US and UK options" })
    .click();
  await expect(page).toHaveURL(/#faq-hosting-location$/);
  await expect(page.locator("#faq-hosting-location")).toHaveAttribute(
    "open",
    "",
  );
  await page.goBack();
  await expect(page).toHaveTitle(/How to choose web hosting/);

  // A link to a specific package switches to the right tab.
  await page.goto("/#plan-email-pro-email");
  await expect(page.getByRole("tab", { name: "Hosted email" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#plan-email-pro-email")).toBeInViewport();

  // A link can highlight exact text.
  await page.goto("/?hl=Virtualmin%20Pro%20on%20LEMP#about");
  await expect
    .poll(() =>
      page.evaluate(() =>
        CSS.highlights.get("wtp-target")?.values().next().value?.toString(),
      ),
    )
    .toBe("Virtualmin Pro on LEMP");

  // A page built from blocks, with live prices.
  await page.goto("/web-hosting#plans");
  await expect(page).toHaveTitle("Australian web hosting | WebTechPros");
  await expect(page.locator("#plans .price-amount").first()).toHaveText(
    "$10/ month",
  );
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "That page has moved on.",
  );

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/web-hosting</loc>");
  expect(sitemap).toContain("/blog/how-to-choose-web-hosting</loc>");
  const rss = await request.get("/blog/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(await rss.text()).toContain(
    "<title>How to choose web hosting for a small business</title>",
  );
  expect(errors).toEqual([]);
});

test("admin: build a page with blocks and links, write a post, and publish", async ({
  page,
  context,
}) => {
  await page.goto("/admin/");
  await page.getByLabel("Password").fill("test-admin-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  const preview = page.frameLocator("iframe");

  await page.getByRole("button", { name: "Pages", exact: true }).click();
  await page.getByRole("button", { name: "Add a page" }).click();
  await page.getByRole("button", { name: /Service page/ }).click();
  await page
    .getByRole("textbox", { name: /^Page title/ })
    .fill("Business email");
  await page.getByRole("button", { name: "Use title" }).click();
  await expect(page.getByRole("textbox", { name: "Web address" })).toHaveValue(
    "business-email",
  );
  await expect(preview.locator(".custom-page .block-hero h1")).toBeVisible();

  // Edit the hero right in the preview.
  const heading = preview.locator(
    '[data-edit-path="pages.1.blocks.0.heading"]',
  );
  await heading.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("Email your customers trust.");
  await page.keyboard.press("Tab");

  // Add a text block whose link points at a specific question and highlights text.
  await page.getByRole("button", { name: "Add a block" }).last().click();
  await page.getByRole("menuitem", { name: /^Text/ }).click();
  const editor = page.locator(".block-card.is-open .rich-body");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("Where we host");
  await page.keyboard.press("ControlOrMeta+A");
  await page
    .locator(".block-card.is-open")
    .getByRole("button", { name: "Add link" })
    .click();
  const picker = page.getByRole("dialog", { name: "Link the selected text" });
  await picker.getByLabel("Search link targets").fill("hosted");
  await picker
    .getByRole("option", { name: /Where will my website be hosted/ })
    .click();
  await picker
    .getByLabel("Highlight exact text (optional)")
    .fill("Melbourne and Sydney");
  await picker.getByRole("button", { name: "Use this link" }).click();
  await expect(editor.locator("a")).toHaveAttribute(
    "href",
    "/?hl=Melbourne+and+Sydney#faq-hosting-location",
  );
  await page.getByRole("textbox", { name: /^Link name/ }).fill("hosting-note");
  await page.getByRole("switch").first().check();
  await page.getByRole("button", { name: "Add to top menu" }).click();

  // Write and show a blog post.
  await page.getByRole("button", { name: "Blog", exact: true }).click();
  await page.getByRole("button", { name: "Write a new post" }).click();
  await page
    .getByRole("textbox", { name: /^Title/ })
    .fill("Moving your business email");
  await page.getByRole("button", { name: "Use title" }).click();
  await page.getByRole("textbox", { name: /^Topics/ }).fill("Email, Guides");
  await page.getByRole("switch").first().check();
  await expect(preview.locator(".post-head h1")).toHaveText(
    "Moving your business email",
  );

  await expect(page.locator(".status-saved")).toBeVisible({ timeout: 5000 });
  await page.getByRole("button", { name: "Publish changes" }).click();
  await expect(
    page.getByText("Published! Your changes are now live."),
  ).toBeVisible();

  const live = await context.newPage();
  await live.goto("/");
  await live
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Business email" })
    .click();
  await expect(live.locator(".block-hero h1")).toHaveText(
    "Email your customers trust.",
  );
  await live.locator("#hosting-note a").click();
  await expect(live.locator("#faq-hosting-location")).toHaveAttribute(
    "open",
    "",
  );
  await live.goto("/blog/moving-your-business-email");
  await expect(live.getByRole("heading", { level: 1 })).toHaveText(
    "Moving your business email",
  );
});
