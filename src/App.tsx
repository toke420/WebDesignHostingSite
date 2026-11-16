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
  CodeIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import {
  brand,
  services,
  logoPackage,
  projects,
  faqs,
  type ServiceId,
} from "./content";
import { submitConsultation, openChat } from "./helpdesk";

const serviceIcons = {
  design: CursorClickIcon,
  hosting: HardDrivesIcon,
  email: EnvelopeSimpleIcon,
  support: HeadsetIcon,
  telephony: PhoneCallIcon,
};
type Consultation = { service: string; detail: string };

function Wordmark() {
  return (
    <a className="wordmark" href="#home" aria-label="WebTechPros home">
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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId>("hosting");
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [project, setProject] = useState<(typeof projects)[number] | null>(
    null,
  );
  const [privacy, setPrivacy] = useState(false);
  const [chatState, setChatState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [chatLoaded, setChatLoaded] = useState(false);
  const service = services.find((s) => s.id === activeService)!;
  const consult = (serviceName = "Not sure yet", detail = "") => {
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
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <Wordmark />
          <nav
            id="main-navigation"
            className={mobileMenu ? "main-nav is-open" : "main-nav"}
            aria-label="Main navigation"
          >
            <a href="#services" onClick={() => setMobileMenu(false)}>
              Our services
            </a>
            <a href="#projects" onClick={() => setMobileMenu(false)}>
              What we build
            </a>
            <a href="#about" onClick={() => setMobileMenu(false)}>
              Why WebTechPros
            </a>
            <a href="#faq" onClick={() => setMobileMenu(false)}>
              FAQs
            </a>
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
        <section
          className="hero container"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" /> YOUR IDEAS. OUR EXPERTISE.
            </p>
            <h1 id="hero-title">
              {brand.headline[0]}
              <br />
              <span>{brand.headline[1]}</span>
            </h1>
            <p className="hero-intro">{brand.intro}</p>
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

        <div className="container service-rail" aria-label="Our capabilities">
          {[...services]
            .sort(
              (a, b) =>
                ["design", "hosting", "email", "support", "telephony"].indexOf(
                  a.id,
                ) -
                ["design", "hosting", "email", "support", "telephony"].indexOf(
                  b.id,
                ),
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
          <div className="section-title-row">
            <div>
              <p className="section-kicker">
                THE RIGHT TOOLS. THE RIGHT PEOPLE.
              </p>
              <h2 id="services-heading">
                Your business, <span className="muted">connected.</span>
              </h2>
            </div>
            <span className="small-note">One team. From idea to online.</span>
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
                  onKeyDown={(e) => {
                    let next = index;
                    if (e.key === "ArrowRight")
                      next = (index + 1) % services.length;
                    else if (e.key === "ArrowLeft")
                      next = (index + services.length - 1) % services.length;
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
            <div className="service-panel-heading">
              <h3>{service.heading}</h3>
              <p>{service.description}</p>
            </div>
            <div className={`pricing-grid plans-${service.plans.length}`}>
              {service.plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`plan ${plan.featured ? "plan-featured" : ""}`}
                >
                  <div className="plan-label">
                    {plan.featured ? (
                      <>
                        <span className="plan-label-mark">↗</span> {plan.label}
                      </>
                    ) : (
                      <span aria-hidden="true">&nbsp;</span>
                    )}
                  </div>
                  <div className="plan-inner">
                    <h4>{plan.name}</h4>
                    <p className="plan-description">{plan.description}</p>
                    <div
                      className={`price ${plan.price === null ? "price-quote" : ""}`}
                    >
                      {plan.price === null ? (
                        <span>Let’s talk.</span>
                      ) : (
                        <>
                          <span className="price-from">
                            {["hosting", "design", "support"].includes(
                              service.id,
                            )
                              ? "FROM"
                              : "AUD"}
                          </span>
                          <span className="price-amount">
                            <span className="currency">$</span>
                            {plan.price}
                            <small>{plan.unit}</small>
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <CheckIcon size={16} weight="bold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`button ${plan.featured ? "button-yellow" : "button-outline"}`}
                      onClick={() =>
                        consult(
                          service.title,
                          `I'm interested in ${plan.name}.`,
                        )
                      }
                    >
                      {plan.price === null
                        ? "Request a quote"
                        : `Enquire about ${plan.name.replace(" Email", "")}`}
                      <ArrowUpRightIcon size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {service.id === "design" && (
              <div className="logo-offer">
                <PaletteIcon size={40} weight="light" />
                <div>
                  <h4>{logoPackage.title}</h4>
                  <p>{logoPackage.description}</p>
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
                  From ${logoPackage.price} AUD <ArrowUpRightIcon size={19} />
                </button>
              </div>
            )}
            <p className="pricing-note">{service.note}</p>
          </div>
        </section>

        <section
          className="section projects-section container reveal"
          id="projects"
          aria-labelledby="projects-heading"
        >
          <div className="section-title-row">
            <h2 id="projects-heading">
              Different ideas.
              <br />
              <span className="muted">Same attention to detail.</span>
            </h2>
            <a
              className="text-link"
              href="#services"
              onClick={() => setActiveService("design")}
            >
              Explore web design <ArrowUpRightIcon size={18} />
            </a>
          </div>
          <p className="section-intro">
            A business website, a new shopfront, or a smarter way to work.
            Here’s what your next project could look like.
          </p>
          <div className="project-grid">
            {projects.map((p, index) => (
              <button
                key={p.id}
                className={`project project-${p.id}`}
                onClick={() => setProject(p)}
                aria-label={`View ${p.type} example`}
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
                      {p.type}{" "}
                      <span className="example-label">
                        / Concept {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <h3>{p.name}</h3>
                  </div>
                  <span className="project-arrow">
                    <ArrowUpRightIcon size={22} />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="small-note project-disclaimer">
            Illustrative design concepts, not client case studies. Your project
            will be designed around your own business.
          </p>
        </section>

        <section
          className="section infrastructure-section container reveal"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="infrastructure-visual">
            <GlobeHemisphereEastIcon size={230} weight="thin" />
            <div className="location-grid">
              <span>
                <span className="location-line" />
                Melbourne
              </span>
              <span>
                <span className="location-line" />
                Sydney
              </span>
              <span>
                <span className="location-line" />
                United States
              </span>
              <span>
                <span className="location-line" />
                United Kingdom
              </span>
            </div>
          </div>
          <div className="infrastructure-copy">
            <p className="eyebrow">LOCAL KNOW-HOW. GLOBAL REACH.</p>
            <h2>
              Close to your customers.
              <br />
              <span className="muted">Closer to your business.</span>
            </h2>
            <p>
              Australian expertise, with hosting in Melbourne, Sydney, the US
              and the UK. We help put your website closer to the people who use
              it.
            </p>
            <div className="benefits">
              <div>
                <LightningIcon size={23} />
                <div>
                  <h3>A solid foundation</h3>
                  <p>
                    Virtualmin Pro on LEMP. Nginx, PHP and database tools for a
                    capable, flexible hosting platform.
                  </p>
                </div>
              </div>
              <div>
                <ShieldCheckIcon size={23} />
                <div>
                  <h3>The essentials, considered</h3>
                  <p>
                    SSL included. Domain, DNS, SFTP and backup options
                    configured to suit your plan.
                  </p>
                </div>
              </div>
              <div>
                <ChatCircleDotsIcon size={23} />
                <div>
                  <h3>Real people. Clear answers.</h3>
                  <p>
                    Talk directly with a team that can connect the dots across
                    your website, email, network and phones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section process-section container reveal"
          aria-labelledby="process-heading"
        >
          <h2 id="process-heading">
            From “what if” <span className="muted">to what’s next.</span>
          </h2>
          <div className="process-grid">
            <div>
              <span className="process-number">01</span>
              <h3>Let’s understand it.</h3>
              <p>
                A free 30-minute consultation to talk about your business, your
                ideas and what you actually need.
              </p>
            </div>
            <div>
              <span className="process-number">02</span>
              <h3>Make a clear plan.</h3>
              <p>
                We agree on features, scope and a quote. You know what’s
                included before we get to work.
              </p>
            </div>
            <div>
              <span className="process-number">03</span>
              <h3>Build. Launch. Support.</h3>
              <p>
                Bring the project to life, get it online, and keep the right
                technical support within reach.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section faq-section container reveal"
          id="faq"
          aria-labelledby="faq-heading"
        >
          <div className="faq-intro">
            <h2 id="faq-heading">
              Good questions.
              <br />
              <span className="muted">Straight answers.</span>
            </h2>
            <p>
              Still figuring things out?
              <br />
              That’s what the consultation is for.
            </p>
            <button className="text-link" onClick={() => consult()}>
              Free consultation <ArrowUpRightIcon size={19} />
            </button>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <PlusIcon className="faq-plus" size={20} />
                  <MinusIcon className="faq-minus" size={20} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="consultation-section container reveal">
          <div className="consultation-box">
            <span className="consultation-icon" aria-hidden="true">
              <ArrowUpRightIcon size={82} weight="light" />
            </span>
            <div>
              <p className="consultation-label">
                <ClockIcon size={17} /> 30 MINUTES. ZERO PRESSURE.
              </p>
              <h2>
                Let’s talk about
                <br />
                your next move.
              </h2>
              <p>Bring the idea. We’ll help you work out the rest.</p>
              <button className="button button-dark" onClick={() => consult()}>
                Free consultation <ArrowUpRightIcon size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer container">
        <div className="footer-main">
          <div>
            <Wordmark />
            <p>Good design. Solid hosting. Real support.</p>
          </div>
          <div className="footer-links">
            <a href="#services">Our services</a>
            <a href="#projects">What we build</a>
            <button onClick={() => consult()}>
              Free consultation <ArrowUpRightIcon size={16} />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} WebTechPros. All rights reserved.
          </span>
          <span>Built for your next move.</span>
          <button onClick={() => setPrivacy(true)}>Privacy & pricing</button>
        </div>
      </footer>

      {!chatLoaded && (
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
            <a
              href={`/examples/${project.id}.html`}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              Open concept <ArrowUpRightIcon size={18} />
            </a>
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
    </>
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
