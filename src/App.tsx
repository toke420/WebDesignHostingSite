import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  GlobeHemisphereEastIcon,
  CursorClickIcon,
  HardDrivesIcon,
  EnvelopeSimpleIcon,
  HeadsetIcon,
  PhoneCallIcon,
  ListIcon,
  XIcon,
  ChatCircleDotsIcon,
  ShieldCheckIcon,
  LightningIcon,
  ClockIcon,
  PaletteIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react";
import {
  serviceOrder,
  formatPrice,
  type Project,
  type ServiceId,
} from "./content";
import { T, useSite } from "./editable";
import {
  ActionsContext,
  PlanGrid,
  selectAttr,
  useDeepLinks,
  useRouter,
} from "./site";
import { FaqItem, RouteView } from "./pages";
import { submitConsultation, openChat } from "./helpdesk";

const serviceIcons = {
  design: CursorClickIcon,
  hosting: HardDrivesIcon,
  email: EnvelopeSimpleIcon,
  support: HeadsetIcon,
  telephony: PhoneCallIcon,
};
const benefitIcons = [LightningIcon, ShieldCheckIcon, ChatCircleDotsIcon];
type Consultation = { service: string; detail: string };

function Wordmark() {
  return (
    <a className="wordmark" href="/" aria-label="WebTechPros home">
      <span className="brand-mark" aria-hidden="true">
        w<span>.</span>
      </span>
      <span>
        webtech<span className="wordmark-light">pros</span>
        <span className="brand-period">.</span>
      </span>
    </a>
  );
}

