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
