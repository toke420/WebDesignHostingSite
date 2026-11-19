import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Home"],
  ["services.html", "Services"],
  ["team.html", "Our team"],
  ["contact.html", "Contact"],
];

const services = [
  ["Tax returns", "Individual, sole trader and investment property returns, lodged accurately and on time.", "From $220"],
  ["Business advisory", "Cash-flow forecasting, budgeting and quarterly check-ins with a dedicated adviser.", "From $450 / qtr"],
  ["Bookkeeping & BAS", "Xero and MYOB bookkeeping, payroll and BAS lodgement handled every month.", "From $290 / mth"],
  ["Self-managed super", "SMSF setup, annual compliance, audit coordination and investment reporting.", "From $1,600 / yr"],
  ["Business structuring", "Company, trust and partnership set-up to protect assets and plan for growth.", "Quoted"],
  ["Start-up packages", "ABN, GST, business plan and first-year accounts for new ventures.", "From $990"],
];

const team = [
  ["Margaret Liu", "Managing Partner, CA", "Twenty years advising family businesses on growth, succession and tax planning.", "ML", "#1d3557"],
  ["Daniel Okafor", "Partner, CPA", "Leads our SMSF and investment practice. Former Big Four audit manager.", "DO", "#2a6f6b"],
  ["Priya Raman", "Senior Accountant", "Hospitality and retail specialist who loves turning numbers into plans.", "PR", "#a0672b"],
  ["Tom Becker", "Bookkeeping Lead", "Certified Xero advisor keeping 80+ clients' books up to date each month.", "TB", "#5b4b8a"],
];

export default {
  id: "business",
  name: "Harbour & Co. Accountants",
  tagline: "Accounting and advisory for growing Australian businesses.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html"><span>H</span>Harbour &amp; Co.</a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}<a class="btn small" href="contact.html">Book a meeting</a></nav>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<div><a class="logo" href="index.html"><span>H</span>Harbour &amp; Co.</a><p>Level 4, 120 Collins Street, Melbourne VIC 3000<br>(03) 9000 1234 · hello@harbourco.example</p></div>
<nav aria-label="Footer">${navLinks(nav, "")}</nav>
<p class="fine">CA ANZ and CPA Australia members. Liability limited by a scheme approved under Professional Standards Legislation. Sample business.</p>
</div></footer>`,
  pages: {
    "index.html": {
      title: "Accountants & business advisers",
      body: `
<section class="hero"><div class="wrap hero-grid">
  <div>
    <p class="kicker">Melbourne accountants since 2004</p>
    <h1>Clear numbers. Confident decisions.</h1>
    <p class="lead">Tax, bookkeeping and advisory for family businesses, professionals and investors, with one adviser who knows your story.</p>
    <div class="actions"><a class="btn" href="contact.html">Book a free 20-minute call</a><a class="link" href="services.html">See our services →</a></div>
  </div>
  <figure class="hero-card" aria-label="Example client dashboard">
    <div class="hc-top"><strong>Quarterly snapshot</strong><span>Q2 FY26</span></div>
    <div class="hc-stat"><span>Revenue</span><strong>$412,800</strong><em>▲ 14%</em></div>
    <div class="bars" aria-hidden="true"><i style="height:40%"></i><i style="height:55%"></i><i style="height:48%"></i><i style="height:70%"></i><i style="height:66%"></i><i style="height:84%"></i></div>
    <p>Cash runway: <strong>7.5 months</strong></p>
  </figure>
</div></section>
<section class="stats wrap" aria-label="Firm at a glance">
  <div><strong>650+</strong><span>clients across Victoria</span></div>
  <div><strong>20 yrs</strong><span>in practice</span></div>
  <div><strong>98%</strong><span>returns lodged early</span></div>
  <div><strong>4.9★</strong><span>from 210 Google reviews</span></div>
