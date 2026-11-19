import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Product"],
  ["pricing.html", "Pricing"],
  ["docs.html", "Docs"],
];
const plans = [
  ["Solo", 12, 9, "For freelancers getting paid faster.", ["Unlimited invoices", "3 clients", "Card & bank payments", "Payment reminders"]],
  ["Team", 39, 31, "For small teams that bill together.", ["Everything in Solo", "Unlimited clients", "5 team members", "Recurring invoices", "Xero & MYOB sync"], true],
  ["Business", 99, 79, "For growing businesses with more to manage.", ["Everything in Team", "Unlimited members", "Approvals & roles", "Multi-currency", "Priority support"]],
];
const docs = [
  ["getting-started", "Getting started", "Create your account, add your business details and send your first invoice in under five minutes.", "curl https://api.tallyflow.example/v1/me \\\n  -H \"Authorization: Bearer $TALLYFLOW_KEY\""],
  ["invoices", "Creating invoices", "Invoices have line items, a due date and a client. Drafts can be edited until they are sent.", "POST /v1/invoices\n{\n  \"client_id\": \"cl_82hf\",\n  \"due_in_days\": 14,\n  \"items\": [{ \"description\": \"Design\", \"quantity\": 10, \"unit_price\": 120 }]\n}"],
  ["payments", "Accepting payments", "Turn on card and bank payments in Settings → Payments. Paid invoices are reconciled automatically.", "GET /v1/invoices/inv_19a/payments"],
  ["reminders", "Automatic reminders", "Reminders are sent 3 days before, on, and 7 days after the due date. You can customise the wording.", "PATCH /v1/settings/reminders\n{ \"schedule\": [-3, 0, 7] }"],
  ["webhooks", "Webhooks", "Receive an HTTPS POST when an invoice is paid, overdue or viewed. Verify the signature header.", "{\n  \"type\": \"invoice.paid\",\n  \"data\": { \"id\": \"inv_19a\", \"amount\": 1320 }\n}"],
  ["api-keys", "API keys", "Create keys in Settings → Developers. Keys can be scoped to read-only and revoked at any time.", "export TALLYFLOW_KEY=tf_live_xxxxxxxx"],
];

export default {
  id: "saas",
  name: "Tallyflow",
  tagline: "Invoicing that gets you paid faster.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html"><span aria-hidden="true"></span>Tallyflow</a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}<a href="signup.html?mode=login" class="login">Log in</a></nav>
<a class="btn small hide-sm" href="signup.html">Start free trial</a>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<p class="logo"><span aria-hidden="true"></span>Tallyflow</p>
<div><strong>Product</strong><a href="index.html#features">Features</a><a href="pricing.html">Pricing</a><a href="docs.html">API docs</a></div>
<div><strong>Company</strong><a href="index.html#customers">Customers</a><a href="signup.html">Start free</a><span>Made in Sydney</span></div>
</div><p class="wrap fine">Design concept for a sample software product. Accounts are not created.</p></footer>`,
  pages: {
    "index.html": {
      title: "Invoicing that gets you paid",
      body: `
