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
