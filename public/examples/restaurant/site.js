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
