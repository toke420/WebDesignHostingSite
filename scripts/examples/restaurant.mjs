import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Home"],
  ["menu.html", "Menu"],
  ["reservations.html", "Reservations"],
  ["events.html", "Private dining"],
];

const menu = {
  Lunch: [
    ["Small plates", [
      ["Charred sourdough", "cultured butter, smoked salt", 9, ["V"]],
      ["Kingfish crudo", "finger lime, green chilli, buttermilk", 24, ["GF", "DF"]],
      ["Burrata", "heirloom tomato, ember-roasted peach, basil", 22, ["V", "GF"]],
    ]],
    ["Mains", [
      ["Wood-fired chicken", "salsa verde, charred lemon, chips", 34, ["GF", "DF"]],
      ["Mushroom risotto", "pine mushroom, aged pecorino, thyme", 31, ["V", "GF"]],
      ["Steak sandwich", "300g scotch, onion jam, aioli", 29, []],
    ]],
  ],
  Dinner: [
    ["To start", [
      ["Oysters", "natural or with mignonette, each", 5, ["GF", "DF"]],
      ["Flatbread", "whipped feta, hot honey, za'atar", 16, ["V"]],
      ["Octopus", "romesco, smoked almonds, kipfler", 27, ["GF", "DF"]],
    ]],
    ["From the fire", [
      ["Dry-aged ribeye 450g", "bone marrow butter, watercress", 78, ["GF"]],
      ["Whole flounder", "brown butter, capers, sea herbs", 54, ["GF"]],
      ["Ember-roasted cauliflower", "tahini, pomegranate, dukkah", 32, ["V", "GF", "DF"]],
      ["Lamb shoulder to share", "slow-cooked 12 hours, flatbreads, pickles", 96, ["DF"]],
    ]],
    ["Dessert", [
      ["Burnt Basque cheesecake", "macerated berries", 16, ["V", "GF"]],
      ["Dark chocolate tart", "olive oil, sea salt, crème fraîche", 17, ["V"]],
    ]],
  ],
  Drinks: [
    ["Cocktails", [
      ["Smoked negroni", "gin, vermouth, Campari, applewood smoke", 22, []],
      ["Garden spritz", "Aperol, cucumber, basil, prosecco", 19, []],
      ["Zero-proof sour", "seedlip, yuzu, aquafaba", 14, []],
    ]],
    ["Wine by the glass", [
      ["Yarra Valley chardonnay", "2023", 17, []],
      ["Heathcote shiraz", "2021", 18, []],
      ["Mornington pinot noir", "2022", 19, []],
    ]],
  ],
};

