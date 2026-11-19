import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Home"],
  ["services.html", "Services"],
  ["areas.html", "Service areas"],
  ["quote.html", "Get a quote"],
];

const services = [
  ["⚡", "Emergency call-outs", "24/7 response for power loss, sparking outlets and storm damage.", "From $149 call-out"],
  ["💡", "Lighting", "LED upgrades, downlights, garden and feature lighting.", "From $89 per light"],
  ["🔌", "Power points & switchboards", "Extra outlets, safety switches and switchboard upgrades.", "From $129"],
  ["☀️", "Solar & batteries", "Solar inverter servicing, battery installs and EV chargers.", "Quoted on site"],
  ["🏠", "Renovations & new builds", "Full rewires and fit-offs, coordinated with your builder.", "Quoted"],
  ["🧯", "Safety inspections", "Smoke alarms, rental compliance checks and certificates.", "From $199"],
];

export default {
  id: "trades",
  name: "Brightwire Electrical",
  tagline: "Licensed electricians across Melbourne's east. 24/7 emergency call-outs.",
  header: (file) => `<div class="emergency"><div class="wrap"><span>⚡ 24/7 emergency electrician</span><a href="tel:0400000000">Call 0400 000 000</a></div></div>
<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html"><span aria-hidden="true">B</span>Brightwire<small>Electrical</small></a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
<a class="btn hide-sm" href="quote.html">Free quote</a>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<div><p class="logo"><span aria-hidden="true">B</span>Brightwire<small>Electrical</small></p><p>REC 12345 · ABN 00 000 000 000<br>Fully insured · Master Electricians member</p></div>
<div><strong>Contact</strong><p><a href="tel:0400000000">0400 000 000</a><br>jobs@brightwire.example<br>Mon–Fri 7am–5pm, emergencies 24/7</p></div>
<div><strong>Pages</strong>${navLinks(nav, "")}</div>
</div><p class="wrap fine">Design concept for a sample business. Licence numbers are placeholders.</p></footer>`,
  pages: {
    "index.html": {
      title: "Electricians in Melbourne's east",
      body: `
<section class="hero"><div class="wrap hero-grid">
<div><p class="badge">★ 4.9 from 380+ Google reviews</p><h1>Sparkies who turn up on time.</h1><p class="lead">Licensed electricians for homes and small businesses across Melbourne's east. Upfront prices, tidy work and a lifetime workmanship guarantee.</p>
<div class="actions"><a class="btn" href="quote.html">Get a free quote</a><a class="btn outline" href="tel:0400000000">📞 0400 000 000</a></div>
<ul class="trust"><li>✓ Same-day service</li><li>✓ Fixed-price quotes</li><li>✓ Seniors' discount</li></ul></div>
<div class="hero-panel"><h2>Need help now?</h2><p>Average arrival time today:</p><p class="eta"><strong id="eta">47</strong> min</p><a class="btn wide" href="tel:0400000000">Call for emergency help</a><p class="small">Or <a href="quote.html?type=Emergency">request an urgent call-back</a></p></div>
</div></section>
<section class="section wrap"><div class="head-row"><h2>What we do</h2><a href="services.html">All services →</a></div>
<div class="grid3">${services.slice(0,3).map(([i,t,d,p])=>`<article class="svc"><span class="ico" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p><p class="from">${p}</p></article>`).join("")}</div></section>
<section class="section steps-band"><div class="wrap"><h2>How it works</h2><ol class="steps"><li><strong>Tell us the job</strong>Online in 2 minutes or by phone.</li><li><strong>Get a fixed price</strong>No surprises, no hourly creep.</li><li><strong>We get it done</strong>Clean, tested and certified.</li></ol></div></section>
<section class="section wrap"><h2>What locals say</h2><div class="reviews">${[["Fixed our switchboard the same afternoon. Clear price, explained everything.","Karen, Box Hill"],["Rewired a 1960s house without fuss. Site was spotless every day.","Mitch, Ringwood"],["Came out at 11pm in a storm. Absolute legends.","Ana, Doncaster"]].map(([q,a])=>`<figure><div class="stars">★★★★★</div><blockquote>${q}</blockquote><figcaption>${a}</figcaption></figure>`).join("")}</div></section>
<section class="cta-band"><div class="wrap"><h2>Is your suburb covered?</h2><a class="btn" href="areas.html">Check your area</a></div></section>`,
    },
    "services.html": {
      title: "Electrical services & prices",
      body: `
<section class="page-head"><div class="wrap"><h1>Services &amp; prices</h1><p class="lead">Upfront starting prices. Your fixed quote is confirmed before any work begins.</p></div></section>
<section class="section wrap"><div class="grid3">${services.map(([i,t,d,p])=>`<article class="svc"><span class="ico" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p><p class="from">${p}</p><a class="btn small" href="quote.html?type=${encodeURIComponent(t)}">Quote this job</a></article>`).join("")}</div></section>
<section class="section wrap guarantee"><h2>The Brightwire guarantee</h2><div class="grid3"><div><strong>On time, or $50 off</strong><p>We text when we're on the way. If we're late, you save.</p></div><div><strong>Lifetime workmanship</strong><p>If our work fails, we fix it free. Forever.</p></div><div><strong>Clean-site promise</strong><p>Boot covers, drop sheets and a tidy-up before we leave.</p></div></div></section>`,
    },
    "areas.html": {
      title: "Service areas",
      body: `
<section class="page-head"><div class="wrap"><h1>Service areas</h1><p class="lead">We cover 60+ suburbs across Melbourne's east and the Yarra Valley.</p></div></section>
<section class="section wrap areas">
<div class="checker"><label for="suburb"><strong>Check your suburb</strong></label><div class="check-row"><input id="suburb" list="suburbs" placeholder="Start typing, e.g. Ringwood" autocomplete="off"><button class="btn" id="check">Check</button></div>
<datalist id="suburbs"></datalist><p id="result" class="result" aria-live="polite"></p></div>
<div class="zones"><h2>Zones &amp; call-out fees</h2><div id="zone-list"></div></div>
</section>`,
    },
    "quote.html": {
      title: "Get a free quote",
      body: `
<section class="page-head"><div class="wrap"><h1>Get a free quote</h1><p class="lead">Takes about 2 minutes. We reply within 2 business hours.</p></div></section>
<section class="section wrap quote-wrap">
<ol class="progress" aria-label="Progress"><li class="active">Job</li><li>Details</li><li>Contact</li><li>Review</li></ol>
<form id="quote" novalidate>
 <fieldset data-step="0"><legend>What do you need?</legend><div class="choices">${services.map(([i,t])=>`<label class="choice"><input type="radio" name="type" value="${t}" required><span><b aria-hidden="true">${i}</b>${t}</span></label>`).join("")}<label class="choice"><input type="radio" name="type" value="Emergency"><span><b aria-hidden="true">🚨</b>Emergency</span></label></div></fieldset>
 <fieldset data-step="1" hidden><legend>Tell us about the job</legend>
  <label>Property type<select name="property"><option>House</option><option>Apartment / unit</option><option>Business</option><option>Rental property</option></select></label>
  <label>When do you need it?<select name="when"><option>As soon as possible</option><option>This week</option><option>In the next month</option><option>Just planning</option></select></label>
  <label>Describe the job<textarea name="details" rows="4" required minlength="10" placeholder="e.g. 6 new LED downlights in the living room"></textarea></label></fieldset>
 <fieldset data-step="2" hidden><legend>Your details</legend>
  <label>Name<input name="name" required autocomplete="name"></label><label>Mobile<input name="phone" type="tel" required autocomplete="tel"></label>
  <label>Suburb<input name="suburb" required list="suburbs"></label><datalist id="suburbs"></datalist>
  <label class="inline"><input type="checkbox" name="sms" checked> Text me when the electrician is on the way</label></fieldset>
 <fieldset data-step="3" hidden><legend>Check and send</legend><dl id="review" class="review"></dl></fieldset>
 <div class="nav-buttons"><button type="button" class="btn outline" id="back" hidden>Back</button><button type="button" class="btn" id="next">Next</button></div>
</form>
<div id="sent" class="sent" hidden tabindex="-1"><h2>Quote request sent ✓</h2><p>Reference <strong id="qref"></strong>. In a real site, a Brightwire electrician would text you within 2 business hours.</p><a class="btn" href="index.html">Back to home</a></div>
</section>`,
    },
  },
  css: `
:root{--blue:#1747c9;--navy:#0d1b3d;--yellow:#ffd23f;--ink:#121827;--muted:#55607a;--bg:#f4f6fb}
body{background:#fff;color:var(--ink);font-family:"Arial Black","Helvetica Neue",Arial,sans-serif;font-weight:400}
body,p,label,input,select,textarea,li{font-family:"Helvetica Neue",Arial,sans-serif}
h1,h2,h3{font-family:"Arial Black","Helvetica Neue",Arial,sans-serif;font-weight:900;letter-spacing:-.5px;line-height:1.05}
h1{font-size:clamp(38px,6vw,68px)}h2{font-size:clamp(26px,3.4vw,40px)}
.wrap{width:min(1180px,calc(100% - 32px));margin:auto}
.emergency{background:var(--yellow);font-size:14px;font-weight:700}.emergency .wrap{display:flex;justify-content:space-between;gap:10px;padding:8px 0}.emergency a{font-weight:900}
.site-header{background:var(--navy);color:#fff;position:sticky;top:0;z-index:10}.head{display:flex;align-items:center;gap:30px;height:74px;position:relative}
.logo{display:flex;align-items:center;gap:10px;font:900 22px "Arial Black",Arial,sans-serif;text-decoration:none;color:inherit}.logo span{width:38px;height:38px;background:var(--yellow);color:var(--navy);display:grid;place-items:center;border-radius:8px;transform:skew(-8deg)}
.logo small{font:600 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:var(--yellow);align-self:flex-end;margin-bottom:6px}
.site-nav{display:flex;gap:26px;margin-left:auto}.site-nav a{text-decoration:none;color:#c8d2ec;font-weight:700}.site-nav a[aria-current]{color:var(--yellow)}
.site-nav.open{background:var(--navy)}
.btn{display:inline-block;background:var(--yellow);color:var(--navy);padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:900;border:2px solid var(--yellow);font-family:"Arial Black",Arial,sans-serif}
.btn:hover{background:#ffdf6e}.btn.outline{background:transparent;color:inherit;border-color:currentColor}.btn.small{padding:8px 14px;font-size:14px}.btn.wide{display:block;text-align:center}
.hero{background:linear-gradient(135deg,var(--navy) 0%,var(--blue) 100%);color:#fff;padding:70px 0 80px;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-120px;top:-60px;width:420px;height:520px;background:var(--yellow);opacity:.08;transform:skew(-20deg)}
.hero-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:50px;align-items:center;position:relative;z-index:1}
.badge{display:inline-block;background:#ffffff1a;border-radius:99px;padding:6px 14px;font-weight:700;margin-bottom:20px}
.lead{font-size:19px;margin-top:18px;max-width:580px;opacity:.9}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}
.trust{list-style:none;padding:0;display:flex;gap:20px;flex-wrap:wrap;margin-top:26px;font-weight:700}
.hero-panel{background:#fff;color:var(--ink);border-radius:16px;padding:28px;box-shadow:0 30px 60px #0005}.hero-panel h2{font-size:26px}.eta{font-size:18px;margin:6px 0 18px}.eta strong{font:900 56px "Arial Black",Arial;color:var(--blue)}.small{font-size:14px;margin-top:12px;color:var(--muted)}
.section{padding:80px 0}.head-row{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px}.head-row a{font-weight:700;color:var(--blue)}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.svc{background:var(--bg);border-radius:14px;padding:28px;display:grid;gap:10px;align-content:start;border:2px solid transparent;transition:border-color .2s}.svc:hover{border-color:var(--blue)}
.ico{font-size:32px}.svc p{color:var(--muted)}.from{font-weight:800;color:var(--blue)!important}.svc .btn{justify-self:start}
.steps-band{background:var(--bg)}.steps{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:30px;counter-reset:s}
.steps li{background:#fff;border-radius:14px;padding:28px 28px 28px 84px;position:relative;counter-increment:s;color:var(--muted)}.steps li::before{content:counter(s);position:absolute;left:24px;top:24px;width:42px;height:42px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font:900 20px Arial}
.steps strong{display:block;color:var(--ink);font-size:19px;margin-bottom:4px}
.reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:30px}.reviews figure{margin:0;border:2px solid var(--bg);border-radius:14px;padding:26px}.stars{color:#f5a700;font-size:20px}blockquote{margin:12px 0;font-size:18px}figcaption{color:var(--muted);font-weight:700}
.cta-band{background:var(--yellow);padding:50px 0}.cta-band .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.cta-band .btn{background:var(--navy);color:#fff;border-color:var(--navy)}
.page-head{background:var(--navy);color:#fff;padding:60px 0}
.guarantee{border-top:2px solid var(--bg)}.guarantee .grid3>div{padding:20px;border-left:4px solid var(--yellow)}.guarantee strong{font-size:19px}.guarantee p{color:var(--muted)}.guarantee h2{margin-bottom:24px}
.areas{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
.checker{background:var(--bg);padding:30px;border-radius:16px;display:grid;gap:12px;position:sticky;top:100px}.check-row{display:flex;gap:10px}
input,select,textarea{border:2px solid #d5dbea;border-radius:8px;padding:12px;background:#fff;font-size:16px;width:100%}input:focus,select:focus,textarea:focus{outline:0;border-color:var(--blue)}
.result{font-weight:700;font-size:18px;min-height:28px}.result.yes{color:#137a3a}.result.no{color:#b3261e}
.zone{border-bottom:2px solid var(--bg);padding:18px 0}.zone h3{font-size:19px;display:flex;justify-content:space-between}.zone h3 span{color:var(--blue)}.zone p{color:var(--muted);font-size:15px;margin-top:6px}
.quote-wrap{max-width:760px}.progress{list-style:none;padding:0;display:flex;gap:8px;margin:0 0 30px;counter-reset:p}
.progress li{flex:1;counter-increment:p;padding-top:12px;border-top:5px solid var(--bg);font-weight:700;color:var(--muted);font-size:14px}.progress li::before{content:counter(p) ". "}.progress li.active,.progress li.done{border-color:var(--blue);color:var(--ink)}
#quote fieldset{border:0;padding:0;margin:0;display:grid;gap:16px}#quote legend{font:900 26px "Arial Black",Arial;margin-bottom:16px}#quote label{display:grid;gap:6px;font-weight:700}
.choices{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.choice{cursor:pointer;position:relative}.choice input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0}
.choice span{display:flex;align-items:center;gap:10px;border:2px solid #d5dbea;border-radius:10px;padding:16px;font-weight:700;height:100%}.choice b{font-size:24px}.choice input:checked+span{border-color:var(--blue);background:#eef2fd}.choice input:focus-visible+span{outline:3px solid var(--yellow)}
.inline{display:flex!important;align-items:center;gap:10px}.inline input{width:auto}
.nav-buttons{display:flex;justify-content:space-between;margin-top:30px}.nav-buttons #next{margin-left:auto}
.review{display:grid;grid-template-columns:auto 1fr;gap:10px 20px;background:var(--bg);padding:22px;border-radius:12px;margin:0}.review dt{font-weight:800}.review dd{margin:0;color:var(--muted)}
.sent{background:var(--bg);padding:40px;border-radius:16px;display:grid;gap:14px;justify-items:start}
.site-footer{background:var(--navy);color:#c8d2ec;padding:50px 0 20px}.foot{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px}.foot strong{color:#fff;display:block;margin-bottom:8px}.foot>div:last-child a{display:block;text-decoration:none;margin:4px 0}.site-footer .logo{color:#fff}.fine{font-size:12px;margin-top:30px;opacity:.7}
@media(max-width:900px){.hero-grid,.areas{grid-template-columns:1fr}.grid3,.reviews,.steps{grid-template-columns:1fr}.foot{grid-template-columns:1fr}.checker{position:static}}
@media(max-width:760px){.hide-sm{display:none}.head{gap:10px}.progress li{font-size:0}.progress li::before{font-size:14px}.emergency span{display:none}}
`,
  js: `
(function(){
var C=concept;
var zones=[["Zone 1","No call-out fee",["Box Hill","Blackburn","Doncaster","Mitcham","Nunawading","Vermont","Forest Hill","Burwood East","Mont Albert","Surrey Hills"]],
 ["Zone 2","$39 call-out",["Ringwood","Croydon","Bayswater","Wantirna","Heathmont","Templestowe","Donvale","Warrandyte","Glen Waverley","Mount Waverley"]],
 ["Zone 3","$69 call-out",["Lilydale","Mooroolbark","Kilsyth","Montrose","Boronia","Ferntree Gully","Healesville","Yarra Glen","Chirnside Park","Wonga Park"]]];
var all=[];zones.forEach(function(z){z[2].forEach(function(s){all.push([s,z[0],z[1]]);});});
document.querySelectorAll("#suburbs").forEach(function(d){d.innerHTML=all.map(function(a){return '<option value="'+a[0]+'">';}).join("");});
var zl=document.getElementById("zone-list");if(zl)zl.innerHTML=zones.map(function(z){return '<div class="zone"><h3>'+z[0]+' <span>'+z[1]+'</span></h3><p>'+z[2].join(" · ")+'</p></div>';}).join("");
var check=document.getElementById("check");
if(check){var input=document.getElementById("suburb"),res=document.getElementById("result");
 function run(){var q=input.value.trim().toLowerCase();if(!q){res.textContent="";return;}var m=all.filter(function(a){return a[0].toLowerCase()===q;})[0];
  if(m){res.className="result yes";res.textContent="✓ Yes, we cover "+m[0]+" ("+m[1]+", "+m[2].toLowerCase()+").";}else{res.className="result no";res.textContent="We don't list "+input.value+" yet. Call us, as we often help just outside our zones.";}}
 check.addEventListener("click",run);input.addEventListener("keydown",function(e){if(e.key==="Enter")run();});input.addEventListener("change",run);}
var eta=document.getElementById("eta");if(eta)eta.textContent=35+new Date().getHours()%4*7;
// Multi-step quote form
var form=document.getElementById("quote");
if(form){var steps=form.querySelectorAll("[data-step]"),prog=document.querySelectorAll(".progress li"),back=document.getElementById("back"),next=document.getElementById("next"),i=0;
 var pre=C.param("type");if(pre){var r=form.querySelector('input[name=type][value="'+pre.replace(/"/g,"")+'"]');if(r)r.checked=true;}
 function show(n){i=n;steps.forEach(function(s,j){s.hidden=j!==n;});prog.forEach(function(p,j){p.className=j<n?"done":j===n?"active":"";});back.hidden=n===0;next.textContent=n===steps.length-1?"Send request":"Next";
  if(n===steps.length-1){var f=new FormData(form);document.getElementById("review").innerHTML=[["Job",f.get("type")],["Property",f.get("property")],["Timing",f.get("when")],["Details",f.get("details")],["Name",f.get("name")],["Mobile",f.get("phone")],["Suburb",f.get("suburb")]].map(function(r){return "<dt>"+r[0]+"</dt><dd>"+C.esc(r[1]||"")+"</dd>";}).join("");}
  var first=steps[n].querySelector("input,select,textarea");if(first&&n)first.focus();}
 function valid(){var ok=true;steps[i].querySelectorAll(".field-error").forEach(function(e){e.remove();});
  if(i===0&&!form.querySelector("input[name=type]:checked")){var m=document.createElement("span");m.className="field-error";m.textContent="Choose the type of job.";steps[0].appendChild(m);return false;}
  steps[i].querySelectorAll("input,textarea,select").forEach(function(el){if(!el.checkValidity()){ok=false;el.setAttribute("aria-invalid","true");var m=document.createElement("span");m.className="field-error";m.textContent="Please fill this in.";el.insertAdjacentElement("afterend",m);}else el.removeAttribute("aria-invalid");});return ok;}
 next.addEventListener("click",function(){if(!valid())return;if(i<steps.length-1)show(i+1);else{document.getElementById("qref").textContent="BW-"+Math.floor(10000+Math.random()*90000);form.hidden=true;document.querySelector(".progress").hidden=true;var s=document.getElementById("sent");s.hidden=false;s.focus();}});
 back.addEventListener("click",function(){show(i-1);});show(0);}
})();
`,
};
