// Edit service descriptions, prices and FAQs here. Prices are in AUD.
// A null price deliberately displays "Request a quote" rather than inventing a price.
export const brand = {
  name: "WebTechPros",
  domain: "webtechpros.net",
  consultationMinutes: 30,
  headline: ["Your next move.", "Made digital."],
  intro:
    "Custom websites, reliable hosting and real IT support. Everything your business needs to make its next move.",
};

export type ServiceId =
  "design" | "hosting" | "email" | "support" | "telephony";
export type Plan = {
  name: string;
  price: number | null;
  unit: string;
  description: string;
  features: string[];
  featured?: boolean;
  label?: string;
};
export type Service = {
  id: ServiceId;
  title: string;
  heading: string;
  description: string;
  plans: Plan[];
  note: string;
};

export const services: Service[] = [
  {
    id: "hosting",
    title: "Web hosting",
    heading: "A good home for your next big thing.",
    description:
      "From your first launch to your next chapter. Straightforward hosting, with a real team behind it.",
    plans: [
      {
        name: "Starter",
        price: 10,
        unit: "/ month",
        description: "For startups, side projects and fresh ideas.",
        features: [
          "SSL certificate included",
          "Up to 5 GB storage",
          "250 GB bandwidth / month",
          "3-page website deployment",
          "Or 60+ one-click web applications",
        ],
      },
      {
        name: "Standard",
        price: 20,
        unit: "/ month",
        description: "More room for a growing business.",
        featured: true,
        label: "ROOM TO GROW",
        features: [
          "SSL certificate included",
          "Up to 10 GB storage",
          "350 GB bandwidth / month",
          "7-page website deployment",
          "Or 60+ one-click web applications",
        ],
      },
      {
        name: "Pro",
        price: null,
        unit: "",
        description: "For bigger websites and bigger ambitions.",
        features: [
          "SSL certificate included",
          "Up to 30 GB storage",
          "700 GB bandwidth / month",
          "Up to 10-page website deployment",
          "Or 60+ one-click web applications",
        ],
      },
    ],
    note: "Hosting prices are starting rates in AUD. Website design is quoted separately from deployment. Your consultation confirms scope, availability and any applicable tax.",
  },
  {
    id: "design",
    title: "Web & logo design",
    heading: "Built around you. Never off the shelf.",
    description:
      "Custom website design and implementation that turns your ideas into a distinctive online presence.",
    plans: [
      {
        name: "Package 1",
        price: 50,
        unit: "one-off",
        description: "A starting point for your online presence.",
        features: [
          "Custom website design",
          "Website implementation",
          "Scope agreed during consultation",
        ],
      },
      {
        name: "Package 2",
        price: 150,
        unit: "one-off",
        description: "A complete design and implementation package.",
        featured: true,
        label: "YOUR NEXT CHAPTER",
        features: [
          "Complete website design",
          "Website implementation",
          "Scope agreed during consultation",
        ],
      },
      {
        name: "Package 3",
        price: 500,
        unit: "one-off",
        description: "Our third complete website package.",
        features: [
          "Complete website design",
          "Website implementation",
          "Scope agreed during consultation",
        ],
      },
    ],
    note: "All design prices are starting rates in AUD. Page counts, functionality, revisions, content and ongoing hosting are confirmed in your individual quote.",
  },
  {
    id: "email",
    title: "Hosted email",
    heading: "Your business. In every inbox.",
    description:
      "Professional hosted IMAP email, with shared and private options. No lock-in contracts.",
    plans: [
      {
        name: "Basic Email",
        price: 6,
        unit: "/ seat / month",
        description: "Option 1: a dependable shared mail platform.",
        features: [
          "10 GB cloud storage",
          "IMAP mail access",
          "CalDAV calendar integration",
          "Spam filtering & antivirus",
          "No lock-in contracts",
        ],
      },
      {
        name: "Pro Email",
        price: 60,
        unit: "/ 5 seats / month",
        description: "Option 2: email on a private virtual server.",
        featured: true,
        label: "YOUR OWN PLATFORM",
        features: [
          "60 GB cloud storage",
          "Private virtual server platform",
          "IMAP & CalDAV calendar integration",
          "Spam filtering & antivirus",
          "No lock-in contracts",
        ],
      },
    ],
    note: "Prices in AUD. Storage allocation, additional seats, migration requirements and any applicable tax are confirmed in your quote.",
  },
  {
    id: "support",
    title: "IT support",
    heading: "Less troubleshooting. More getting on.",
    description:
      "Practical help for everyday devices, business servers and the networks connecting them.",
    plans: [
      {
        name: "Everyday IT",
        price: 110,
        unit: "/ hour",
        description: "Help with the technology you use every day.",
        features: [
          "PC & desktop support",
          "Laptop troubleshooting",
          "Discuss your issue with a real person",
        ],
      },
      {
        name: "Servers & infrastructure",
        price: 150,
        unit: "/ hour",
        description: "Technical support for your business backbone.",
        featured: true,
        label: "BUSINESS BACKBONE",
        features: [
          "Server support",
          "Infrastructure troubleshooting",
          "MikroTik networking included",
        ],
      },
    ],
    note: "Server and infrastructure support starts at $150 AUD per hour. Scope, access requirements, minimum charges and any applicable tax are agreed before work starts.",
  },
  {
    id: "telephony",
    title: "IP telephony",
    heading: "Good conversations start here.",
    description:
      "Hosted business phone systems tailored to the way your team works, wherever they work.",
    plans: [
      {
        name: "Hosted 3CX",
        price: null,
        unit: "",
        description: "A 3CX solution planned around your business.",
        features: [
          "Hosted phone system",
          "Discuss users, call flows & features",
          "Hosting and setup quoted to scope",
        ],
      },
      {
        name: "Hosted FreePBX",
        price: null,
        unit: "",
        description: "A flexible FreePBX-based hosted solution.",
        featured: true,
        label: "BUILT AROUND YOUR TEAM",
        features: [
          "Hosted phone system",
          "Discuss extensions & integrations",
          "Hosting and setup quoted to scope",
        ],
      },
    ],
    note: "Telephony packages are quoted after consultation. We confirm licensing, call plans, handsets, number porting and requested features in your proposal.",
  },
];

