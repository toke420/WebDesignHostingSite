import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Home"],
  ["treatments.html", "Treatments"],
  ["team.html", "Practitioners"],
  ["new-patients.html", "New patients"],
];
const treatments = [
  ["physio", "Physiotherapy", "Initial assessment", 60, 115, "Assessment, diagnosis and a hands-on treatment plan for pain or injury."],
  ["physio-f", "Physiotherapy", "Follow-up", 30, 89, "Ongoing treatment and exercise progression."],
  ["sports", "Sports injury", "Sports assessment", 45, 105, "Return-to-sport testing, taping and load management."],
  ["pilates", "Clinical Pilates", "1:1 session", 55, 95, "Physio-led reformer Pilates for rehab and strength."],
  ["pilates-g", "Clinical Pilates", "Small group (max 4)", 55, 42, "Equipment classes tailored to each person."],
  ["massage", "Remedial massage", "Remedial massage", 60, 110, "Deep tissue and trigger point work for tight muscles."],
  ["dry", "Dry needling", "Add-on", 15, 25, "Added to a physio session where clinically appropriate."],
];
const team = [
  ["sarah", "Dr Sarah Nguyen", "Principal Physiotherapist", "Sports & running injuries, ACL rehab", "SN", "#2c7a7b", ["physio", "physio-f", "sports", "dry"]],
  ["james", "James Whitford", "Physiotherapist", "Back & neck pain, desk workers", "JW", "#4a6fa5", ["physio", "physio-f", "dry"]],
  ["aroha", "Aroha Tane", "Pilates Physiotherapist", "Pre/post-natal, Clinical Pilates", "AT", "#b5838d", ["pilates", "pilates-g", "physio-f"]],
  ["leo", "Leo Marchetti", "Remedial Massage Therapist", "Sports massage, myofascial release", "LM", "#6d597a", ["massage"]],
];