export default function App() {
  const { content, editing } = useSite();
  const { services, projects, faqs, logoPackage, sections, settings, brand } =
    content;
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId>("hosting");
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [chatState, setChatState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [chatLoaded, setChatLoaded] = useState(false);
  const serviceIndex = Math.max(
    0,
    services.findIndex((s) => s.id === activeService),
  );
  const service = services[serviceIndex];
  const visibleProjects = projects.filter((p) => p.visible);
  const consult = (serviceName = "Not sure yet", detail = "") => {
    if (editing) return;
    window.HelpDesk?.close();
    setConsultation({ service: serviceName, detail });
    setMobileMenu(false);
  };
  const chat = async () => {
    setChatState("loading");
    try {
      await openChat();
      setChatLoaded(true);
      setChatState("idle");
    } catch {
      setChatState("error");
    }
  };

  const { route, path } = useRouter();
  useDeepLinks(setActiveService);
  useEffect(() => {
    if (editing) return;
    const titles = {
      home: [content.seo.title, content.seo.description],
      page:
        route.kind === "page"
          ? [
              `${route.page.title} | ${brand.name}`,
              route.page.description || content.seo.description,
            ]
          : [],
      post:
        route.kind === "post"
          ? [
              `${route.post.title} | ${brand.name}`,
              route.post.excerpt || content.seo.description,
            ]
          : [],
      blog: [
        `${content.blog.title} | ${brand.name}`,
        content.blog.intro || content.seo.description,
      ],
      notfound: [`Page not found | ${brand.name}`, content.seo.description],
    }[route.kind];
    document.title = titles[0];
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", titles[1]);
    setMobileMenu(false);
  }, [route, content.seo, content.blog, brand.name, editing]);

  useEffect(() => {
    if (!editing) return;
    const listener = (event: MessageEvent) => {
      if (event.origin !== location.origin) return;
      if (event.data?.type === "wtp:service") setActiveService(event.data.id);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [editing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route.kind, path]);

  const announcement = settings.announcement;
  const ProjectTag = editing ? "div" : "button";

  return (
    <ActionsContext.Provider value={{ consult }}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {(announcement.enabled || (editing && announcement.text)) && (
        <div
          className={`announcement ${announcement.enabled ? "" : "is-hidden-live"}`}
          {...selectAttr({ panel: "settings" })}
        >
          <MegaphoneIcon size={16} />
          {announcement.link && !editing ? (
            <a href={announcement.link}>{announcement.text}</a>
          ) : (
            <T path="settings.announcement.text" />
          )}
        </div>
      )}
      <header className="site-header">
        <div className="container nav-inner">
          <Wordmark />
          <nav
            id="main-navigation"
            className={mobileMenu ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            {content.menus.header.map((item, i) => (
              <a
                key={i}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                aria-current={
                  item.href === path ||
                  (item.href !== "/" && path.startsWith(item.href + "/"))
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="button button-yellow nav-cta"
            onClick={() => consult()}
          >
            Free consultation <ArrowUpRightIcon size={17} />
          </button>
          <button
            className="menu-toggle"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
            aria-controls="main-navigation"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <XIcon size={25} /> : <ListIcon size={25} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="mobile-consult" id="mobile-links">
            <button className="button button-yellow" onClick={() => consult()}>
              Free consultation <ArrowUpRightIcon />
            </button>
          </div>
        )}
      </header>

      <main id="main">
        {route.kind !== "home" ? (
          <RouteView route={route} />
        ) : (
          <>
            <section
              className="hero container"
              id="home"
              aria-labelledby="hero-title"
              {...selectAttr({ panel: "text", group: "brand" })}
            >
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="eyebrow-line" /> <T path="brand.eyebrow" />
                </p>
                <h1 id="hero-title">
                  <T as="span" className="hero-line" path="brand.headline.0" />
                  <br />
                  <T
                    as="span"
                    className="hero-accent"
                    path="brand.headline.1"
                  />
                </h1>
                <T as="p" className="hero-intro" path="brand.intro" multiline />
                <div className="hero-actions">
                  <button
                    className="button button-yellow"
                    onClick={() => consult()}
                  >
                    Free consultation <ArrowUpRightIcon size={20} />
                  </button>
                  <a className="text-link" href="#services">
                    Explore services <ArrowRightIcon size={18} />
                  </a>
                </div>
              </div>
              <div className="hero-art">
                <img
                  src="/images/hero-sculpture.webp"
                  alt="Sculptural yellow ribbons connected into a bold geometric form"
                  fetchPriority="high"
                  width="1448"
                  height="1086"
                />
                <div className="art-corner top" aria-hidden="true" />
                <div className="art-corner bottom" aria-hidden="true" />
              </div>
            </section>

            <div
              className="container service-rail"
              aria-label="Our capabilities"
            >
              {[...services]
                .sort(
                  (a, b) =>
                    serviceOrder.indexOf(a.id) - serviceOrder.indexOf(b.id),
                )
                .map((s) => {
                  const Icon = serviceIcons[s.id];
                  return (
                    <a
                      key={s.id}
                      href="#services"
                      onClick={() => setActiveService(s.id)}
                    >
                      <Icon size={22} weight="light" />
                      <span>{s.title}</span>
                      <ArrowUpRightIcon className="rail-arrow" size={15} />
                    </a>
                  );
                })}
            </div>

            <section
              className="section container services-section reveal"
              id="services"
              aria-labelledby="services-heading"
            >
              <div
                className="section-title-row"
                {...selectAttr({ panel: "text", group: "services" })}
              >
                <div>
                  <T
                    as="p"
                    className="section-kicker"
                    path="sections.services.kicker"
                  />
                  <h2 id="services-heading">
                    <T path="sections.services.heading" />{" "}
                    <T
                      className="muted"
                      path="sections.services.headingMuted"
                    />
                  </h2>
                </div>
                <T className="small-note" path="sections.services.aside" />
              </div>
              <div
                className="service-tabs"
                role="tablist"
                aria-label="Service packages"
              >
                {services.map((s, index) => {
                  const Icon = serviceIcons[s.id];
                  return (
                    <button
                      id={`tab-${s.id}`}
                      key={s.id}
                      role="tab"
                      aria-selected={activeService === s.id}
                      aria-controls={`panel-${s.id}`}
                      tabIndex={activeService === s.id ? 0 : -1}
                      onClick={() => setActiveService(s.id)}
                      {...selectAttr({ panel: "packages", service: s.id })}
                      onKeyDown={(e) => {
                        let next = index;
                        if (e.key === "ArrowRight")
                          next = (index + 1) % services.length;
                        else if (e.key === "ArrowLeft")
                          next =
                            (index + services.length - 1) % services.length;
                        else if (e.key === "Home") next = 0;
                        else if (e.key === "End") next = services.length - 1;
                        else return;
                        e.preventDefault();
                        setActiveService(services[next].id);
                        document
                          .getElementById(`tab-${services[next].id}`)
                          ?.focus();
                      }}
                    >
                      <Icon size={19} />
                      {s.title}
                    </button>
                  );
                })}
              </div>
              <div
                role="tabpanel"
                id={`panel-${service.id}`}
                aria-labelledby={`tab-${service.id}`}
                className="service-panel"
                key={service.id}
              >
                <div
                  className="service-panel-heading"
                  {...selectAttr({ panel: "packages", service: service.id })}
                >
                  <T as="h3" path={`services.${serviceIndex}.heading`} />
                  <T
                    as="p"
                    path={`services.${serviceIndex}.description`}
                    multiline
                  />
                </div>
                <PlanGrid serviceIndex={serviceIndex} />
                {service.id === "design" && (
                  <div
                    className="logo-offer"
                    {...selectAttr({ panel: "packages", service: "logo" })}
                  >
                    <PaletteIcon size={40} weight="light" />
                    <div>
                      <T as="h4" path="logoPackage.title" />
                      <T as="p" path="logoPackage.description" multiline />
                    </div>
                    <button
                      onClick={() =>
                        consult(
                          "Logo design",
                          "I'm interested in a custom logo pack.",
                        )
                      }
                      className="text-link"
                    >
                      {logoPackage.price === null
                        ? "Request a quote"
                        : `From $${formatPrice(logoPackage.price)} AUD`}{" "}
                      <ArrowUpRightIcon size={19} />
                    </button>
                  </div>
                )}
                <T
                  as="p"
                  className="pricing-note"
                  path={`services.${serviceIndex}.note`}
                  multiline
                />
              </div>
            </section>

            <section
              className="section projects-section container reveal"
              id="projects"
              aria-labelledby="projects-heading"
            >
              <div
                className="section-title-row"
                {...selectAttr({ panel: "text", group: "projects" })}
              >
                <h2 id="projects-heading">
                  <T path="sections.projects.heading" />
                  <br />
                  <T className="muted" path="sections.projects.headingMuted" />
                </h2>
                <a
                  className="text-link"
                  href="#services"
                  onClick={() => setActiveService("design")}
                >
                  Explore web design <ArrowUpRightIcon size={18} />
                </a>
              </div>
              <T
                as="p"
                className="section-intro"
                path="sections.projects.intro"
                multiline
              />
              <div className="project-grid">
                {visibleProjects.map((p, index) => {
                  const i = projects.indexOf(p);
                  return (
                    <ProjectTag
                      key={p.id}
                      className={`project project-${p.id}`}
                      onClick={editing ? undefined : () => setProject(p)}
                      aria-label={
                        editing ? undefined : `View ${p.type} example`
                      }
                      {...selectAttr({ panel: "showcase", project: i })}
                    >
                      <div className="project-image">
                        <img
                          src={p.image}
                          alt={`${p.type} concept preview`}
                          loading="lazy"
                          width="1200"
                          height="800"
                        />
                      </div>
                      <div className="project-caption">
                        <div>
                          <span className="project-type">
                            <T path={`projects.${i}.type`} />{" "}
                            <span className="example-label">
                              / Concept {String(index + 1).padStart(2, "0")}
                            </span>
                          </span>
                          <T as="h3" path={`projects.${i}.name`} />
                        </div>
                        <span className="project-arrow">
                          <ArrowUpRightIcon size={22} />
                        </span>
                      </div>
                    </ProjectTag>
                  );
                })}
              </div>
              <T
                as="p"
                className="small-note project-disclaimer"
                path="sections.projects.disclaimer"
                multiline
              />
            </section>

            <section
              className="section infrastructure-section container reveal"
              id="about"
              aria-labelledby="about-heading"
              {...selectAttr({ panel: "text", group: "about" })}
            >
              <div className="infrastructure-visual">
                <GlobeHemisphereEastIcon size={230} weight="thin" />
                <div className="location-grid">
                  {sections.about.locations.map((_, i) => (
                    <span key={i}>
                      <span className="location-line" />
                      <T path={`sections.about.locations.${i}`} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="infrastructure-copy">
                <T as="p" className="eyebrow" path="sections.about.eyebrow" />
                <h2 id="about-heading">
                  <T path="sections.about.heading" />
                  <br />
                  <T className="muted" path="sections.about.headingMuted" />
                </h2>
                <T as="p" path="sections.about.body" multiline />
                <div className="benefits">
                  {sections.about.benefits.map((_, i) => {
                    const Icon = benefitIcons[i] || LightningIcon;
                    return (
                      <div key={i}>
                        <Icon size={23} />
                        <div>
                          <T
                            as="h3"
                            path={`sections.about.benefits.${i}.title`}
                          />
                          <T
                            as="p"
                            path={`sections.about.benefits.${i}.body`}
                            multiline
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section
              className="section process-section container reveal"
              id="process"
              aria-labelledby="process-heading"
              {...selectAttr({ panel: "text", group: "process" })}
            >
              <h2 id="process-heading">
                <T path="sections.process.heading" />{" "}
                <T className="muted" path="sections.process.headingMuted" />
              </h2>
              <div className="process-grid">
                {sections.process.steps.map((_, i) => (
                  <div key={i}>
                    <span className="process-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <T as="h3" path={`sections.process.steps.${i}.title`} />
                    <T
                      as="p"
                      path={`sections.process.steps.${i}.body`}
                      multiline
                    />
                  </div>
                ))}
              </div>
            </section>

            <section
              className="section faq-section container reveal"
              id="faq"
              aria-labelledby="faq-heading"
            >
              <div
                className="faq-intro"
                {...selectAttr({ panel: "text", group: "faq" })}
              >
                <h2 id="faq-heading">
                  <T path="sections.faq.heading" />
                  <br />
                  <T className="muted" path="sections.faq.headingMuted" />
                </h2>
                <T as="p" path="sections.faq.intro" multiline />
                <button className="text-link" onClick={() => consult()}>
                  Free consultation <ArrowUpRightIcon size={19} />
                </button>
              </div>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <FaqItem key={faq.id} id={faq.id} index={i} />
                ))}
              </div>
            </section>

            <section
              className="consultation-section container reveal"
              id="contact"
              {...selectAttr({ panel: "text", group: "cta" })}
            >
              <div className="consultation-box">
                <span className="consultation-icon" aria-hidden="true">
                  <ArrowUpRightIcon size={82} weight="light" />
                </span>
                <div>
                  <p className="consultation-label">
                    <ClockIcon size={17} /> <T path="sections.cta.label" />
                  </p>
                  <T as="h2" path="sections.cta.heading" multiline />
                  <T as="p" path="sections.cta.body" multiline />
                  <button
                    className="button button-dark"
                    onClick={() => consult()}
                  >
                    <T path="sections.cta.button" />{" "}
                    <ArrowUpRightIcon size={20} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer
        className="site-footer container"
        {...selectAttr({ panel: "text", group: "brand" })}
      >
        <div className="footer-main">
          <div>
            <Wordmark />
            <T as="p" path="brand.tagline" />
            {(brand.email || brand.phone) && (
              <p className="footer-contact">
                {brand.email && (
                  <a href={`mailto:${brand.email}`}>{brand.email}</a>
                )}
                {brand.phone && (
                  <a href={`tel:${brand.phone.replace(/[^+\d]/g, "")}`}>
                    {brand.phone}
                  </a>
                )}
              </p>
            )}
          </div>
          <div className="footer-links">
            {content.menus.footer.map((item, i) => (
              <a key={i} href={item.href}>
                {item.label}
              </a>
            ))}
            <button onClick={() => consult()}>
              Free consultation <ArrowUpRightIcon size={16} />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </span>
          <T path="brand.footerNote" />
          <button onClick={() => setPrivacy(true)}>Privacy & pricing</button>
        </div>
      </footer>

      {!chatLoaded && !editing && settings.showChat && (
        <div className="chat-launcher-wrap">
          {chatState === "error" && (
            <p role="alert" className="chat-error">
              Chat is temporarily unavailable.
              <br />
              Please try again shortly.
            </p>
          )}
          <button
            className="chat-launcher"
            onClick={chat}
            disabled={chatState === "loading"}
            aria-label="Open WebTechPros chat"
          >
            <ChatCircleDotsIcon size={24} weight="fill" />
            {chatState === "loading" ? "Connecting…" : "Let’s chat"}
            <ArrowUpRightIcon size={16} />
          </button>
        </div>
      )}

      {consultation && (
        <ConsultationDialog
          initial={consultation}
          onClose={() => setConsultation(null)}
          onChat={async () => {
            setConsultation(null);
            await chat();
          }}
        />
      )}
      {project && (
        <Modal
          onClose={() => setProject(null)}
          title={project.type}
          className="project-modal"
        >
          <span className="modal-kicker">ILLUSTRATIVE DESIGN CONCEPT</span>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <img
            src={project.image}
            alt={`${project.type} concept, full preview`}
          />
          <div className="modal-actions">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="button button-outline"
              >
                Open live concept <ArrowUpRightIcon size={18} />
              </a>
            )}
            <button
              className="button button-yellow"
              onClick={() => {
                setProject(null);
                consult(
                  "Web & logo design",
                  `I'm interested in a ${project.type.toLowerCase()}.`,
                );
              }}
            >
              Free consultation <ArrowUpRightIcon size={18} />
            </button>
          </div>
        </Modal>
      )}
      {privacy && (
        <Modal onClose={() => setPrivacy(false)} title="Privacy & pricing">
          <h2>Privacy & pricing</h2>
          <h3>Your consultation request</h3>
          <p>
            Your name, email, selected service and message are sent to our
            self-hosted Helpdesk so the team can respond. Only share information
            you want us to use for your enquiry. Please do not send passwords or
            sensitive account details.
          </p>
          <h3>Chat on this device</h3>
          <p>
            Helpdesk stores a visitor token in your browser’s local storage to
            reconnect you with your own cases. Your page address is included
            with the request. Clearing browser data removes this browser’s
            connection to your conversations.
          </p>
          <h3>Clear scope before work begins</h3>
          <p>
            All advertised prices are in Australian dollars. Starting prices are
            subject to your agreed scope. Your written quote confirms
            deliverables, timing and any applicable tax. Requesting a free
            consultation does not confirm a booking or create a paid order.
          </p>
        </Modal>
      )}
    </ActionsContext.Provider>
  );
}

function Modal({
  children,
  onClose,
  title,
  className = "",
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const focused = document.activeElement as HTMLElement;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = "";
      focused?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="modal-close"
        aria-label="Close dialog"
        onClick={onClose}
      >
        <XIcon size={24} />
      </button>
      {children}
    </dialog>
  );
}

function ConsultationDialog({
  initial,
  onClose,
  onChat,
}: {
  initial: Consultation;
  onClose: () => void;
  onChat: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [service, setService] = useState(initial.service);
  const { services } = useSite().content;
  const options = [
    "Not sure yet",
    ...services.map((s) => s.title),
    "Logo design",
  ];
  return (
    <Modal onClose={onClose} title="Free 30-minute consultation">
      {status === "success" ? (
        <div className="consultation-success" role="status">
          <span className="success-icon">
            <CheckIcon size={35} />
          </span>
          <h2>Your next move starts here.</h2>
          <p>
            Your request is in our helpdesk as <strong>{caseNumber}</strong>.
            The team will review your ideas and get in touch to arrange a time.
          </p>
          <p className="small-note">
            This is a consultation request, not a confirmed appointment. Keep
            the conversation going in chat.
          </p>
          <button className="button button-yellow" onClick={onChat}>
            Open your conversation <ChatCircleDotsIcon size={20} />
          </button>
        </div>
      ) : (
        <>
          <span className="modal-kicker">
            <ClockIcon size={17} /> FREE 30-MINUTE CONSULTATION
          </span>
          <h2>Tell us what’s next.</h2>
          <p>
            A new website? A better setup? Let’s work out the right approach
            together.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              if (data.get("website")) return;
              setStatus("sending");
              setError("");
              try {
                const number = await submitConsultation(
                  String(data.get("name")).trim(),
                  String(data.get("email")).trim(),
                  service,
                  String(data.get("message")).trim(),
                );
                setCaseNumber(number);
                setStatus("success");
              } catch (err) {
                setError(
                  err instanceof Error &&
                    !["TimeoutError", "TypeError"].includes(err.name)
                    ? err.message
                    : "We could not reach the helpdesk. Your request has not been confirmed. Please try again shortly.",
                );
                setStatus("error");
              }
            }}
          >
            <fieldset disabled={status === "sending"}>
              <div className="form-grid">
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Sam Taylor"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@yourbusiness.com"
                  />
                </label>
              </div>
              <label>
                What can we help with?
                <select
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {options.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                A little about your project
                <textarea
                  name="message"
                  rows={4}
                  defaultValue={initial.detail}
                  required
                  minLength={10}
                  maxLength={3500}
                  placeholder="Your ideas, the features you need, and what you’d like to achieve…"
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className="consent">
                <input type="checkbox" required />
                <span>
                  I agree to my details being used to respond to this enquiry
                  through the WebTechPros helpdesk.
                </span>
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button button-yellow submit-button"
                type="submit"
              >
                {status === "sending"
                  ? "Sending your request…"
                  : "Request consultation"}
                <ArrowUpRightIcon size={20} />
              </button>
              <p className="form-footnote">
                No payment. No obligation. We’ll arrange a time with you.
              </p>
            </fieldset>
          </form>
        </>
      )}
    </Modal>
  );
}
