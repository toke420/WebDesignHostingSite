import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "◧ Dashboard"],
  ["contacts.html", "☺ Contacts"],
  ["pipeline.html", "▤ Pipeline"],
];

export default {
  id: "crm",
  name: "Pipeline CRM",
  tagline: "A focused CRM for small sales teams.",
  header: (file) => `<header class="site-header"><div class="head">
<a class="logo" href="index.html"><span aria-hidden="true">P</span>Pipeline</a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
<div class="me"><button class="btn small" data-new-contact>+ New contact</button><span class="avatar" title="Signed in as Alex (demo)">AK</span></div>
</div></header>`,
  footer: () => `<footer class="site-footer"><p>Design concept · all people and companies are fictional · data stays in this browser. <button class="linkish" id="reset-data">Reset demo data</button></p></footer>
<dialog id="new-contact" aria-labelledby="nc-title"><form method="dialog" id="nc-form" novalidate><h2 id="nc-title">New contact</h2>
<label>Name<input name="name" required></label><label>Company<input name="company" required></label><label>Email<input type="email" name="email" required></label>
<label>Deal value (AUD)<input type="number" name="value" min="0" step="100" value="5000"></label><label>Stage<select name="stage"><option>Lead</option><option>Qualified</option><option>Proposal</option><option>Won</option></select></label>
<div class="dlg-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn" value="save">Save contact</button></div></form></dialog>`,
  pages: {
    "index.html": {
      title: "Dashboard",
      body: `<div class="page"><div class="page-head"><div><h1>Good <span id="greet">day</span>, Alex</h1><p class="muted" id="today"></p></div><a class="btn ghost" href="pipeline.html">Open pipeline →</a></div>
<section class="kpis" id="kpis"></section>
<section class="grid2"><div class="panel"><h2>Revenue won, last 6 months</h2><svg id="chart" viewBox="0 0 600 220" role="img" aria-label="Bar chart of revenue won per month"></svg></div>
<div class="panel"><h2>Today's tasks</h2><ul class="tasks" id="tasks"></ul><form id="task-form" class="task-add"><label class="sr-only" for="task-in">New task</label><input id="task-in" placeholder="Add a task and press Enter"></form></div></section>
<section class="panel"><h2>Recently updated</h2><div id="recent" class="recent"></div></section></div>`,
    },
    "contacts.html": {
      title: "Contacts",
      body: `<div class="page"><div class="page-head"><h1>Contacts <span class="count" id="c-count"></span></h1><button class="btn" data-new-contact>+ New contact</button></div>
<div class="toolbar"><label class="sr-only" for="search">Search contacts</label><input id="search" type="search" placeholder="Search name, company or email…"><label>Stage <select id="stage-filter"><option value="">All stages</option><option>Lead</option><option>Qualified</option><option>Proposal</option><option>Won</option><option>Lost</option></select></label></div>
<div class="table-wrap"><table class="table"><thead><tr><th><button data-sort="name">Name</button></th><th><button data-sort="company">Company</button></th><th>Stage</th><th><button data-sort="value">Deal value</button></th><th><button data-sort="updated">Last activity</button></th></tr></thead><tbody id="rows"></tbody></table></div>
<p class="muted empty" hidden>No contacts match.</p></div>`,
    },
    "pipeline.html": {
      title: "Pipeline",
      body: `<div class="page"><div class="page-head"><div><h1>Sales pipeline</h1><p class="muted">Drag deals between stages, or use the stage menu on each card.</p></div><p class="pipe-total" id="pipe-total"></p></div><div class="board" id="board"></div></div>`,
    },
    "contact.html": {
      title: "Contact",
      body: `<div class="page"><p><a href="contacts.html" class="back">← All contacts</a></p><div id="contact"></div></div>`,
    },
  },
  css: `
:root{--bg:#f5f6f8;--panel:#fff;--ink:#1b1f2a;--muted:#6a7183;--line:#e4e7ee;--brand:#3b5bdb;--lead:#94a3b8;--qualified:#3b82f6;--proposal:#f59e0b;--won:#16a34a;--lost:#dc2626}
body{background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
h1{font-size:26px;font-weight:700;letter-spacing:-.4px}h2{font-size:16px;font-weight:700;margin-bottom:14px}
.site-header{background:#141a2e;color:#fff;position:sticky;top:0;z-index:10}.head{display:flex;align-items:center;gap:30px;height:60px;padding:0 20px;position:relative}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;text-decoration:none;font-size:18px}.logo span{width:30px;height:30px;border-radius:8px;background:var(--brand);display:grid;place-items:center}
.site-nav{display:flex;gap:4px}.site-nav a{text-decoration:none;color:#aab3cc;padding:8px 14px;border-radius:8px;font-weight:600}.site-nav a[aria-current]{background:#ffffff14;color:#fff}.site-nav.open{background:#141a2e}
.me{margin-left:auto;display:flex;gap:12px;align-items:center}.avatar{width:34px;height:34px;border-radius:50%;background:#f59e0b;color:#141a2e;display:grid;place-items:center;font-weight:800;font-size:13px}
.btn{display:inline-flex;align-items:center;gap:6px;background:var(--brand);color:#fff;border:0;border-radius:8px;padding:10px 16px;font-weight:700;text-decoration:none}.btn:hover{background:#3049b8}.btn.small{padding:7px 12px;font-size:14px}.btn.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
.page{padding:26px 24px 50px;max-width:1400px;margin:auto}.page-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:22px}.muted{color:var(--muted)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}.kpi{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:18px}.kpi small{color:var(--muted);font-weight:600}.kpi strong{display:block;font-size:28px;letter-spacing:-.5px}.kpi em{font-style:normal;font-size:13px;font-weight:700;color:var(--won)}
.grid2{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;margin-bottom:16px}.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:20px}
#chart{width:100%;height:auto}#chart text{font-size:12px;fill:var(--muted)}#chart rect{fill:var(--brand);rx:6px}#chart rect:hover{fill:#5b78ea}
.tasks{list-style:none;margin:0;padding:0;display:grid;gap:4px}.tasks li{display:flex;gap:10px;align-items:center;padding:8px;border-radius:8px}.tasks li:hover{background:var(--bg)}.tasks input{width:18px;height:18px;accent-color:var(--won)}.tasks .done span{text-decoration:line-through;color:var(--muted)}.tasks small{margin-left:auto;color:var(--muted)}
.task-add input{width:100%;margin-top:10px;border:1px dashed var(--line);border-radius:8px;padding:10px}
.recent{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}.rc{display:flex;gap:10px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:10px;text-decoration:none}.rc:hover{border-color:var(--brand)}.rc small{display:block;color:var(--muted)}
.ini{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0}
.stage{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:700;color:#fff}.st-Lead{background:var(--lead)}.st-Qualified{background:var(--qualified)}.st-Proposal{background:var(--proposal)}.st-Won{background:var(--won)}.st-Lost{background:var(--lost)}
.count{font-size:16px;color:var(--muted);font-weight:500}.toolbar{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px}.toolbar input{flex:1;min-width:220px}
input,select{border:1px solid var(--line);border-radius:8px;padding:9px 12px;background:#fff}input:focus,select:focus{outline:2px solid #3b5bdb55;border-color:var(--brand)}
.table-wrap{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow-x:auto}.table{width:100%;border-collapse:collapse;min-width:680px}
.table th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);padding:12px 16px;border-bottom:1px solid var(--line)}.table th button{border:0;background:none;font:inherit;color:inherit;text-transform:inherit;padding:0}.table th button::after{content:" ↕";opacity:.4}
.table td{padding:12px 16px;border-bottom:1px solid var(--line)}.table tr:hover td{background:#f9fafc}.table td a{display:flex;gap:10px;align-items:center;text-decoration:none;font-weight:600}.table td small{display:block;color:var(--muted);font-weight:400}
.empty{padding:20px}
.board{display:grid;grid-template-columns:repeat(5,minmax(220px,1fr));gap:14px;overflow-x:auto;padding-bottom:10px}
.col{background:#eceef3;border-radius:12px;padding:12px;min-height:420px;display:flex;flex-direction:column;gap:10px;transition:background .15s}.col.over{background:#dfe5fb;outline:2px dashed var(--brand)}
.col h2{display:flex;justify-content:space-between;align-items:center;margin:0 0 4px;font-size:14px}.col h2 span{font-weight:500;color:var(--muted);font-size:13px}.col h2::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--c);margin-right:8px}
.col h2 b{display:flex;align-items:center;margin-right:auto}
.deal{background:#fff;border-radius:10px;padding:12px;border:1px solid var(--line);cursor:grab;display:grid;gap:6px;box-shadow:0 1px 2px #0000000d}.deal.dragging{opacity:.5}.deal a{font-weight:700;text-decoration:none}.deal small{color:var(--muted)}.deal .row{display:flex;justify-content:space-between;align-items:center;gap:8px}.deal select{padding:3px 6px;font-size:12px}
.pipe-total{font-weight:700}
.profile{display:grid;grid-template-columns:320px 1fr;gap:16px;align-items:start}.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:22px;display:grid;gap:12px}
.card .ini{width:72px;height:72px;font-size:24px}.facts{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0}.facts dt{color:var(--muted)}.facts dd{margin:0;font-weight:600;word-break:break-word}
.timeline{list-style:none;padding:0;margin:0;display:grid;gap:0}.timeline li{display:grid;grid-template-columns:30px 1fr;gap:10px;padding:12px 0;border-bottom:1px solid var(--line)}.timeline .ic{width:30px;height:30px;border-radius:50%;background:var(--bg);display:grid;place-items:center}.timeline small{color:var(--muted)}
.note-form{display:grid;gap:8px;margin-bottom:10px}.note-form textarea{border:1px solid var(--line);border-radius:8px;padding:10px;resize:vertical}.note-form div{display:flex;gap:8px;justify-content:flex-end}
.back{text-decoration:none;color:var(--muted);font-weight:600;display:inline-block;margin-bottom:14px}
dialog{border:0;border-radius:14px;padding:0;width:min(440px,calc(100% - 32px));box-shadow:0 30px 80px #0005}dialog::backdrop{background:#141a2e88}
#nc-form{display:grid;gap:12px;padding:24px}#nc-form label{display:grid;gap:4px;font-weight:600;font-size:14px}.dlg-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:6px}
.site-footer{text-align:center;color:var(--muted);font-size:13px;padding:20px}.linkish{border:0;background:none;color:var(--brand);text-decoration:underline}
@media(max-width:1000px){.kpis{grid-template-columns:1fr 1fr}.grid2,.profile{grid-template-columns:1fr}}
@media(max-width:760px){.me .btn{display:none}.page{padding:20px 14px}.board{grid-template-columns:repeat(5,82vw);scroll-snap-type:x mandatory}.col{scroll-snap-align:start}.kpis{grid-template-columns:1fr 1fr}.kpi strong{font-size:22px}}
`,
  js: `
(function(){
var C=concept;var STAGES=["Lead","Qualified","Proposal","Won","Lost"];var COLORS=["#3b5bdb","#0e9f6e","#d946ef","#f59e0b","#0891b2","#e11d48","#7c3aed","#65a30d"];
var SEED=[["Olivia Chen","Northwind Co.","olivia@northwind.example",24000,"Proposal",1],["Marcus Webb","Acme Studio","marcus@acme.example",8500,"Qualified",2],["Priya Shah","Little Bay Café","priya@littlebay.example",3200,"Won",3],["Tom Fletcher","Brightwire","tom@brightwire.example",12000,"Lead",1],
 ["Aisha Rahman","Peak Physio","aisha@peak.example",6400,"Proposal",4],["Ben Carter","Harbour & Co.","ben@harbour.example",18000,"Qualified",6],["Grace Kim","Offbeat Audio","grace@offbeat.example",42000,"Won",8],["Leo Rossi","Ember & Salt","leo@ember.example",5600,"Lead",2],
 ["Hannah Lee","Tallyflow","hannah@tallyflow.example",30000,"Proposal",5],["Sam Patel","Field Notes","sam@fieldnotes.example",2800,"Lost",12],["Zoe Martin","Greenline Freight","zoe@greenline.example",15500,"Lead",3],["Josh Nguyen","Summit Legal","josh@summit.example",21000,"Qualified",7]];
function seed(){return SEED.map(function(s,i){var d=new Date(Date.now()-s[5]*864e5);return {id:"c"+(i+1),name:s[0],company:s[1],email:s[2],value:s[3],stage:s[4],updated:d.toISOString(),color:COLORS[i%COLORS.length],
 notes:[{type:"call",text:"Intro call. Interested in a quote for Q1.",at:new Date(d.getTime()-3*864e5).toISOString()},{type:"email",text:"Sent proposal and pricing.",at:d.toISOString()}]};});}
var db=C.store.get("crm-data",null);if(!db){db={contacts:seed(),tasks:[{t:"Follow up with Olivia about proposal",d:false,due:"10:30"},{t:"Send contract to Grace",d:true,due:"11:00"},{t:"Prep demo for Hannah",d:false,due:"14:00"},{t:"Call Tom Fletcher",d:false,due:"16:00"}]};C.store.set("crm-data",db);}
function save(){C.store.set("crm-data",db);}
function ini(c){return '<span class="ini" style="background:'+c.color+'">'+c.name.split(" ").map(function(p){return p[0];}).join("").slice(0,2)+'</span>';}
function money(n){return "$"+Math.round(n).toLocaleString("en-AU");}
function ago(iso){var d=Math.round((Date.now()-new Date(iso))/864e5);return d<=0?"Today":d===1?"Yesterday":d+" days ago";}
function stage(s){return '<span class="stage st-'+s+'">'+s+'</span>';}
function byId(id){return db.contacts.filter(function(c){return c.id===id;})[0];}
function touch(c,note){c.updated=new Date().toISOString();if(note)c.notes.push({type:"update",text:note,at:c.updated});save();}
// New contact dialog (all pages)
var dlg=document.getElementById("new-contact"),ncf=document.getElementById("nc-form");
document.addEventListener("click",function(e){if(e.target.closest("[data-new-contact]")){ncf.reset();dlg.showModal();}if(e.target.closest("[data-close]"))dlg.close();});
ncf.addEventListener("submit",function(e){if(!C.validate(ncf)){e.preventDefault();return;}var f=new FormData(ncf);var c={id:"c"+Date.now(),name:f.get("name"),company:f.get("company"),email:f.get("email"),value:+f.get("value")||0,stage:f.get("stage"),updated:new Date().toISOString(),color:COLORS[db.contacts.length%COLORS.length],notes:[{type:"update",text:"Contact created",at:new Date().toISOString()}]};
 db.contacts.unshift(c);save();C.toast(c.name+" added");setTimeout(function(){location.href="contact.html?id="+c.id;},500);});
document.getElementById("reset-data").addEventListener("click",function(){if(confirm("Reset all demo data?")){C.store.set("crm-data",null);location.reload();}});
// Dashboard
if(document.getElementById("kpis")){var h=new Date().getHours();document.getElementById("greet").textContent=h<12?"morning":h<17?"afternoon":"evening";document.getElementById("today").textContent=new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});
 var open=db.contacts.filter(function(c){return ["Lead","Qualified","Proposal"].indexOf(c.stage)>=0;});var won=db.contacts.filter(function(c){return c.stage==="Won";});var closed=db.contacts.filter(function(c){return c.stage==="Won"||c.stage==="Lost";});
 document.getElementById("kpis").innerHTML=[["Open pipeline",money(open.reduce(function(a,c){return a+c.value;},0)),open.length+" deals"],["Won this quarter",money(won.reduce(function(a,c){return a+c.value;},0)),"▲ 18% vs last"],["Win rate",(closed.length?Math.round(won.length/closed.length*100):0)+"%",won.length+" of "+closed.length+" closed"],["Contacts",db.contacts.length,"+3 this week"]].map(function(k){return '<div class="kpi"><small>'+k[0]+'</small><strong>'+k[1]+'</strong><em>'+k[2]+'</em></div>';}).join("");
 var data=[["Jun",28],["Jul",34],["Aug",31],["Sep",46],["Oct",52],["Nov",Math.round(won.reduce(function(a,c){return a+c.value;},0)/1000)]];var max=Math.max.apply(null,data.map(function(d){return d[1];}))*1.15;
 document.getElementById("chart").innerHTML=data.map(function(d,i){var bh=d[1]/max*170,x=30+i*95;return '<rect x="'+x+'" y="'+(190-bh)+'" width="60" height="'+bh+'"><title>'+d[0]+": $"+d[1]+'k</title></rect><text x="'+(x+30)+'" y="210" text-anchor="middle">'+d[0]+'</text><text x="'+(x+30)+'" y="'+(182-bh)+'" text-anchor="middle">$'+d[1]+'k</text>';}).join("");
 function renderTasks(){document.getElementById("tasks").innerHTML=db.tasks.map(function(t,i){return '<li class="'+(t.d?"done":"")+'"><input type="checkbox" id="t'+i+'" data-i="'+i+'"'+(t.d?" checked":"")+'><label for="t'+i+'"><span>'+C.esc(t.t)+'</span></label><small>'+(t.due||"")+'</small></li>';}).join("");}
 renderTasks();document.getElementById("tasks").addEventListener("change",function(e){var i=e.target.dataset.i;if(i!==undefined){db.tasks[i].d=e.target.checked;save();renderTasks();}});
 document.getElementById("task-form").addEventListener("submit",function(e){e.preventDefault();var inp=document.getElementById("task-in");if(!inp.value.trim())return;db.tasks.push({t:inp.value.trim(),d:false,due:""});inp.value="";save();renderTasks();});
 document.getElementById("recent").innerHTML=db.contacts.slice().sort(function(a,b){return new Date(b.updated)-new Date(a.updated);}).slice(0,6).map(function(c){return '<a class="rc" href="contact.html?id='+c.id+'">'+ini(c)+'<span><strong>'+C.esc(c.name)+'</strong><small>'+C.esc(c.company)+' · '+ago(c.updated)+'</small></span></a>';}).join("");}
// Contacts table
var rows=document.getElementById("rows");
if(rows){var sortKey="updated",dir=-1,search=document.getElementById("search"),sf=document.getElementById("stage-filter");if(C.param("stage"))sf.value=C.param("stage");
 function render(){var q=search.value.toLowerCase();var list=db.contacts.filter(function(c){return (!sf.value||c.stage===sf.value)&&(c.name+c.company+c.email).toLowerCase().indexOf(q)>=0;});
  list.sort(function(a,b){var x=a[sortKey],y=b[sortKey];return (x>y?1:x<y?-1:0)*dir;});document.getElementById("c-count").textContent=list.length;document.querySelector(".empty").hidden=list.length>0;
  rows.innerHTML=list.map(function(c){return '<tr><td><a href="contact.html?id='+c.id+'">'+ini(c)+'<span>'+C.esc(c.name)+'<small>'+C.esc(c.email)+'</small></span></a></td><td>'+C.esc(c.company)+'</td><td>'+stage(c.stage)+'</td><td>'+money(c.value)+'</td><td>'+ago(c.updated)+'</td></tr>';}).join("");}
 search.addEventListener("input",render);sf.addEventListener("change",render);document.querySelector(".table thead").addEventListener("click",function(e){var b=e.target.closest("[data-sort]");if(!b)return;if(sortKey===b.dataset.sort)dir=-dir;else{sortKey=b.dataset.sort;dir=sortKey==="name"||sortKey==="company"?1:-1;}render();});render();}
// Pipeline board (drag and drop + keyboard-friendly stage menu)
var board=document.getElementById("board");
if(board){var colors={Lead:"var(--lead)",Qualified:"var(--qualified)",Proposal:"var(--proposal)",Won:"var(--won)",Lost:"var(--lost)"};
 function render(){board.innerHTML=STAGES.map(function(s){var list=db.contacts.filter(function(c){return c.stage===s;});return '<section class="col" data-stage="'+s+'" style="--c:'+colors[s]+'" aria-label="'+s+'"><h2><b>'+s+'</b><span>'+list.length+' · '+money(list.reduce(function(a,c){return a+c.value;},0))+'</span></h2>'+list.map(function(c){return '<article class="deal" draggable="true" data-id="'+c.id+'"><a href="contact.html?id='+c.id+'">'+C.esc(c.company)+'</a><small>'+C.esc(c.name)+'</small><div class="row"><strong>'+money(c.value)+'</strong><select aria-label="Move '+C.esc(c.company)+' to stage" data-move="'+c.id+'">'+STAGES.map(function(x){return '<option'+(x===s?" selected":"")+'>'+x+'</option>';}).join("")+'</select></div></article>';}).join("")+'</section>';}).join("");
  var open=db.contacts.filter(function(c){return ["Lead","Qualified","Proposal"].indexOf(c.stage)>=0;});document.getElementById("pipe-total").textContent="Open pipeline: "+money(open.reduce(function(a,c){return a+c.value;},0));}
 function move(id,s){var c=byId(id);if(c&&c.stage!==s){touch(c,"Moved from "+c.stage+" to "+s);c.stage=s;save();render();C.toast(c.company+" → "+s+(s==="Won"?" 🎉":""));}}
 board.addEventListener("dragstart",function(e){var d=e.target.closest(".deal");if(!d)return;e.dataTransfer.setData("text/plain",d.dataset.id);d.classList.add("dragging");});
 board.addEventListener("dragend",function(e){var d=e.target.closest(".deal");if(d)d.classList.remove("dragging");});
 board.addEventListener("dragover",function(e){var col=e.target.closest(".col");if(!col)return;e.preventDefault();board.querySelectorAll(".col").forEach(function(c){c.classList.toggle("over",c===col);});});
 board.addEventListener("dragleave",function(e){if(!board.contains(e.relatedTarget))board.querySelectorAll(".col").forEach(function(c){c.classList.remove("over");});});
 board.addEventListener("drop",function(e){var col=e.target.closest(".col");if(!col)return;e.preventDefault();move(e.dataTransfer.getData("text/plain"),col.dataset.stage);});
 board.addEventListener("change",function(e){if(e.target.dataset.move)move(e.target.dataset.move,e.target.value);});render();}
// Contact detail
var el=document.getElementById("contact");
if(el){var c=byId(C.param("id"))||db.contacts[0];document.title=c.name+" | Pipeline CRM";
 function render(){el.innerHTML='<div class="profile"><div class="card">'+ini(c)+'<h1>'+C.esc(c.name)+'</h1><p class="muted">'+C.esc(c.company)+'</p><dl class="facts"><dt>Email</dt><dd><a href="mailto:'+C.esc(c.email)+'">'+C.esc(c.email)+'</a></dd><dt>Deal</dt><dd>'+money(c.value)+'</dd><dt>Stage</dt><dd><select id="stage-sel" aria-label="Stage">'+STAGES.map(function(s){return '<option'+(s===c.stage?" selected":"")+'>'+s+'</option>';}).join("")+'</select></dd><dt>Updated</dt><dd>'+ago(c.updated)+'</dd></dl><a class="btn ghost" href="mailto:'+C.esc(c.email)+'">✉ Email '+C.esc(c.name.split(" ")[0])+'</a></div>'
  +'<div class="card"><h2>Activity</h2><form class="note-form" id="note-form"><label class="sr-only" for="note">Add a note</label><textarea id="note" rows="3" placeholder="Log a call, meeting or note…"></textarea><div><select id="note-type" aria-label="Activity type"><option value="note">📝 Note</option><option value="call">📞 Call</option><option value="email">✉️ Email</option><option value="meeting">🤝 Meeting</option></select><button class="btn">Add</button></div></form><ul class="timeline">'
  +c.notes.slice().reverse().map(function(n){return '<li><span class="ic" aria-hidden="true">'+({call:"📞",email:"✉️",meeting:"🤝",note:"📝",update:"↻"}[n.type]||"•")+'</span><span>'+C.esc(n.text)+'<br><small>'+new Date(n.at).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short"})+'</small></span></li>';}).join("")+'</ul></div></div>';
  document.getElementById("stage-sel").addEventListener("change",function(e){touch(c,"Moved from "+c.stage+" to "+e.target.value);c.stage=e.target.value;save();render();C.toast("Stage updated");});
  document.getElementById("note-form").addEventListener("submit",function(e){e.preventDefault();var t=document.getElementById("note").value.trim();if(!t)return;c.notes.push({type:document.getElementById("note-type").value,text:t,at:new Date().toISOString()});c.updated=new Date().toISOString();save();render();});}
 render();}
})();
`,
};
