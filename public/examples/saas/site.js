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
 su.password.addEventListener("input",function(){var v=su.password.value,s=0;if(v.length>=10)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v)||v.length>=16)s++;
  var m=document.getElementById("meter");m.style.width=(s*25)+"%";m.style.background=["#ff5c7a","#ff5c7a","#ffb84d","#9be36b","#6be3a4"][s];document.getElementById("strength-text").textContent=["At least 10 characters.","Weak","Okay","Good","Strong"][s];});
 function done(){su.hidden=li.hidden=true;document.querySelector(".auth-tabs").hidden=true;var w=document.getElementById("welcome");w.hidden=false;w.focus();}
 su.addEventListener("submit",function(e){e.preventDefault();if(C.validate(su))done();});li.addEventListener("submit",function(e){e.preventDefault();if(C.validate(li))done();});
 document.getElementById("forgot").addEventListener("click",function(e){e.preventDefault();C.toast("We'd email you a reset link (demo).");});}
})();
