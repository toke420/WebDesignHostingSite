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