export default {
  id: "clinic",
  name: "Peak Physio & Pilates",
  tagline: "Physiotherapy, Clinical Pilates and massage in Hawthorn.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html"><svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><path d="M4 32 L16 12 L22 22 L27 15 L36 32 Z" fill="currentColor"/></svg>Peak<span>Physio &amp; Pilates</span></a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
<a class="btn hide-sm" href="book.html">Book online</a>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<div><strong>Peak Physio &amp; Pilates</strong><p>2/88 Glenferrie Road, Hawthorn VIC 3122<br>(03) 9000 7788 · care@peakphysio.example</p></div>
<div><strong>Hours</strong><p>Mon–Fri 7am–8pm<br>Saturday 8am–1pm</p></div>
<div><strong>Health funds</strong><p>HICAPS on the spot claims · NDIS · WorkSafe · TAC · DVA</p></div>
</div><p class="wrap fine">Design concept for a sample clinic. No appointments are booked and no health information is stored.</p></footer>`,
  pages: {
    "index.html": {
      title: "Physio in Hawthorn",
      body: `
<section class="hero"><div class="wrap hero-grid">
<div><p class="eyebrow">Hawthorn · Open 6 days</p><h1>Move better. Feel stronger.</h1><p class="lead">Evidence-based physiotherapy, Clinical Pilates and remedial massage, with appointments available today.</p>
<div class="actions"><a class="btn" href="book.html">Book an appointment</a><a class="btn soft" href="treatments.html">Treatments &amp; fees</a></div>
<p class="next-slot" id="next-slot"></p></div>
<div class="hero-art" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="card-float"><strong>On-the-spot claims</strong><span>HICAPS · NDIS · WorkSafe</span></div></div>
</div></section>
<section class="section wrap"><h2>How can we help?</h2><div class="conditions">${["Back & neck pain","Sports injuries","Post-surgery rehab","Pregnancy & postnatal","Headaches","Running injuries","Shoulder pain","Knee pain"].map(c=>`<a href="book.html?reason=${encodeURIComponent(c)}">${c}</a>`).join("")}</div></section>
<section class="section soft-band"><div class="wrap three">${[["Same-week appointments","Early, late and Saturday times."],["Longer first visits","60 minutes to properly understand you."],["Your home program","Exercises sent to your phone with videos."]].map(([t,d])=>`<div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></section>
<section class="section wrap"><div class="row-head"><h2>Meet the team</h2><a href="team.html">All practitioners →</a></div><div class="team-mini">${team.map(([id,n,r,,i,c])=>`<a href="team.html#${id}" class="mini"><span class="av" style="background:${c}">${i}</span><span><strong>${n}</strong><small>${r}</small></span></a>`).join("")}</div></section>`,
    },
    "treatments.html": {
      title: "Treatments & fees",
      body: `
<section class="page-head wrap"><h1>Treatments &amp; fees</h1><p class="lead">Private health rebates claimed on the spot. Fees include GST where applicable.</p></section>
<section class="wrap section-sm"><div class="filter" role="group" aria-label="Filter treatments"><button aria-pressed="true" data-f="all">All</button>${[...new Set(treatments.map(t=>t[1]))].map(c=>`<button aria-pressed="false" data-f="${c}">${c}</button>`).join("")}</div>
<div class="treat-list">${treatments.map(([id,cat,name,min,fee,desc])=>`<article class="treat" data-cat="${cat}"><div><p class="cat">${cat}</p><h3>${name}</h3><p>${desc}</p></div><div class="treat-meta"><span>${min} min</span><strong>$${fee}</strong><a class="btn small" href="book.html?treatment=${id}">Book</a></div></article>`).join("")}</div></section>`,
    },
    "team.html": {
      title: "Our practitioners",
      body: `
<section class="page-head wrap"><h1>Our practitioners</h1><p class="lead">AHPRA-registered physiotherapists and an accredited remedial massage therapist.</p></section>
<section class="wrap section-sm team">${team.map(([id,n,r,s,i,c,t])=>`<article class="person" id="${id}"><span class="av big" style="background:${c}">${i}</span><div><h2>${n}</h2><p class="role">${r}</p><p><strong>Special interests:</strong> ${s}</p><p class="offers">${t.map(x=>treatments.find(tr=>tr[0]===x)).map(tr=>`<span>${tr[2]==="Follow-up"||tr[2]==="Add-on"?tr[1]+" "+tr[2].toLowerCase():tr[2]}</span>`).join("")}</p><a class="btn" href="book.html?practitioner=${id}">Book with ${n.replace(/^Dr /,"").split(" ")[0]}</a></div></article>`).join("")}</section>`,
    },
    "new-patients.html": {
      title: "New patients",
      body: `
<section class="page-head wrap"><h1>Your first visit</h1><p class="lead">Here's what to expect, so you can walk in relaxed.</p></section>
<section class="wrap section-sm np"><ol class="timeline"><li><strong>Before you arrive</strong>You'll get a short online form by text. Bring your health fund card and any scans.</li><li><strong>Assessment (20 min)</strong>We talk through your history, goals and test how you move.</li><li><strong>Treatment (30 min)</strong>Hands-on treatment and your first exercises.</li><li><strong>Your plan</strong>A clear plan with expected timeline and costs, sent to your phone.</li></ol>
<div class="faq"><h2>Questions</h2>${[["Do I need a referral?","No. You can book directly. GP Chronic Disease Management referrals are accepted for Medicare rebates."],["What should I wear?","Comfortable clothing that lets us see the area, like shorts for knee problems."],["Can I claim on my health fund?","Yes. We claim on the spot with HICAPS so you only pay the gap."],["What's your cancellation policy?","Please give 24 hours' notice. Late cancellations may incur a fee."]].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`,
    },
    "book.html": {
      title: "Book online",
      body: `
<section class="page-head wrap"><h1>Book online</h1><p class="lead">Choose a treatment, practitioner and time. It takes under a minute.</p></section>
<section class="wrap section-sm booking">
<form id="book" novalidate>
<div class="step"><h2><span>1</span> Treatment</h2><select name="treatment" id="treatment" aria-label="Treatment">${treatments.map(([id,cat,name,min,fee])=>`<option value="${id}">${cat}: ${name} (${min} min, $${fee})</option>`).join("")}</select></div>
<div class="step"><h2><span>2</span> Practitioner</h2><div id="pracs" class="pracs" role="radiogroup" aria-label="Practitioner"></div></div>
<div class="step"><h2><span>3</span> Day &amp; time</h2><div class="cal" id="days" role="group" aria-label="Day"></div><div class="times" id="times" role="group" aria-label="Time"></div></div>
<div class="step"><h2><span>4</span> Your details</h2><div class="grid2"><label>First name<input name="first" required autocomplete="given-name"></label><label>Last name<input name="last" required autocomplete="family-name"></label><label>Mobile<input name="phone" type="tel" required autocomplete="tel"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
<label>Reason for visit<input name="reason" id="reason" placeholder="e.g. lower back pain"></label><label class="inline"><input type="checkbox" required> I've read the cancellation policy (24 hours' notice)</label></div>
<p class="err" id="book-err" role="alert"></p>
</form>
<aside class="summary" aria-live="polite"><h2>Your appointment</h2><dl id="summary"></dl><button class="btn wide" form="book" type="submit">Confirm booking</button></aside>
</section>
<section class="wrap section-sm confirmed" id="confirmed" hidden tabindex="-1"><div class="tick" aria-hidden="true">✓</div><h2>You're booked in</h2><p id="confirm-text"></p><p>In a real site you'd receive an SMS and email confirmation with a link to your intake form.</p><a class="btn soft" href="index.html">Back to home</a></section>`,
    },
  },
  css: `
:root{--teal:#1f6f6b;--teal-2:#e3f1ef;--ink:#1d2b2a;--muted:#5d6f6d;--bg:#fbfaf7;--line:#e2e8e6}
body{background:var(--bg);color:var(--ink);font-family:"Nunito","Trebuchet MS","Segoe UI",sans-serif}
h1,h2,h3{font-family:"Trebuchet MS","Segoe UI",sans-serif;font-weight:700;letter-spacing:-.5px;line-height:1.15}h1{font-size:clamp(36px,5.5vw,62px)}h2{font-size:clamp(24px,3vw,34px)}
.wrap{width:min(1140px,calc(100% - 32px));margin:auto}
.site-header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}.head{display:flex;align-items:center;gap:28px;height:76px;position:relative}
.logo{display:flex;align-items:center;gap:8px;color:var(--teal);text-decoration:none;font-weight:800;font-size:22px}.logo span{color:var(--muted);font-weight:600;font-size:14px;margin-left:4px}
.site-nav{display:flex;gap:24px;margin-left:auto}.site-nav a{text-decoration:none;color:var(--muted);font-weight:600;padding:6px 0}.site-nav a[aria-current]{color:var(--teal);border-bottom:2px solid var(--teal)}
.site-nav.open{background:#fff;border-bottom:1px solid var(--line)}
.btn{display:inline-block;background:var(--teal);color:#fff;padding:13px 24px;border-radius:99px;text-decoration:none;font-weight:700;border:0}.btn:hover{background:#185956}.btn.soft{background:var(--teal-2);color:var(--teal)}.btn.small{padding:8px 16px;font-size:14px}.btn.wide{width:100%}
.eyebrow{color:var(--teal);font-weight:700;margin-bottom:14px}.lead{font-size:19px;color:var(--muted);margin-top:16px;max-width:560px}
.hero{padding:70px 0}.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.next-slot{margin-top:18px;font-weight:700;color:var(--teal)}.next-slot::before{content:"● ";color:#3cb371}
.hero-art{position:relative;height:420px}.blob{position:absolute;border-radius:42% 58% 63% 37%/45% 41% 59% 55%}.b1{inset:20px 40px 40px 20px;background:linear-gradient(135deg,#9fd3c7,#1f6f6b)}.b2{width:180px;height:180px;right:0;bottom:0;background:#f2c6a0;opacity:.85}
.card-float{position:absolute;left:0;bottom:30px;background:#fff;padding:16px 20px;border-radius:16px;box-shadow:0 20px 40px #1f6f6b33;display:grid}.card-float span{color:var(--muted);font-size:14px}
.section{padding:70px 0}.section-sm{padding:20px 0 70px}
.conditions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.conditions a{background:#fff;border:1px solid var(--line);border-radius:99px;padding:10px 18px;text-decoration:none;font-weight:600}.conditions a:hover{border-color:var(--teal);color:var(--teal)}
.soft-band{background:var(--teal-2)}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}.three p{color:var(--muted)}
.row-head{display:flex;justify-content:space-between;align-items:end}.row-head a{color:var(--teal);font-weight:700}
.team-mini{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:24px}.mini{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px;text-decoration:none}.mini small{display:block;color:var(--muted)}
.av{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;flex-shrink:0}.av.big{width:110px;height:110px;font-size:34px}
.page-head{padding:60px 0 30px}
.filter{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}.filter button{border:1px solid var(--line);background:#fff;border-radius:99px;padding:8px 16px;font-weight:700}.filter button[aria-pressed=true]{background:var(--teal);color:#fff;border-color:var(--teal)}
.treat-list{display:grid;gap:12px}.treat{display:flex;justify-content:space-between;gap:20px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:16px;padding:22px}.treat p{color:var(--muted)}.cat{font-size:13px;font-weight:700;color:var(--teal)!important;text-transform:uppercase;letter-spacing:1px}
.treat-meta{display:flex;align-items:center;gap:18px;white-space:nowrap}.treat-meta strong{font-size:22px}
.team{display:grid;gap:20px}.person{display:flex;gap:28px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:28px;scroll-margin-top:100px}.person>div{display:grid;gap:8px;justify-items:start}.role{color:var(--teal);font-weight:700}
.offers{display:flex;gap:6px;flex-wrap:wrap}.offers span{background:var(--teal-2);color:var(--teal);border-radius:99px;padding:4px 12px;font-size:13px;font-weight:700}
.np{display:grid;grid-template-columns:1fr 1fr;gap:50px}.timeline{list-style:none;padding:0;margin:0;border-left:3px solid var(--teal-2)}.timeline li{padding:0 0 28px 26px;position:relative;color:var(--muted)}.timeline li::before{content:"";position:absolute;left:-10px;top:4px;width:16px;height:16px;border-radius:50%;background:var(--teal)}.timeline strong{display:block;color:var(--ink);font-size:18px}
details{background:#fff;border:1px solid var(--line);border-radius:14px;margin-top:10px}summary{padding:16px 18px;font-weight:700;cursor:pointer}details p{padding:0 18px 16px;color:var(--muted)}
.booking{display:grid;grid-template-columns:1.4fr .6fr;gap:30px;align-items:start}
#book{display:grid;gap:18px}.step{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px;display:grid;gap:14px}.step h2{font-size:20px;display:flex;align-items:center;gap:10px}.step h2 span{width:30px;height:30px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;font-size:15px}
select,input{border:1px solid #cfd9d6;border-radius:12px;padding:12px;background:#fff;width:100%}select:focus,input:focus{outline:3px solid #1f6f6b44;border-color:var(--teal)}
label{display:grid;gap:6px;font-weight:600;font-size:14px}.inline{display:flex;align-items:center;gap:10px;font-weight:500}.inline input{width:auto}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pracs{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.pracs button{display:flex;gap:10px;align-items:center;text-align:left;border:2px solid var(--line);background:#fff;border-radius:14px;padding:10px;font-weight:700}.pracs button[aria-checked=true]{border-color:var(--teal);background:var(--teal-2)}.pracs .av{width:40px;height:40px;font-size:14px}.pracs small{display:block;font-weight:500;color:var(--muted)}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal button{border:1px solid var(--line);background:#fff;border-radius:12px;padding:8px 0;display:grid;font-weight:700}.cal button small{font-weight:500;color:var(--muted);font-size:12px}.cal button[aria-pressed=true]{background:var(--teal);color:#fff;border-color:var(--teal)}.cal button[aria-pressed=true] small{color:#d6efeb}.cal button:disabled{opacity:.35}
.times{display:flex;flex-wrap:wrap;gap:8px}.times button{border:1px solid var(--line);background:#fff;border-radius:99px;padding:8px 14px;font-weight:700}.times button[aria-pressed=true]{background:var(--teal);color:#fff}.times p{color:var(--muted)}
.summary{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px;position:sticky;top:100px;display:grid;gap:14px}.summary dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0}.summary dt{color:var(--muted)}.summary dd{margin:0;font-weight:700}
.err{color:#b3261e;font-weight:700}.confirmed{text-align:center;display:grid;gap:12px;justify-items:center}.tick{width:80px;height:80px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;font-size:40px}
.site-footer{background:#123f3d;color:#c6dfdb;padding:50px 0 20px}.foot{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px}.foot strong{color:#fff}.fine{font-size:12px;margin-top:30px;opacity:.7}
@media(max-width:900px){.hero-grid,.booking,.np{grid-template-columns:1fr}.hero-art{height:260px}.three,.team-mini{grid-template-columns:1fr 1fr}.summary{position:static}.foot{grid-template-columns:1fr}}
@media(max-width:760px){.hide-sm{display:none}.three,.team-mini,.grid2{grid-template-columns:1fr}.treat{flex-direction:column;align-items:flex-start}.person{flex-direction:column}.cal{grid-template-columns:repeat(4,1fr)}}
`,
  js: `
(function(){
var C=concept;
var T=${JSON.stringify(treatments)};
var TEAM=${JSON.stringify(team)};
function slotsFor(prac,date){var d=date.getDay();if(d===0)return[];var base=d===6?["08:00","08:45","09:30","10:15","11:00","11:45","12:30"]:["07:00","07:45","08:30","09:15","10:00","11:30","13:00","14:30","15:15","16:00","17:30","18:15","19:00"];
 var seed=date.getDate()*13+prac.length*7;return base.filter(function(_,i){return (seed+i*5)%3!==0;});}
// Next available
var ns=document.getElementById("next-slot");if(ns){var t=new Date();var s=slotsFor("sarah",t);var now=t.getHours()+":"+String(t.getMinutes()).padStart(2,"0");var later=s.filter(function(x){return x>now.padStart(5,"0");});ns.textContent=later.length?"Next available: today at "+later[0]:"Next available: tomorrow morning";}
// Treatment filter
var f=document.querySelector(".filter");if(f)f.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;f.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});document.querySelectorAll(".treat").forEach(function(t){t.hidden=b.dataset.f!=="all"&&t.dataset.cat!==b.dataset.f;});});
// Booking
var form=document.getElementById("book");if(!form)return;
var sel=document.getElementById("treatment"),pracs=document.getElementById("pracs"),days=document.getElementById("days"),times=document.getElementById("times"),sum=document.getElementById("summary");
var state={prac:C.param("practitioner"),day:null,time:null};
if(C.param("treatment"))sel.value=C.param("treatment");if(C.param("reason"))document.getElementById("reason").value=C.param("reason");
if(state.prac){var p=TEAM.filter(function(t){return t[0]===state.prac;})[0];if(p&&p[6].indexOf(sel.value)<0)sel.value=p[6][0];}
function tr(){return T.filter(function(t){return t[0]===sel.value;})[0];}
function renderPracs(){var avail=TEAM.filter(function(t){return t[6].indexOf(sel.value)>=0;});if(!avail.some(function(a){return a[0]===state.prac;}))state.prac=avail[0][0];
 pracs.innerHTML=avail.map(function(a){return '<button type="button" role="radio" aria-checked="'+(a[0]===state.prac)+'" data-p="'+a[0]+'"><span class="av" style="background:'+a[5]+'">'+a[4]+'</span><span>'+a[1]+'<small>'+a[2]+'</small></span></button>';}).join("");renderDays();}
function renderDays(){var out="",d=new Date();for(var i=0;i<14;i++){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);var has=slotsFor(state.prac,x).length>0;var key=x.toDateString();if(!state.day&&has)state.day=key;
 out+='<button type="button" aria-pressed="'+(state.day===key)+'" data-d="'+key+'"'+(has?"":" disabled")+'><small>'+x.toLocaleDateString("en-AU",{weekday:"short"})+'</small>'+x.getDate()+'</button>';}days.innerHTML=out;renderTimes();}
function renderTimes(){var s=state.day?slotsFor(state.prac,new Date(state.day)):[];if(s.indexOf(state.time)<0)state.time=null;
 if(new Date(state.day).toDateString()===new Date().toDateString()){var n=new Date();var now=String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0");s=s.filter(function(x){return x>now;});}
 times.innerHTML=s.length?s.map(function(t){return '<button type="button" aria-pressed="'+(t===state.time)+'" data-t="'+t+'">'+t+'</button>';}).join(""):"<p>No times left on this day. Please pick another.</p>";renderSum();}
function renderSum(){var t=tr(),p=TEAM.filter(function(x){return x[0]===state.prac;})[0];sum.innerHTML="<dt>Treatment</dt><dd>"+t[1]+" · "+t[2]+"</dd><dt>With</dt><dd>"+(p?p[1]:"–")+"</dd><dt>When</dt><dd>"+(state.day&&state.time?new Date(state.day).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"short"})+", "+state.time:"Choose a time")+"</dd><dt>Length</dt><dd>"+t[3]+" min</dd><dt>Fee</dt><dd>$"+t[4]+"</dd>";}
sel.addEventListener("change",function(){renderPracs();});
pracs.addEventListener("click",function(e){var b=e.target.closest("[data-p]");if(b){state.prac=b.dataset.p;state.day=null;renderPracs();}});
days.addEventListener("click",function(e){var b=e.target.closest("[data-d]");if(b){state.day=b.dataset.d;renderDays();}});
times.addEventListener("click",function(e){var b=e.target.closest("[data-t]");if(b){state.time=b.dataset.t;renderTimes();}});
renderPracs();
form.addEventListener("submit",function(e){e.preventDefault();var err=document.getElementById("book-err");err.textContent="";var ok=C.validate(form);if(!state.time){err.textContent="Please choose an appointment time.";ok=false;}if(!ok)return;
 var p=TEAM.filter(function(x){return x[0]===state.prac;})[0];document.getElementById("confirm-text").textContent=form.first.value+", you're seeing "+p[1]+" on "+new Date(state.day).toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})+" at "+state.time+".";
 document.querySelector(".booking").hidden=true;var c=document.getElementById("confirmed");c.hidden=false;c.focus();});
})();
`,
};