export const logoPackage = {
  price: 110,
  title: "A logo that feels like you.",
  description:
    "Custom logo design, a pack of common sizes for your web presence, and up to 30 minutes of consulting to understand your vision.",
};

export const projects = [
  {
    id: "business",
    name: "A stronger first impression.",
    type: "Business website",
    image: "/images/project-business.webp",
    description:
      "A clear, confident home for a local business, with services that are easy to find.",
  },
  {
    id: "store",
    name: "From browsing to buying.",
    type: "Ecommerce store",
    image: "/images/project-store.webp",
    description:
      "An expressive shopfront that puts the products, and the shopping experience, first.",
  },
  {
    id: "blog",
    name: "Ideas worth spending time with.",
    type: "Blog & publication",
    image: "/images/project-blog.webp",
    description:
      "An editorial space built for stories, discoveries and a growing audience.",
  },
  {
    id: "crm",
    name: "A little less busywork.",
    type: "CRM application",
    image: "/images/project-crm.webp",
    description:
      "A focused workspace for contacts, opportunities and keeping the next step in sight.",
  },
];

export const faqs = [
  {
    question: "What happens in the free consultation?",
    answer:
      "We spend up to 30 minutes understanding your business, your goals and the features you need. You can ask about websites, logos, hosting, email, IT support or phone systems. We then confirm a suitable scope and quote. Submitting a request starts a conversation; it does not book a calendar slot or commit you to a purchase.",
  },
  {
    question: "Can you design my logo as well as my website?",
    answer:
      "Yes. Custom logo packs start at $110 AUD and include common logo dimensions for your online presence, plus up to 30 minutes of consulting to understand your vision. Website design and implementation packages start at $50, $150 and $500 AUD. We agree on deliverables during consultation.",
  },
  {
    question: "Where will my website be hosted?",
    answer:
      "We offer hosting in Melbourne and Sydney data centres, with US and UK options for international customers. We work with people around the world and help select a location close to your audience for lower latency. Availability is confirmed when we prepare your quote.",
  },
  {
    question: "What is included in the hosting platform?",
    answer:
      "Our Virtualmin Pro platform uses a LEMP stack: Linux, Nginx, MariaDB/MySQL and PHP. It supports domain and DNS management, databases, SSL certificate management, SFTP access and backup scheduling. Access, retention and individual features depend on your plan and configuration, which we confirm during consultation. Each standard hosting plan includes SSL and deployment of the stated page count, or a choice of 60+ one-click applications.",
  },
  {
    question: "Do hosted email plans have lock-in contracts?",
    answer:
      "No. Both hosted IMAP email options have no lock-in contracts. Basic Email is $6 AUD per seat per month on our shared platform with 10 GB cloud storage. Pro Email is $60 AUD per five seats per month on a private virtual server with 60 GB cloud storage. Both include CalDAV calendars, spam filtering and antivirus. We confirm storage allocation and migration needs in your quote.",
  },
  {
    question: "Can you help with our network or business phones?",
    answer:
      "Yes. Server and infrastructure support, including MikroTik networking, starts at $150 AUD per hour. PC, desktop and laptop support is $110 AUD per hour. We also offer hosted 3CX and FreePBX phone systems, quoted after discussing your users and the features you need.",
  },
];