<section class="hero"><div class="wrap hero-inner">
<p class="pill">New: automatic payment reminders →</p>
<h1>Get paid in days,<br><span>not months.</span></h1>
<p class="lead">Tallyflow sends beautiful invoices, chases late payers for you and reconciles everything with your accounting software.</p>
<div class="actions"><a class="btn" href="signup.html">Start 14-day free trial</a><a class="btn ghost" href="pricing.html">See pricing</a></div>
<p class="micro">No credit card required · Cancel anytime</p>
<div class="app" aria-label="Product screenshot">
 <div class="app-side"><span class="dot"></span><i></i><i></i><i></i><i></i></div>
 <div class="app-main"><div class="kpis"><div><small>Outstanding</small><strong>$18,240</strong></div><div><small>Paid this month</small><strong>$42,910</strong></div><div><small>Avg. days to pay</small><strong>6.2</strong></div></div>
 <table><tbody>${[["INV-1042","Northwind Co.","$4,200","Paid"],["INV-1041","Brightwire","$1,320","Viewed"],["INV-1040","Harbour & Co.","$860","Overdue"],["INV-1039","Little Bay Café","$2,480","Paid"]].map(([a,b,c,d])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td><td><span class="status s-${d.toLowerCase()}">${d}</span></td></tr>`).join("")}</tbody></table></div></div>
</div></section>
<section class="logos wrap" id="customers" aria-label="Customers"><span>Trusted by 12,000+ businesses</span>${["Northwind","Acme Studio","Little Bay","Peak Physio","Offbeat"].map(l=>`<b>${l}</b>`).join("")}</section>
<section class="section wrap" id="features"><h2>Everything between “sent” and “paid”.</h2><div class="features">${[["⚡","Send in seconds","Templates, saved items and one-click duplicate."],["💳","Pay by card or bank","Clients pay from the invoice. Funds land in 2 days."],["🔔","Polite, automatic chasing","Reminders go out so you don't have to."],["🔄","Syncs with Xero & MYOB","Payments reconcile themselves."],["📊","Cash-flow at a glance","See what's due, overdue and coming in."],["🔒","Bank-grade security","Encrypted, two-factor login, AU data hosting."]].map(([i,t,d])=>`<article><span aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}</div></section>
<section class="section wrap testimonial"><blockquote>“Our average days-to-pay dropped from 31 to 9 in the first quarter. It paid for itself in a week.”</blockquote><p>Hannah Lee · Director, Acme Studio</p></section>
<section class="cta wrap"><h2>Start getting paid faster today.</h2><a class="btn light" href="signup.html">Try Tallyflow free</a></section>`,
    },
    "pricing.html": {
      title: "Pricing",
      body: `
<section class="section wrap center"><h1>Simple pricing that scales with you.</h1><p class="lead">All plans include a 14-day free trial. Prices in AUD, excluding GST.</p>
<div class="billing" role="group" aria-label="Billing period"><button aria-pressed="true" data-period="monthly">Monthly</button><button aria-pressed="false" data-period="annual">Annual <em>save 20%</em></button></div>
<div class="plans">${plans.map(([n,m,a,d,f,pop])=>`<article class="plan${pop?" popular":""}">${pop?'<span class="ribbon">Most popular</span>':""}<h2>${n}</h2><p>${d}</p><p class="amount"><span data-monthly="${m}" data-annual="${a}">$${m}</span><small>/ month</small></p><p class="billed" data-monthly="Billed monthly" data-annual="Billed $${a*12} yearly">Billed monthly</p><a class="btn${pop?"":" ghost"}" href="signup.html?plan=${n.toLowerCase()}">Start free trial</a><ul>${f.map(x=>`<li>${x}</li>`).join("")}</ul></article>`).join("")}</div>
</section>
<section class="section wrap"><h2>Compare plans</h2><div class="table-wrap"><table class="compare"><thead><tr><th>Feature</th>${plans.map(p=>`<th>${p[0]}</th>`).join("")}</tr></thead><tbody>${[["Invoices","Unlimited","Unlimited","Unlimited"],["Clients","3","Unlimited","Unlimited"],["Team members","1","5","Unlimited"],["Recurring invoices","–","✓","✓"],["Accounting sync","–","✓","✓"],["Multi-currency","–","–","✓"],["Support","Email","Email & chat","Priority phone"]].map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th scope="row">${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div></section>
<section class="section wrap narrow"><h2>Pricing questions</h2>${[["Can I change plans later?","Yes, upgrade or downgrade anytime. We pro-rate the difference."],["Are there transaction fees?","Card payments are 1.75% + 30c. Bank transfers are free."],["Do you offer discounts for not-for-profits?","Yes, 50% off any plan. Contact us after signing up."]].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`,
    },
    "docs.html": {
      title: "Documentation",
      body: `
<section class="wrap docs">
<aside class="docs-nav"><label class="sr-only" for="doc-search">Search docs</label><input id="doc-search" type="search" placeholder="Search docs…"><nav aria-label="Docs">${docs.map(([id,t])=>`<a href="#${id}">${t}</a>`).join("")}</nav><p class="none" hidden>No matches.</p></aside>
<div class="docs-body"><h1>Tallyflow docs</h1><p class="lead">Guides and API reference for the Tallyflow REST API (v1).</p>
${docs.map(([id,t,d,code])=>`<article id="${id}" class="doc"><h2>${t}</h2><p>${d}</p><div class="code"><button class="copy" aria-label="Copy code">Copy</button><pre><code>${code.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</code></pre></div><p class="helpful">Was this helpful? <button data-h="yes">👍</button><button data-h="no">👎</button></p></article>`).join("")}
</div></section>`,
    },
    "signup.html": {
      title: "Start your free trial",
      body: `
<section class="auth wrap">
<div class="auth-card"><div class="auth-tabs" role="tablist"><button role="tab" id="t-signup" aria-selected="true">Create account</button><button role="tab" id="t-login" aria-selected="false">Log in</button></div>
<form id="signup" novalidate><h1>Start your 14-day trial</h1><p class="plan-note" id="plan-note"></p>
<label>Full name<input name="name" required autocomplete="name"></label><label>Work email<input name="email" type="email" required autocomplete="email"></label>
<label>Password<input name="password" type="password" required minlength="10" autocomplete="new-password" aria-describedby="strength-text"></label><div class="meter" aria-hidden="true"><i id="meter"></i></div><p id="strength-text" class="hint">At least 10 characters.</p>
<label>Business name<input name="biz" required></label><button class="btn wide">Create account</button><p class="hint">By continuing you agree to the Terms and Privacy Policy.</p></form>
<form id="login" novalidate hidden><h1>Welcome back</h1><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Password<input type="password" name="password" required autocomplete="current-password"></label><button class="btn wide">Log in</button><p class="hint"><a href="#" id="forgot">Forgot your password?</a></p></form>
<div id="welcome" hidden tabindex="-1"><h1>You're in 🎉</h1><p>In a real product, you'd now land in your Tallyflow dashboard with a guided setup checklist.</p><a class="btn" href="index.html">Back to the site</a></div></div>
<aside class="auth-side"><h2>What you get</h2><ul><li>Unlimited invoices during your trial</li><li>Card &amp; bank payments switched on</li><li>Import clients from Xero in one click</li><li>Help from real people in Sydney</li></ul></aside>
</section>`,
    },
  },
  css: `
:root{--bg:#0b0a1a;--ink:#ecebff;--muted:#a19fc4;--violet:#7c5cff;--pink:#ff5ca8;--card:#16142e;--line:#2a2750}
body{background:var(--bg);color:var(--ink);font-family:"Inter","SF Pro Display",system-ui,-apple-system,"Segoe UI",sans-serif}
h1,h2,h3{letter-spacing:-1.2px;line-height:1.08;font-weight:750}h1{font-size:clamp(38px,6vw,76px)}h2{font-size:clamp(28px,3.6vw,46px)}
.wrap{width:min(1180px,calc(100% - 32px));margin:auto}.narrow{max-width:760px}.center{text-align:center}
.site-header{position:sticky;top:0;z-index:10;background:#0b0a1acc;backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.head{display:flex;align-items:center;gap:30px;height:70px;position:relative}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;text-decoration:none}.logo span{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--violet),var(--pink))}
.site-nav{display:flex;gap:26px;margin-left:auto;align-items:center}.site-nav a{text-decoration:none;color:var(--muted)}.site-nav a[aria-current]{color:var(--ink)}.site-nav.open{background:var(--bg)}
.btn{display:inline-block;background:linear-gradient(135deg,var(--violet),#9a63ff);color:#fff;padding:13px 22px;border-radius:12px;text-decoration:none;font-weight:700;border:0;box-shadow:0 10px 30px #7c5cff55}.btn:hover{filter:brightness(1.1)}
.btn.ghost{background:transparent;border:1px solid var(--line);box-shadow:none}.btn.small{padding:9px 16px}.btn.wide{width:100%}.btn.light{background:#fff;color:var(--bg)}
.hero{padding:80px 0 40px;background:radial-gradient(ellipse 60% 50% at 50% 0%,#7c5cff44,transparent),radial-gradient(ellipse 40% 30% at 80% 20%,#ff5ca833,transparent)}.hero-inner{text-align:center;display:grid;justify-items:center}
.hero h1 span{background:linear-gradient(90deg,var(--violet),var(--pink));-webkit-background-clip:text;background-clip:text;color:transparent}
.pill{border:1px solid var(--line);border-radius:99px;padding:6px 14px;font-size:14px;color:var(--muted);margin-bottom:24px}
.lead{font-size:19px;color:var(--muted);max-width:620px;margin:20px auto 0}.actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:30px}.micro{font-size:13px;color:var(--muted);margin-top:14px}
.app{margin-top:60px;width:100%;display:grid;grid-template-columns:70px 1fr;background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;text-align:left;box-shadow:0 40px 100px #7c5cff33}
.app-side{background:#100e24;display:flex;flex-direction:column;align-items:center;gap:18px;padding:22px 0}.app-side .dot{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--violet),var(--pink))}.app-side i{width:26px;height:6px;border-radius:3px;background:var(--line)}
.app-main{padding:26px;overflow-x:auto}.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}.kpis div{background:#1d1a3b;border-radius:12px;padding:16px}.kpis small{color:var(--muted);display:block}.kpis strong{font-size:26px}
.app table{width:100%;border-collapse:collapse;min-width:460px}.app td{padding:12px 8px;border-top:1px solid var(--line);color:var(--muted)}.app td:first-child{color:var(--ink);font-weight:600}
.status{border-radius:99px;padding:3px 10px;font-size:12px;font-weight:700}.s-paid{background:#123d2b;color:#6be3a4}.s-viewed{background:#1e2a4d;color:#8fb2ff}.s-overdue{background:#4a1530;color:#ff8fbf}
.logos{display:flex;gap:40px;align-items:center;justify-content:center;flex-wrap:wrap;padding:40px 0;color:var(--muted)}.logos b{font-size:20px;color:#6f6c99;letter-spacing:-.5px}
.section{padding:80px 0}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px}.features article{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:26px;display:grid;gap:8px}.features span{font-size:26px}.features p{color:var(--muted)}
.testimonial{text-align:center}.testimonial blockquote{font-size:clamp(24px,3vw,36px);font-weight:600;letter-spacing:-.5px;max-width:860px;margin:0 auto 16px}.testimonial p{color:var(--muted)}
.cta{background:linear-gradient(135deg,var(--violet),var(--pink));border-radius:24px;padding:60px;text-align:center;display:grid;gap:24px;justify-items:center;margin-bottom:80px}
.billing{display:inline-flex;background:var(--card);border:1px solid var(--line);border-radius:99px;padding:4px;margin:30px 0}.billing button{border:0;background:none;padding:10px 20px;border-radius:99px;font-weight:700;color:var(--muted)}.billing button[aria-pressed=true]{background:var(--ink);color:var(--bg)}.billing em{font-style:normal;color:#6be3a4;font-size:12px}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:left}.plan{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;display:grid;gap:14px;align-content:start;position:relative}
.plan.popular{border-color:var(--violet);box-shadow:0 20px 60px #7c5cff33}.ribbon{position:absolute;top:-12px;left:30px;background:var(--violet);border-radius:99px;padding:3px 12px;font-size:12px;font-weight:700}
.plan p{color:var(--muted)}.amount{display:flex;align-items:baseline;gap:6px}.amount span{font-size:48px;font-weight:800;color:var(--ink);letter-spacing:-2px}.billed{font-size:13px}
.plan ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}.plan li::before{content:"✓ ";color:#6be3a4;font-weight:800}
.table-wrap{overflow-x:auto;margin-top:24px}.compare{width:100%;border-collapse:collapse;min-width:560px}.compare th,.compare td{padding:14px;border-bottom:1px solid var(--line);text-align:center}.compare th:first-child,.compare tbody th{text-align:left;font-weight:500;color:var(--muted)}.compare thead th{font-size:18px}
details{border-bottom:1px solid var(--line)}summary{padding:18px 0;font-weight:700;cursor:pointer}details p{padding-bottom:18px;color:var(--muted)}
.docs{display:grid;grid-template-columns:240px 1fr;gap:50px;padding:40px 0 80px}.docs-nav{position:sticky;top:90px;align-self:start;display:grid;gap:12px}
.docs-nav input{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px;width:100%}.docs-nav nav{display:grid;gap:2px}.docs-nav nav a{text-decoration:none;color:var(--muted);padding:7px 10px;border-radius:8px}.docs-nav nav a:hover,.docs-nav nav a.active{background:var(--card);color:var(--ink)}.none{color:var(--muted)}
.docs-body,.docs>*,.doc>*{min-width:0}
.doc{padding-top:40px;scroll-margin-top:80px;display:grid;gap:14px}.doc h2{font-size:28px}.doc p{color:var(--muted)}
.code{position:relative;background:#06051a;border:1px solid var(--line);border-radius:12px}.code pre{margin:0;padding:18px;overflow-x:auto;font:14px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:#c9c5ff}
.copy{position:absolute;top:10px;right:10px;background:var(--card);border:1px solid var(--line);border-radius:6px;padding:4px 10px;font-size:12px}
.helpful{font-size:14px}.helpful button{background:none;border:1px solid var(--line);border-radius:6px;margin-left:6px;padding:2px 8px}
.auth{display:grid;grid-template-columns:1fr .8fr;gap:50px;padding:60px 0 80px;align-items:center}.auth-card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:34px;display:grid;gap:20px}
.auth-tabs{display:flex;background:#100e24;border-radius:10px;padding:4px}.auth-tabs button{flex:1;border:0;background:none;padding:10px;border-radius:8px;font-weight:700;color:var(--muted)}.auth-tabs button[aria-selected=true]{background:var(--violet);color:#fff}
.auth form{display:grid;gap:14px}.auth h1{font-size:30px}.auth label{display:grid;gap:6px;font-weight:600;font-size:14px}
.auth input{background:#100e24;border:1px solid var(--line);border-radius:10px;padding:12px}.auth input:focus{outline:2px solid var(--violet)}
.meter{height:6px;background:#100e24;border-radius:3px;overflow:hidden}.meter i{display:block;height:100%;width:0;transition:.3s;background:#ff5c7a}
.hint{font-size:13px;color:var(--muted)}.plan-note{color:#6be3a4;font-weight:700}
.auth-side ul{list-style:none;padding:0;display:grid;gap:14px;margin-top:20px}.auth-side li::before{content:"✓ ";color:#6be3a4;font-weight:800}
.site-footer{border-top:1px solid var(--line);padding:50px 0 20px;color:var(--muted)}.foot{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px}.foot div{display:grid;gap:8px;align-content:start}.foot strong{color:var(--ink)}.foot a{text-decoration:none}.fine{font-size:12px;margin-top:30px}
@media(max-width:900px){.features,.plans{grid-template-columns:1fr}.docs,.auth{grid-template-columns:1fr}.docs-nav{position:static}.foot{grid-template-columns:1fr}.kpis{grid-template-columns:1fr}.cta{padding:40px 20px}}
@media(max-width:760px){.hide-sm{display:none}.app{grid-template-columns:1fr}.app-side{display:none}.section{padding:56px 0}}
`,
  js: `
(function(){
var C=concept;
// Billing toggle
var bill=document.querySelector(".billing");
if(bill)bill.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var p=b.dataset.period;bill.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
 document.querySelectorAll(".amount span").forEach(function(s){s.textContent="$"+s.dataset[p];});document.querySelectorAll(".billed").forEach(function(s){s.textContent=s.dataset[p];});});
// Docs search, copy, scrollspy
var search=document.getElementById("doc-search");
if(search){var links=document.querySelectorAll(".docs-nav nav a");search.addEventListener("input",function(){var q=search.value.toLowerCase();var n=0;
 document.querySelectorAll(".doc").forEach(function(d){var m=d.textContent.toLowerCase().indexOf(q)>=0;d.hidden=!m;var l=document.querySelector('.docs-nav a[href="#'+d.id+'"]');l.hidden=!m;if(m)n++;});document.querySelector(".none").hidden=n>0;});
 document.querySelectorAll(".copy").forEach(function(b){b.addEventListener("click",function(){var t=b.nextElementSibling.textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent="Copied";},function(){b.textContent="Select & copy";});setTimeout(function(){b.textContent="Copy";},1800);});});
 document.querySelectorAll("[data-h]").forEach(function(b){b.addEventListener("click",function(){b.parentElement.textContent=b.dataset.h==="yes"?"Thanks for the feedback!":"Thanks. We'll improve this page.";});});
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle("active",l.getAttribute("href")==="#"+e.target.id);});}});},{rootMargin:"-30% 0px -60% 0px"});document.querySelectorAll(".doc").forEach(function(d){io.observe(d);});}
// Sign up / log in
var su=document.getElementById("signup");
if(su){var li=document.getElementById("login"),ts=document.getElementById("t-signup"),tl=document.getElementById("t-login");
 function mode(m){var s=m!=="login";su.hidden=!s;li.hidden=s;ts.setAttribute("aria-selected",s);tl.setAttribute("aria-selected",!s);}
 ts.addEventListener("click",function(){mode("signup");});tl.addEventListener("click",function(){mode("login");});mode(C.param("mode"));
 var plan=C.param("plan");if(plan)document.getElementById("plan-note").textContent="Selected plan: "+plan.charAt(0).toUpperCase()+plan.slice(1)+" · free for 14 days";
 su.password.addEventListener("input",function(){var v=su.password.value,s=0;if(v.length>=10)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v)||v.length>=16)s++;
  var m=document.getElementById("meter");m.style.width=(s*25)+"%";m.style.background=["#ff5c7a","#ff5c7a","#ffb84d","#9be36b","#6be3a4"][s];document.getElementById("strength-text").textContent=["At least 10 characters.","Weak","Okay","Good","Strong"][s];});
 function done(){su.hidden=li.hidden=true;document.querySelector(".auth-tabs").hidden=true;var w=document.getElementById("welcome");w.hidden=false;w.focus();}
 su.addEventListener("submit",function(e){e.preventDefault();if(C.validate(su))done();});li.addEventListener("submit",function(e){e.preventDefault();if(C.validate(li))done();});
 document.getElementById("forgot").addEventListener("click",function(e){e.preventDefault();C.toast("We'd email you a reset link (demo).");});}
})();
`,
};