export default {
  id: "restaurant",
  name: "Ember & Salt",
  tagline: "Wood-fired dining in Fitzroy.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html">Ember <em>&amp;</em> Salt</a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
<a class="btn small hide-sm" href="reservations.html">Book a table</a>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<div><p class="logo">Ember <em>&amp;</em> Salt</p><p>214 Gertrude Street, Fitzroy VIC 3065<br>(03) 9000 4455</p></div>
<div><strong>Hours</strong><p>Wed–Thu 5pm–late<br>Fri–Sun 12pm–late<br>Mon–Tue closed</p></div>
<div><strong>Follow</strong><p>@emberandsalt<br>Newsletter: seasonal menus &amp; events</p></div>
</div><p class="wrap fine">Design concept for a sample restaurant. Bookings are not real.</p></footer>`,
  pages: {
    "index.html": {
      title: "Wood-fired dining in Fitzroy",
      body: `
<section class="hero"><div class="wrap hero-inner"><div class="plate p1 hero-plate" role="img" aria-label="Dry-aged ribeye on a ceramic plate"></div><div><p class="kicker">Fitzroy · Since 2018</p><h1>Cooked over fire.<br>Shared at the table.</h1><p class="lead">Seasonal Victorian produce, a 4-metre wood grill and a wine list that leans local.</p><div class="actions"><a class="btn" href="reservations.html">Book a table</a><a class="btn ghost" href="menu.html">View the menu</a></div></div></div></section>
<section class="wrap status-strip"><span id="open-status" class="pill"></span><span>Walk-ins welcome at the bar</span><span>Groups of 8+ see <a href="events.html">private dining</a></span></section>
<section class="section wrap two"><div class="plate p1" role="img" aria-label="Wood-fired ribeye"></div><div><p class="kicker">Signature</p><h2>The ribeye that made our name.</h2><p>Dry-aged in-house for 45 days, cooked over red gum and finished with bone-marrow butter. Order it medium-rare and trust us.</p><a class="link" href="menu.html?tab=Dinner">See the dinner menu →</a></div></section>
<section class="section wrap dishes">${[["Kingfish crudo","p2"],["Ember-roasted cauliflower","p3"],["Basque cheesecake","p4"]].map(([n,c])=>`<figure><div class="plate ${c}" role="img" aria-label="${n}"></div><figcaption>${n}</figcaption></figure>`).join("")}</section>
<section class="section press wrap"><blockquote>“The most exciting grill in Melbourne right now.”<cite>The Good Food Guide, 2025</cite></blockquote><blockquote>“Book the lamb shoulder. Bring friends.”<cite>Broadsheet</cite></blockquote></section>`,
    },
    "menu.html": {
      title: "Menu",
      body: `
<section class="page-hero wrap"><p class="kicker">Menu</p><h1>Tonight at Ember &amp; Salt</h1><p class="lead">Menus change with the seasons. Tell us about allergies when you book.</p></section>
<section class="wrap menu-wrap">
<div class="tabs" role="tablist" aria-label="Menu">${Object.keys(menu).map((k, i) => `<button role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${k}</button>`).join("")}</div>
<fieldset class="diet"><legend>Show only</legend>${[["V","Vegetarian"],["GF","Gluten free"],["DF","Dairy free"]].map(([k,l])=>`<label><input type="checkbox" value="${k}"> ${l}</label>`).join("")}</fieldset>
${Object.entries(menu).map(([k, sections], i) => `<div role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}" ${i ? "hidden" : ""}>${sections.map(([title, items]) => `<section class="menu-section"><h2>${title}</h2><ul>${items.map(([n, d, p, tags]) => `<li data-tags="${tags.join(" ")}"><div><strong>${n}</strong>${tags.map((t) => `<abbr class="tag" title="${{V:"Vegetarian",GF:"Gluten free",DF:"Dairy free"}[t]}">${t}</abbr>`).join("")}<p>${d}</p></div><span class="price">${p}</span></li>`).join("")}</ul></section>`).join("")}</div>`).join("")}
<p class="no-match" hidden>Nothing matches every filter in this menu. Try removing one.</p>
<p class="legend">V vegetarian · GF gluten free · DF dairy free. 10% surcharge on public holidays.</p>
</section>`,
    },
    "reservations.html": {
      title: "Reservations",
      body: `
<section class="page-hero wrap"><p class="kicker">Reservations</p><h1>Book a table</h1><p class="lead">Tables are held for 15 minutes. For 8 or more guests, see <a href="events.html">private dining</a>.</p></section>
<section class="wrap booking">
<form id="booking" novalidate>
  <div class="row"><label>Guests<select name="guests">${[1,2,3,4,5,6,7].map(n=>`<option${n===2?" selected":""}>${n}</option>`).join("")}</select></label><label>Date<input type="date" name="date" required></label></div>
  <fieldset class="slots"><legend>Available times</legend><div id="slots" class="slot-grid"></div><p id="slot-note" class="note"></p></fieldset>
  <div class="row"><label>Name<input name="name" required autocomplete="name"></label><label>Mobile<input name="phone" type="tel" required autocomplete="tel"></label></div>
  <label>Email<input name="email" type="email" required autocomplete="email"></label>
  <label>Occasion or dietary needs<textarea name="notes" rows="3" placeholder="Birthday, anniversary, allergies…"></textarea></label>
  <button class="btn" type="submit">Confirm booking</button>
</form>
<div id="booked" class="booked" hidden tabindex="-1"><p class="kicker">You're booked</p><h2 id="booked-title"></h2><p>Reference <strong id="ref"></strong>. In a real site you'd receive an SMS confirmation and a reminder the day before.</p><a class="btn ghost" href="menu.html">Browse the menu</a></div>
<aside class="info-card"><h3>Good to know</h3><ul><li>Kitchen closes 9:30pm</li><li>Children welcome until 8pm</li><li>Wheelchair accessible, step-free entry</li><li>Cancellations: 24 hours' notice please</li></ul></aside>
</section>`,
    },
    "events.html": {
      title: "Private dining & events",
      body: `
<section class="page-hero wrap"><p class="kicker">Private dining</p><h1>The Cellar Room</h1><p class="lead">Seats up to 24 guests beside our wine wall. Set menus from $95 per person.</p></section>
<section class="wrap events">
<div class="packages">${[["Long lunch","$95 pp","Four shared courses, welcome spritz"],["Feast","$125 pp","Six courses including the lamb shoulder"],["Chef's table","$165 pp","Eight courses with matched local wines"]].map(([n,p,d])=>`<article><h3>${n}</h3><p class="price">${p}</p><p>${d}</p></article>`).join("")}</div>
<h2>Upcoming events</h2>
<ul class="event-list">${[["12 Dec","Summer wine dinner with Yarra Yering"],["21 Dec","Christmas long lunch"],["31 Dec","New Year's Eve fire feast"]].map(([d,t])=>`<li><time>${d}</time><span>${t}</span><button class="btn small ghost" data-interest="${t}">Notify me</button></li>`).join("")}</ul>
<form id="enquiry" class="enquiry" novalidate><h2>Enquire about an event</h2>
<div class="row"><label>Name<input name="name" required></label><label>Email<input type="email" name="email" required></label></div>
<div class="row"><label>Guests<input type="number" name="guests" min="8" max="24" value="12" required></label><label>Preferred date<input type="date" name="date" required></label></div>
<label>Tell us about your event<textarea name="msg" rows="4" required></textarea></label><button class="btn">Send enquiry</button></form>
</section>`,
    },
  },
  css: `
:root{--bg:#141210;--panel:#1d1a17;--ink:#f1e9df;--muted:#b3a697;--ember:#e0662f;--line:#3a332c}
body{background:var(--bg);color:var(--ink);font-family:"Gill Sans","Gill Sans MT",Calibri,sans-serif}
h1,h2,h3,.logo{font-family:"Didot","Bodoni MT","Playfair Display",Georgia,serif;font-weight:400}
h1{font-size:clamp(40px,6.5vw,84px);line-height:1}h2{font-size:clamp(28px,3.5vw,44px);line-height:1.1}
.wrap{width:min(1180px,calc(100% - 32px));margin:auto}
.site-header{border-bottom:1px solid var(--line);position:sticky;top:0;background:#141210f2;z-index:10}
.head{display:flex;align-items:center;justify-content:space-between;gap:20px;height:78px;position:relative}
.logo{font-size:26px;text-decoration:none;letter-spacing:1px}.logo em{color:var(--ember)}
.site-nav{display:flex;gap:30px;text-transform:uppercase;letter-spacing:2px;font-size:13px}.site-nav a{text-decoration:none;color:var(--muted)}.site-nav a[aria-current]{color:var(--ember)}
.site-nav.open{background:var(--bg);border-bottom:1px solid var(--line)}
.btn{display:inline-block;background:var(--ember);color:#160d08;padding:14px 26px;text-decoration:none;text-transform:uppercase;letter-spacing:2px;font-size:13px;font-weight:700;border:1px solid var(--ember)}
.btn:hover{background:#f07a43}.btn.ghost{background:transparent;color:var(--ink);border-color:var(--ink)}.btn.small{padding:9px 16px;font-size:12px}
.kicker{text-transform:uppercase;letter-spacing:4px;font-size:12px;color:var(--ember);margin-bottom:16px}
.lead{font-size:19px;color:var(--muted);max-width:560px;margin-top:20px}.lead a{color:var(--ink)}
.hero{overflow:hidden;min-height:78vh;display:flex;align-items:flex-end;padding:60px 0;background:radial-gradient(ellipse at 75% 60%,#e0662f55,transparent 55%),radial-gradient(ellipse at 85% 90%,#ffb34733,transparent 40%),linear-gradient(180deg,#141210 0%,#241812 100%)}
.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:34px}
.hero-inner{display:grid;grid-template-columns:1fr;position:relative}.hero-plate{position:absolute;right:-40px;bottom:20px;width:min(440px,38vw);opacity:.95}.hero-inner>div:last-child{position:relative;max-width:700px}
@media(max-width:860px){.hero-plate{opacity:.35;right:-90px;bottom:auto;top:-40px;width:300px}}
.status-strip{display:flex;gap:24px;flex-wrap:wrap;align-items:center;padding:20px 0;border-bottom:1px solid var(--line);color:var(--muted);font-size:15px}
.pill{border:1px solid var(--line);border-radius:99px;padding:6px 14px;color:var(--ink)}.pill.open::before{content:"● ";color:#6fcf7a}.pill.closed::before{content:"● ";color:var(--ember)}
.section{padding:90px 0}.two{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}.two p{color:var(--muted);margin:18px 0}
.link{color:var(--ember);text-decoration:none;letter-spacing:1px}
.plate{aspect-ratio:1;border-radius:50%;box-shadow:0 30px 60px #000a,inset 0 0 0 18px #2a2520,inset 0 0 0 20px #3a332c}
.p1{background:radial-gradient(circle at 45% 45%,#8b2f1b 0 22%,#5c1f12 23% 30%,transparent 31%),radial-gradient(circle at 62% 60%,#5f7d3a 0 8%,transparent 9%),radial-gradient(circle at 35% 65%,#e7c27a 0 6%,transparent 7%),#efe6d8}
.p2{background:radial-gradient(circle at 40% 40%,#f2b8a0 0 12%,transparent 13%),radial-gradient(circle at 58% 52%,#f4c0a8 0 12%,transparent 13%),radial-gradient(circle at 45% 64%,#efb39a 0 11%,transparent 12%),radial-gradient(circle at 60% 35%,#7fae4f 0 4%,transparent 5%),#e9efe6}
.p3{background:radial-gradient(circle at 50% 50%,#d79a3f 0 26%,#9a5b1d 27% 30%,transparent 31%),radial-gradient(circle at 40% 40%,#b5243c 0 3%,transparent 4%),radial-gradient(circle at 62% 58%,#b5243c 0 3%,transparent 4%),#f2ead9}
.p4{background:radial-gradient(circle at 50% 50%,#3a1f12 0 24%,#c98a3d 25% 30%,transparent 31%),radial-gradient(circle at 60% 40%,#a3233d 0 6%,transparent 7%),#f4ece0}
.dishes{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}figure{margin:0;text-align:center}figcaption{margin-top:20px;font-family:Georgia,serif;font-size:20px}
.press{display:grid;grid-template-columns:1fr 1fr;gap:40px;border-top:1px solid var(--line)}blockquote{margin:0;font:italic 26px/1.4 Georgia,serif}cite{display:block;margin-top:14px;font:13px/1 "Gill Sans",sans-serif;letter-spacing:2px;text-transform:uppercase;color:var(--ember);font-style:normal}
.page-hero{padding:70px 0 30px}
.menu-wrap{padding-bottom:80px}.tabs{display:flex;gap:6px;border-bottom:1px solid var(--line);margin-top:20px}
.tabs button{background:none;border:0;border-bottom:2px solid transparent;padding:14px 22px;color:var(--muted);text-transform:uppercase;letter-spacing:3px;font-size:13px}.tabs button[aria-selected=true]{color:var(--ink);border-color:var(--ember)}
.diet{border:0;padding:20px 0;margin:0;display:flex;gap:20px;flex-wrap:wrap;align-items:center;color:var(--muted)}.diet legend{float:left;margin-right:10px;padding:0}.diet label{display:flex;gap:6px;align-items:center;cursor:pointer}
.menu-section{margin-top:40px}.menu-section h2{font-size:30px;border-bottom:1px solid var(--line);padding-bottom:12px}
.menu-section ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:4px 50px}
.menu-section li{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px dotted var(--line)}.menu-section p{color:var(--muted);font-size:15px}
.price{font-family:Georgia,serif;font-size:20px;color:var(--ember)}.tag{font-size:11px;border:1px solid var(--line);border-radius:4px;padding:1px 5px;margin-left:8px;text-decoration:none;color:var(--muted)}
.legend,.no-match{color:var(--muted);margin-top:30px;font-size:14px}
.booking{display:grid;grid-template-columns:1.4fr .6fr;gap:40px;padding-bottom:80px;align-items:start}
form{display:grid;gap:18px}label{display:grid;gap:6px;font-size:14px;letter-spacing:1px;color:var(--muted)}.row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
input,select,textarea{background:var(--panel);border:1px solid var(--line);padding:12px;color:var(--ink);color-scheme:dark}input:focus,select:focus,textarea:focus{outline:2px solid var(--ember)}
.slots{border:1px solid var(--line);padding:16px;margin:0}.slots legend{padding:0 8px;color:var(--muted)}.slot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:8px}
.slot-grid button{background:var(--panel);border:1px solid var(--line);padding:10px 0;color:var(--ink)}.slot-grid button[aria-pressed=true]{background:var(--ember);color:#160d08;border-color:var(--ember)}.slot-grid button:disabled{opacity:.3;text-decoration:line-through;cursor:not-allowed}
.note{color:var(--muted);font-size:14px;margin-top:10px}.booked{border:1px solid var(--ember);padding:40px;display:grid;gap:14px;justify-items:start}
.info-card{background:var(--panel);padding:26px;border:1px solid var(--line)}.info-card ul{padding-left:18px;color:var(--muted);line-height:2}
.events{padding-bottom:80px;display:grid;gap:40px}.packages{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.packages article{background:var(--panel);padding:30px;border-top:3px solid var(--ember)}.packages p{color:var(--muted)}.packages .price{margin:10px 0;display:block}
.event-list{list-style:none;padding:0;margin:0}.event-list li{display:flex;gap:24px;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)}.event-list time{font-family:Georgia,serif;font-size:22px;color:var(--ember);min-width:80px}.event-list span{flex:1}
.enquiry{background:var(--panel);padding:30px;border:1px solid var(--line)}
.site-footer{border-top:1px solid var(--line);padding:50px 0 20px;color:var(--muted)}.foot{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px}.foot strong{color:var(--ink);letter-spacing:2px;text-transform:uppercase;font-size:13px}.fine{font-size:12px;margin-top:30px}
@media(max-width:860px){.two,.booking,.press,.packages,.menu-section ul{grid-template-columns:1fr}.dishes{grid-template-columns:1fr 1fr}.foot{grid-template-columns:1fr}}
@media(max-width:760px){.hide-sm{display:none}.row{grid-template-columns:1fr}.dishes{grid-template-columns:1fr}.section{padding:60px 0}.tabs button{padding:12px;letter-spacing:1px}.event-list li{flex-wrap:wrap}}
`,
  js: `
(function(){
var C=concept;
// Open now (Melbourne time)
var st=document.getElementById("open-status");
function melb(){return new Date(new Date().toLocaleString("en-US",{timeZone:"Australia/Melbourne"}));}
if(st){var n=melb(),d=n.getDay(),h=n.getHours();var open=(d>=3&&d<=4&&h>=17)||((d===5||d===6||d===0)&&h>=12);st.className="pill "+(open?"open":"closed");st.textContent=open?"Open now":"Closed now · opens "+(d===1||d===2?"Wednesday 5pm":d>=3&&d<=4?"5pm":"12pm");}
// Menu tabs + dietary filters
var tabs=document.querySelectorAll("[role=tab]");
function show(t){tabs.forEach(function(x){var on=x===t;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute("aria-controls")).hidden=!on;});filter();}
tabs.forEach(function(t,i){t.addEventListener("click",function(){show(t);history.replaceState(null,"","?tab="+t.textContent);});t.addEventListener("keydown",function(e){var j=e.key==="ArrowRight"?i+1:e.key==="ArrowLeft"?i-1:null;if(j===null)return;var nt=tabs[(j+tabs.length)%tabs.length];show(nt);nt.focus();});});
function filter(){var want=Array.prototype.map.call(document.querySelectorAll(".diet input:checked"),function(c){return c.value;});var panel=document.querySelector("[role=tabpanel]:not([hidden])");if(!panel)return;var shown=0;
 panel.querySelectorAll("li").forEach(function(li){var tags=li.dataset.tags.split(" ");var ok=want.every(function(w){return tags.indexOf(w)>=0;});li.hidden=!ok;if(ok)shown++;});
 panel.querySelectorAll(".menu-section").forEach(function(s){s.hidden=!s.querySelector("li:not([hidden])");});document.querySelector(".no-match").hidden=shown>0;}
document.querySelectorAll(".diet input").forEach(function(c){c.addEventListener("change",filter);});
var tab=C.param("tab");if(tab){var t=document.getElementById("tab-"+tab);if(t)show(t);}
// Reservations: time slots vary by day; some are "already booked".
var form=document.getElementById("booking");
if(form){var date=form.date,slots=document.getElementById("slots"),note=document.getElementById("slot-note"),chosen=null;
 var today=new Date();date.min=today.toISOString().slice(0,10);var max=new Date(Date.now()+60*864e5);date.max=max.toISOString().slice(0,10);
 var first=new Date();while([1,2].indexOf(first.getDay())>=0)first.setDate(first.getDate()+1);date.value=first.toISOString().slice(0,10);
 function render(){chosen=null;var d=new Date(date.value+"T12:00");var day=d.getDay();slots.innerHTML="";
  if(isNaN(day)){note.textContent="Choose a date to see times.";return;}
  if(day===1||day===2){note.textContent="We're closed Mondays and Tuesdays. Please choose another day.";return;}
  var times=[];if(day>=5||day===0)times=["12:00","12:30","13:00","13:30","14:00"];times=times.concat(["17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"]);
  var seed=d.getDate()*7+(+form.guests.value);
  times.forEach(function(t,i){var b=document.createElement("button");b.type="button";b.textContent=t;b.setAttribute("aria-pressed","false");if((seed+i*3)%5===0)b.disabled=true;
   b.addEventListener("click",function(){slots.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed","false");});b.setAttribute("aria-pressed","true");chosen=t;note.textContent="";});slots.appendChild(b);});
  note.textContent="Greyed-out times are fully booked.";}
 date.addEventListener("change",render);form.guests.addEventListener("change",render);render();
 form.addEventListener("submit",function(e){e.preventDefault();var ok=C.validate(form);if(!chosen){note.textContent="Please choose a time.";ok=false;}if(!ok)return;
  var d=new Date(date.value+"T12:00");document.getElementById("booked-title").textContent=form.guests.value+" guest"+(form.guests.value>1?"s":"")+", "+d.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"})+" at "+chosen;
  document.getElementById("ref").textContent="ES"+Math.floor(1000+Math.random()*9000);form.hidden=true;var b=document.getElementById("booked");b.hidden=false;b.focus();});}
// Events
document.querySelectorAll("[data-interest]").forEach(function(b){b.addEventListener("click",function(){b.textContent="✓ We'll let you know";b.disabled=true;C.toast("We'll email you when "+b.dataset.interest+" tickets open.");});});
var enq=document.getElementById("enquiry");if(enq){enq.date.min=new Date().toISOString().slice(0,10);enq.addEventListener("submit",function(e){e.preventDefault();if(!C.validate(enq))return;enq.innerHTML='<h2>Thanks, '+C.esc(enq.name.value.split(" ")[0])+'.</h2><p style="color:var(--muted)">Our events team would reply within one business day with menus and availability.</p>';});}
})();
`,
};
