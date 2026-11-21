(function(){
var C=concept;
var T=[["physio","Physiotherapy","Initial assessment",60,115,"Assessment, diagnosis and a hands-on treatment plan for pain or injury."],["physio-f","Physiotherapy","Follow-up",30,89,"Ongoing treatment and exercise progression."],["sports","Sports injury","Sports assessment",45,105,"Return-to-sport testing, taping and load management."],["pilates","Clinical Pilates","1:1 session",55,95,"Physio-led reformer Pilates for rehab and strength."],["pilates-g","Clinical Pilates","Small group (max 4)",55,42,"Equipment classes tailored to each person."],["massage","Remedial massage","Remedial massage",60,110,"Deep tissue and trigger point work for tight muscles."],["dry","Dry needling","Add-on",15,25,"Added to a physio session where clinically appropriate."]];
var TEAM=[["sarah","Dr Sarah Nguyen","Principal Physiotherapist","Sports & running injuries, ACL rehab","SN","#2c7a7b",["physio","physio-f","sports","dry"]],["james","James Whitford","Physiotherapist","Back & neck pain, desk workers","JW","#4a6fa5",["physio","physio-f","dry"]],["aroha","Aroha Tane","Pilates Physiotherapist","Pre/post-natal, Clinical Pilates","AT","#b5838d",["pilates","pilates-g","physio-f"]],["leo","Leo Marchetti","Remedial Massage Therapist","Sports massage, myofascial release","LM","#6d597a",["massage"]]];
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