</section>
<section class="section wrap">
  <div class="section-head"><h2>How we help</h2><a class="link" href="services.html">All services →</a></div>
  <div class="cards">${services.slice(0, 3).map(([t, d]) => `<article class="card"><h3>${t}</h3><p>${d}</p><a class="link" href="services.html">Learn more →</a></article>`).join("")}</div>
</section>
<section class="section band"><div class="wrap split">
  <div><h2>One adviser. Every question.</h2><p>No call centres or rotating juniors. You get a named adviser who answers emails within one business day and meets with you each quarter.</p>
  <ul class="ticks"><li>Fixed monthly fees, agreed up front</li><li>Secure document portal and e-signing</li><li>Year-round tax planning, not just at June</li></ul>
  <a class="btn" href="team.html">Meet the team</a></div>
  <blockquote><p>“Harbour took our café from shoebox receipts to a clear monthly picture. We finally know which days actually make money.”</p><cite>Sofia Marino, Little Bay Café</cite></blockquote>
</div></section>
<section class="section wrap cta"><h2>Ready for a clearer picture?</h2><p>Book a free 20-minute call. We'll look at where you are and suggest the next step.</p><a class="btn" href="contact.html">Book a meeting</a></section>`,
    },
    "services.html": {
      title: "Services & fees",
      body: `
<section class="page-hero"><div class="wrap"><p class="kicker">Services &amp; fees</p><h1>Everything your business needs from an accountant.</h1><p class="lead">Transparent starting fees. Your fixed quote is confirmed after a short discovery call.</p></div></section>
<section class="section wrap"><div class="cards">${services.map(([t, d, p]) => `<article class="card"><h3>${t}</h3><p>${d}</p><p class="price">${p}</p></article>`).join("")}</div></section>
<section class="section wrap narrow"><h2>Fee comparison</h2>
<div class="table-wrap"><table><caption class="sr-only">Monthly packages</caption><thead><tr><th>Included</th><th>Essentials</th><th>Growth</th><th>Partner</th></tr></thead><tbody>
<tr><td>Annual tax return &amp; financials</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>Quarterly BAS</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td>Monthly bookkeeping</td><td>–</td><td>✓</td><td>✓</td></tr>
<tr><td>Quarterly advisory meeting</td><td>–</td><td>✓</td><td>✓</td></tr>
<tr><td>Cash-flow forecast &amp; budget</td><td>–</td><td>–</td><td>✓</td></tr>
<tr class="total"><td>Monthly fee</td><td>$180</td><td>$420</td><td>$790</td></tr>
</tbody></table></div></section>
<section class="section wrap narrow"><h2>Common questions</h2>
<div class="accordion">
<details><summary>Can you take over from my current accountant?</summary><p>Yes. With your permission we request your files directly and handle the hand-over, usually within two weeks.</p></details>
<details><summary>Do you work with clients outside Melbourne?</summary><p>About a third of our clients are interstate. Meetings happen by video and documents are shared through our secure portal.</p></details>
<details><summary>Which software do you support?</summary><p>Xero, MYOB and QuickBooks Online. We can help you move from spreadsheets or desktop software.</p></details>
<details><summary>How are your fees charged?</summary><p>Monthly packages are billed by direct debit. One-off work is quoted upfront, so there are no surprise bills.</p></details>
</div></section>
<section class="section wrap cta"><h2>Not sure what you need?</h2><p>Tell us about your business and we'll recommend a package.</p><a class="btn" href="contact.html">Get a recommendation</a></section>`,
    },
    "team.html": {
      title: "Our team",
      body: `
<section class="page-hero"><div class="wrap"><p class="kicker">Our team</p><h1>Experienced people who pick up the phone.</h1><p class="lead">Chartered and CPA-qualified advisers, plus a bookkeeping team that knows your industry.</p></div></section>
<section class="section wrap"><div class="team">${team.map(([n, r, b, i, c]) => `<article class="person"><div class="avatar" style="background:${c}" aria-hidden="true">${i}</div><h3>${n}</h3><p class="role">${r}</p><p>${b}</p><a class="link" href="contact.html?adviser=${encodeURIComponent(n)}">Book with ${n.split(" ")[0]} →</a></article>`).join("")}</div></section>
<section class="section band"><div class="wrap split"><div><h2>Our values</h2><p>We explain things plainly, give straight answers and treat your business like our own.</p></div>
<ul class="values"><li><strong>Plain English</strong>No jargon, ever.</li><li><strong>Proactive</strong>We call you before deadlines, not after.</li><li><strong>Local</strong>Owned and run in Melbourne.</li></ul></div></section>`,
    },
    "contact.html": {
      title: "Contact us",
      body: `
<section class="page-hero"><div class="wrap"><p class="kicker">Contact</p><h1>Let's talk about your numbers.</h1><p class="lead">Send a message and we'll reply within one business day to arrange a time.</p></div></section>
<section class="section wrap contact-grid">
<form id="contact-form" class="form" novalidate>
  <div class="row"><label>Your name<input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
  <div class="row"><label>Phone<input name="phone" type="tel" autocomplete="tel"></label><label>Business type<select name="type"><option>Sole trader</option><option>Company</option><option>Trust</option><option>Individual / investor</option><option>Not sure</option></select></label></div>
  <label>Preferred adviser<select name="adviser" id="adviser"><option>No preference</option>${team.map(([n]) => `<option>${n}</option>`).join("")}</select></label>
  <label>How can we help?<textarea name="message" rows="5" required minlength="10"></textarea></label>
  <button class="btn" type="submit">Send message</button>
  <p class="form-note">This is a design concept. Messages are not sent anywhere.</p>
</form>
<div id="contact-done" class="done" hidden tabindex="-1"><h2>Thanks, <span id="done-name"></span>.</h2><p>Your message is with our team. In a real site, it would arrive in our inbox and you'd receive a confirmation email.</p><a class="btn" href="index.html">Back to home</a></div>
<aside class="office">
  <div class="map" role="img" aria-label="Map showing our Collins Street office"><span class="pin"></span></div>
  <h3>Visit us</h3><p>Level 4, 120 Collins Street<br>Melbourne VIC 3000</p>
  <h3>Opening hours</h3><dl class="hours"><dt>Mon–Thu</dt><dd>8:30am – 5:30pm</dd><dt>Friday</dt><dd>8:30am – 4:00pm</dd><dt>Weekends</dt><dd>By appointment</dd></dl>
  <p id="open-now" class="open-now"></p>
</aside>
</section>`,
    },
  },
  css: `
:root{--navy:#14213d;--cream:#f7f3ea;--gold:#c79a3b;--ink:#1f2430;--muted:#5d6472}
body{background:var(--cream);color:var(--ink);font-family:"Segoe UI",system-ui,-apple-system,sans-serif}
h1,h2,h3{font-family:Georgia,"Times New Roman",serif;font-weight:500;color:var(--navy);line-height:1.15}
h1{font-size:clamp(34px,5vw,58px);letter-spacing:-.5px}h2{font-size:clamp(26px,3vw,36px)}h3{font-size:21px}
.wrap{width:min(1160px,calc(100% - 32px));margin:auto}.narrow{max-width:860px}
.site-header{background:#fff;border-bottom:1px solid #e6e0d2;position:sticky;top:0;z-index:10}
.head{display:flex;align-items:center;justify-content:space-between;height:76px;position:relative}
.logo{display:flex;align-items:center;gap:10px;font:600 20px Georgia,serif;color:var(--navy);text-decoration:none}
.logo span{width:36px;height:36px;border-radius:50%;background:var(--navy);color:var(--gold);display:grid;place-items:center;font-size:18px}
.site-nav{display:flex;align-items:center;gap:26px;font-size:15px}.site-nav a{text-decoration:none;color:var(--muted)}
.site-nav a[aria-current]{color:var(--navy);font-weight:600;box-shadow:inset 0 -2px var(--gold)}
.site-nav.open{background:#fff;border-bottom:1px solid #e6e0d2}
.btn{display:inline-block;background:var(--navy);color:#fff!important;padding:13px 22px;border-radius:4px;text-decoration:none;font-weight:600;border:0}
.btn:hover{background:#22355f}.btn.small{padding:9px 16px;font-size:14px}
.link{color:var(--navy);font-weight:600;text-decoration:none}.link:hover{text-decoration:underline}
.kicker{text-transform:uppercase;letter-spacing:2px;font-size:12px;color:var(--gold);font-weight:700;margin-bottom:14px}
.lead{font-size:19px;color:var(--muted);margin-top:18px;max-width:600px}
.hero{padding:80px 0 60px}.hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:60px;align-items:center}
.actions{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:30px}
.hero-card{margin:0;background:#fff;border-radius:12px;padding:26px;box-shadow:0 30px 60px #14213d1f;border-top:4px solid var(--gold)}
.hc-top{display:flex;justify-content:space-between;font-size:14px;color:var(--muted)}
.hc-stat{margin:18px 0}.hc-stat span{display:block;font-size:13px;color:var(--muted)}.hc-stat strong{font:500 34px Georgia,serif;color:var(--navy)}.hc-stat em{color:#2a8a55;font-style:normal;margin-left:8px;font-weight:700}
.bars{display:flex;align-items:flex-end;gap:10px;height:120px;margin-bottom:16px}.bars i{flex:1;background:linear-gradient(var(--gold),#e8cf8f);border-radius:4px 4px 0 0}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:30px 0;border-top:1px solid #e1dac9;border-bottom:1px solid #e1dac9}
.stats strong{display:block;font:500 34px Georgia,serif;color:var(--navy)}.stats span{color:var(--muted);font-size:14px}
.section{padding:80px 0}.section-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.card{background:#fff;padding:28px;border-radius:8px;border:1px solid #e6e0d2;display:grid;gap:12px;align-content:start}
.card p{color:var(--muted)}.price{font-weight:700;color:var(--navy)!important}
.band{background:var(--navy);color:#dfe4ee}.band h2{color:#fff}.band p{color:#c7cede}
.split{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.ticks{padding:0;list-style:none;margin:20px 0 26px}.ticks li{padding-left:28px;position:relative;margin:8px 0}.ticks li::before{content:"✓";position:absolute;left:0;color:var(--gold);font-weight:700}
.band .btn{background:var(--gold);color:var(--navy)!important}
blockquote{margin:0;border-left:3px solid var(--gold);padding-left:28px}blockquote p{font:italic 24px/1.45 Georgia,serif;color:#fff!important}cite{display:block;margin-top:16px;color:var(--gold);font-style:normal}
.cta{text-align:center;display:grid;justify-items:center;gap:14px}
.page-hero{padding:70px 0 40px;border-bottom:1px solid #e1dac9}
.table-wrap{overflow-x:auto;margin-top:20px}table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;min-width:560px}
th,td{padding:14px 16px;text-align:left;border-bottom:1px solid #eee7d7}th{background:var(--navy);color:#fff;font-weight:600}td:not(:first-child),th:not(:first-child){text-align:center}
.total td{font-weight:700;color:var(--navy);background:#fbf8f1}
.accordion{margin-top:20px}details{background:#fff;border:1px solid #e6e0d2;border-radius:6px;margin-bottom:10px}
summary{padding:18px 20px;cursor:pointer;font-weight:600;color:var(--navy)}details p{padding:0 20px 18px;color:var(--muted)}
.team{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.person{background:#fff;border-radius:8px;padding:26px;border:1px solid #e6e0d2;display:grid;gap:8px;align-content:start}
.avatar{width:84px;height:84px;border-radius:50%;display:grid;place-items:center;color:#fff;font:500 28px Georgia,serif;margin-bottom:8px}
.role{color:var(--gold)!important;font-weight:700;font-size:14px}.person p{color:var(--muted)}
.values{list-style:none;padding:0;display:grid;gap:14px}.values li{background:#ffffff12;padding:18px;border-radius:6px}.values strong{display:block;color:#fff}
.contact-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:50px;align-items:start}
.form{display:grid;gap:16px;background:#fff;padding:30px;border-radius:8px;border:1px solid #e6e0d2}
.form label{display:grid;gap:6px;font-weight:600;font-size:14px;color:var(--navy)}.row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
input,select,textarea{border:1px solid #cfc7b4;border-radius:4px;padding:11px 12px;background:#fff;font-weight:400}
input:focus,select:focus,textarea:focus{outline:2px solid var(--gold);border-color:var(--gold)}[aria-invalid=true]{border-color:#c0392b}
.done{background:#fff;padding:40px;border-radius:8px;border:1px solid #e6e0d2;display:grid;gap:14px;justify-items:start}
.office{display:grid;gap:10px}.office h3{font-size:18px;margin-top:10px}
.map{height:200px;border-radius:8px;background:linear-gradient(90deg,#e9e3d4 1px,transparent 1px) 0 0/28px 28px,linear-gradient(#e9e3d4 1px,transparent 1px) 0 0/28px 28px,#f2ede1;position:relative;border:1px solid #e1dac9}
.map::before{content:"";position:absolute;left:0;right:0;top:55%;height:14px;background:#fff;transform:rotate(-8deg)}
.pin{position:absolute;left:50%;top:40%;width:22px;height:22px;border-radius:50% 50% 50% 0;background:var(--navy);transform:rotate(-45deg);box-shadow:0 0 0 6px #14213d22}
.hours{display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:0}dd{margin:0;color:var(--muted)}
.open-now{font-weight:700}.open-now.is-open{color:#2a8a55}.open-now.is-closed{color:#a0672b}
.site-footer{background:#0f192f;color:#aeb6c7;padding:50px 0;margin-top:40px}.foot{display:grid;grid-template-columns:1.2fr 1fr;gap:30px}
.site-footer .logo{color:#fff}.site-footer nav{display:flex;gap:20px;flex-wrap:wrap;justify-content:flex-end}.site-footer a{text-decoration:none}
.fine{grid-column:1/-1;font-size:12px;border-top:1px solid #ffffff1a;padding-top:20px}
@media (max-width:900px){.hero-grid,.split,.contact-grid{grid-template-columns:1fr}.cards{grid-template-columns:1fr 1fr}.team{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}}
@media (max-width:760px){.site-nav .btn{margin-top:8px;text-align:center}.cards,.team,.row,.foot{grid-template-columns:1fr}.site-footer nav{justify-content:flex-start}.hero{padding:50px 0}.section{padding:56px 0}}
`,
  js: `
(function(){
  var form=document.getElementById("contact-form");
  if(form){
    var adviser=concept.param("adviser");var sel=document.getElementById("adviser");
    if(adviser&&sel){Array.prototype.forEach.call(sel.options,function(o){if(o.text===adviser)sel.value=adviser;});}
    form.addEventListener("submit",function(e){e.preventDefault();if(!concept.validate(form))return;
      document.getElementById("done-name").textContent=form.name.value.split(" ")[0];
      form.hidden=true;var done=document.getElementById("contact-done");done.hidden=false;done.focus();});
  }
  var open=document.getElementById("open-now");
  if(open){var now=new Date(new Date().toLocaleString("en-US",{timeZone:"Australia/Melbourne"}));var d=now.getDay(),h=now.getHours()+now.getMinutes()/60;
    var isOpen=(d>=1&&d<=4&&h>=8.5&&h<17.5)||(d===5&&h>=8.5&&h<16);
    open.textContent=isOpen?"● Open now":"● Closed now. Leave a message and we'll call you back.";open.className="open-now "+(isOpen?"is-open":"is-closed");}
})();
`,
};
