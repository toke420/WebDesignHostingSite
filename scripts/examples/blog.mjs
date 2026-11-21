import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Latest"],
  ["article.html?slug=slow-mornings", "Featured"],
  ["about.html", "About"],
  ["subscribe.html", "Subscribe"],
];

export default {
  id: "blog",
  name: "Field Notes",
  tagline: "Essays on design, slow travel and making things by hand.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html">Field Notes<span>Issue 48</span></a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
</div><div class="progress" aria-hidden="true"><i id="progress"></i></div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot"><p class="logo">Field Notes</p><p>An independent publication, written in Castlemaine, Victoria. New essays every second Sunday.</p><a href="subscribe.html">Subscribe →</a></div><p class="wrap fine">Design concept. Articles and authors are fictional samples.</p></footer>`,
  pages: {
    "index.html": {
      title: "Essays on design and slow living",
      body: `
<section class="wrap featured" id="featured"></section>
<section class="wrap list-head"><div class="chips" role="group" aria-label="Category"></div><label class="search"><span class="sr-only">Search articles</span><input type="search" id="q" placeholder="Search essays…"></label></section>
<section class="wrap articles" id="articles" aria-live="polite"></section>
<p class="wrap none" hidden>No essays match your search.</p>
<section class="wrap sub-band"><h2>A long read, every second Sunday.</h2><a class="btn" href="subscribe.html">Get the newsletter</a></section>`,
    },
    "article.html": {
      title: "Article",
      body: `<article class="post" id="post"></article><section class="wrap related"><h2>Keep reading</h2><div class="articles" id="related"></div></section>`,
    },
    "about.html": {
      title: "About",
      body: `<section class="wrap narrow about"><p class="eyebrow">About</p><h1>A slower kind of magazine.</h1><img src="/images/example-interior.webp" alt="A calm reading room with natural light">
<p class="lede">Field Notes began in 2021 as a letter to friends about the joys of doing things slowly. It now reaches 24,000 readers who'd rather read one good essay than skim fifty headlines.</p>
<p>We publish essays on design, craft, travel and the places we live. Every piece is edited by hand, never optimised for clicks, and free to read thanks to our paying members.</p>
<h2>Write for us</h2><p>We pay $0.80 per word for essays between 1,500 and 3,000 words. Send a short pitch and two writing samples to <a href="mailto:pitches@fieldnotes.example">pitches@fieldnotes.example</a>.</p></section>`,
    },
    "subscribe.html": {
      title: "Subscribe",
      body: `<section class="wrap narrow subscribe"><p class="eyebrow">Newsletter</p><h1>Essays worth your Sunday.</h1><p class="lede">One long read every second Sunday. No ads, no tracking pixels, unsubscribe in one click.</p>
<form id="sub" novalidate><label>First name<input name="first" required autocomplete="given-name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label>
<fieldset><legend>Topics you love</legend>${["Design","Craft","Travel","Places"].map(t=>`<label class="chk"><input type="checkbox" name="topics" value="${t}" checked> ${t}</label>`).join("")}</fieldset>
<fieldset><legend>Choose your plan</legend><label class="plan"><input type="radio" name="plan" value="free" checked><span><b>Free</b> Every essay by email</span></label><label class="plan"><input type="radio" name="plan" value="member"><span><b>Member · $6/month</b> Plus the printed annual and reader events</span></label></fieldset>
<button class="btn">Subscribe</button></form><div id="subbed" hidden tabindex="-1" class="subbed"><h2>Welcome aboard, <span id="sub-name"></span>.</h2><p>Your first issue would arrive this Sunday. (This is a design concept, so nothing is sent.)</p></div></section>`,
    },
  },
  css: `
:root{--paper:#f6f2ea;--ink:#1e1b17;--muted:#6b6358;--accent:#b0412e;--line:#ddd4c4}
body{background:var(--paper);color:var(--ink);font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
.site-nav,.eyebrow,.meta,.chips,.btn,.search,.concept-bar,label,legend,.fine{font-family:"Helvetica Neue",Arial,sans-serif}
h1,h2,h3{font-weight:400;letter-spacing:-.5px;line-height:1.12}h1{font-size:clamp(36px,5.5vw,64px)}h2{font-size:clamp(26px,3vw,34px)}
.wrap{width:min(1120px,calc(100% - 32px));margin:auto}.narrow{max-width:720px}
.site-header{background:var(--paper);border-bottom:1px solid var(--ink);position:sticky;top:0;z-index:10}.head{display:flex;align-items:center;justify-content:space-between;height:74px;position:relative}
.logo{font-size:28px;font-style:italic;text-decoration:none;display:flex;align-items:baseline;gap:12px}.logo span{font:600 11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;font-style:normal;color:var(--accent)}
.site-nav{display:flex;gap:26px;font-size:14px;text-transform:uppercase;letter-spacing:1.5px}.site-nav a{text-decoration:none;color:var(--muted)}.site-nav a[aria-current]{color:var(--ink);text-decoration:underline;text-underline-offset:6px}.site-nav.open{background:var(--paper);border-bottom:1px solid var(--ink)}
.progress{height:3px}.progress i{display:block;height:100%;width:0;background:var(--accent)}
.featured{display:grid;grid-template-columns:1.2fr 1fr;gap:40px;padding:50px 0;border-bottom:1px solid var(--line);align-items:center}.featured img{aspect-ratio:4/3;object-fit:cover;width:100%}
.featured h1 a{text-decoration:none}.featured h1 a:hover{color:var(--accent)}.excerpt{font-size:20px;color:var(--muted);margin:16px 0}
.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:12px}.meta{font-size:13px;color:var(--muted)}
.list-head{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;padding:30px 0 10px}
.chips{display:flex;gap:8px;flex-wrap:wrap}.chips button{border:1px solid var(--ink);background:none;border-radius:99px;padding:6px 14px;font-size:13px}.chips button[aria-pressed=true]{background:var(--ink);color:var(--paper)}
.search input{border:0;border-bottom:1px solid var(--ink);background:none;padding:8px 2px;width:240px}.search input:focus{outline:0;border-color:var(--accent)}
.articles{display:grid;grid-template-columns:repeat(3,1fr);gap:40px 30px;padding:30px 0 60px}.card{display:grid;gap:10px;align-content:start;text-decoration:none}.card img,.card .ph{aspect-ratio:3/2;object-fit:cover;width:100%}
.card h3{font-size:24px}.card:hover h3{color:var(--accent)}.card p{color:var(--muted)}
.ph{display:grid;place-items:center;font:italic 54px Georgia,serif;color:#fff8}
.none{padding-bottom:40px;color:var(--muted)}
.sub-band{border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);padding:50px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:60px}
.btn{display:inline-block;background:var(--ink);color:var(--paper);padding:13px 24px;text-decoration:none;font-weight:700;border:0;font-size:14px;letter-spacing:1px;text-transform:uppercase}.btn:hover{background:var(--accent)}
.post{padding:50px 0}.post header{width:min(760px,calc(100% - 32px));margin:auto;text-align:center;display:grid;gap:14px;justify-items:center}
.post .hero-img{width:min(1120px,calc(100% - 32px));margin:40px auto;aspect-ratio:21/9;object-fit:cover}
.post .body{width:min(680px,calc(100% - 32px));margin:auto;font-size:20px;line-height:1.75}.post .body p{margin-bottom:1.3em}.post .body p:first-child::first-letter{float:left;font-size:4.2em;line-height:.85;padding:6px 10px 0 0;color:var(--accent)}
.post blockquote{border-left:3px solid var(--accent);margin:1.5em 0;padding-left:24px;font-style:italic;font-size:26px;line-height:1.4}
.share{display:flex;gap:10px;justify-content:center;margin-top:20px;font:14px Arial,sans-serif}.share button{background:none;border:1px solid var(--line);padding:6px 12px}
.author{display:flex;gap:14px;align-items:center;border-top:1px solid var(--line);margin-top:40px;padding-top:24px;font-size:16px}.author .av{width:56px;height:56px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-style:italic;font-size:22px}
.related{border-top:1px solid var(--ink);padding-top:40px}
.about,.subscribe{padding:60px 0 80px;display:grid;gap:20px}.about img{margin:10px 0}.lede{font-size:22px;color:var(--muted)}.about a{color:var(--accent)}
#sub{display:grid;gap:16px;margin-top:10px}#sub label{display:grid;gap:6px;font-size:14px;font-weight:600}#sub input[type=email],#sub input[name=first]{border:1px solid var(--ink);background:#fff;padding:12px;font-size:16px}
fieldset{border:1px solid var(--line);padding:16px;display:flex;flex-wrap:wrap;gap:14px}legend{font-weight:700;font-size:14px}.chk{display:flex!important;align-items:center;gap:6px}
.plan{display:flex!important;gap:10px;align-items:flex-start;width:100%;font-weight:400!important}.plan b{display:block}.subbed{border:1px solid var(--ink);padding:30px}
.site-footer{border-top:1px solid var(--ink);padding:40px 0 20px}.foot{display:grid;grid-template-columns:1fr 2fr auto;gap:30px;align-items:center}.foot p{color:var(--muted)}.fine{font-size:12px;color:var(--muted);margin-top:24px}
@media(max-width:860px){.featured{grid-template-columns:1fr}.articles{grid-template-columns:1fr 1fr}.foot{grid-template-columns:1fr}}
@media(max-width:760px){.articles{grid-template-columns:1fr}.search input{width:100%}.search{width:100%}.post .body{font-size:18px}}
`,
  js: `
(function(){
var C=concept;
var A=[
 {slug:"slow-mornings",title:"The case for slow mornings",cat:"Places",author:"Ruth Callaghan",date:"2026-11-09",mins:9,img:"/images/example-interior.webp",excerpt:"What happened when I stopped checking my phone before 9am, and started noticing the light instead.",
  body:["For three years, the first thing I saw every morning was a glowing rectangle. Emails, headlines, other people's breakfasts. By the time I'd made coffee, my day already belonged to someone else.","Last autumn I tried an experiment: no screens until nine. The first week was oddly uncomfortable. The second week I started noticing how the light moved across the kitchen wall.","I'm not claiming a revolution. My inbox still fills up. But the hour before nine has become mine again, and the rest of the day feels a little less borrowed.","Slowness, it turns out, isn't about doing less. It's about choosing the order in which things get your attention."],quote:"Slowness isn't about doing less. It's about choosing what gets your attention first."},
 {slug:"high-country",title:"Walking the high country in winter",cat:"Travel",author:"Sam Okoro",date:"2026-10-26",mins:14,img:"/images/example-mountain.webp",excerpt:"Five days on the Alpine Walking Track, two pairs of wet socks and one perfect sunrise.",
  body:["The snow came earlier than forecast. By the second morning, the track markers were only visible as small orange flags in a field of white.","We walked in silence most days, partly from effort and partly because there was nothing that needed to be said.","On the fourth morning, the clouds broke open below us and the whole valley turned pink. I have never been colder or happier."],quote:"I have never been colder or happier."},
 {slug:"repair-cafe",title:"Inside Castlemaine's repair café",cat:"Craft",author:"Ruth Callaghan",date:"2026-10-12",mins:7,color:"#5b7a5a",excerpt:"Toasters, teddy bears and a 1974 sewing machine: a Saturday with the people who fix things.",
  body:["On the first Saturday of every month, the hall on Templeton Street fills with broken things and the people who love them.","There are no receipts or warranties here. Just a table of volunteers, a kettle and a shared belief that most things deserve a second chance."],quote:"Most things deserve a second chance."},
 {slug:"good-chairs",title:"What makes a good chair?",cat:"Design",author:"Lena Varga",date:"2026-09-28",mins:11,color:"#b0412e",excerpt:"A furniture maker on proportion, patience and why the best chairs disappear beneath you.",
  body:["A good chair is one you stop noticing. It takes your weight, supports your back and lets you forget it exists.","That invisibility is incredibly hard to design. It takes dozens of prototypes and a willingness to throw most of them away."],quote:"A good chair is one you stop noticing."},
 {slug:"small-towns",title:"Why small towns are having a moment",cat:"Places",author:"Sam Okoro",date:"2026-09-14",mins:12,color:"#3c5a78",excerpt:"Remote work, cheaper rents and a hunger for community are quietly reshaping regional Australia.",
  body:["Ten years ago, the main street had three empty shopfronts. Now there's a waiting list.","The newcomers are designers, nurses, coders and bakers, people who discovered they could keep their jobs and change their lives."],quote:"They could keep their jobs and change their lives."},
 {slug:"type-specimens",title:"A love letter to type specimens",cat:"Design",author:"Lena Varga",date:"2026-08-31",mins:6,color:"#8a6d3b",excerpt:"The humble printed sample sheet, and why designers still collect them.",
  body:["Before you could preview a typeface on screen, you chose it from a specimen: a printed sheet showing every letter, size and weight.","They were sales tools, but also small works of art, and I've been collecting them for fifteen years."],quote:"Small works of art, disguised as sales tools."},
 {slug:"sourdough",title:"Ten years of the same sourdough starter",cat:"Craft",author:"Ruth Callaghan",date:"2026-08-17",mins:8,color:"#a0672b",excerpt:"It has survived two house moves, one heatwave and a teenager. Notes on keeping something alive.",
  body:["My starter is older than my car. It has a name, a jar and a spot on the bench that nobody else is allowed to use.","Feeding it every morning has become a small ritual: flour, water, a stir, and a quiet check that something I care about is still alive."],quote:"A small daily ritual of care."}
];
function fmt(d){return new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});}
function pic(a,cls){return a.img?'<img src="'+a.img+'" alt="" class="'+(cls||"")+'" loading="lazy">':'<div class="ph '+(cls||"")+'" style="background:'+a.color+'" aria-hidden="true">'+a.title.charAt(0)+'</div>';}
function card(a){return '<a class="card" href="article.html?slug='+a.slug+'">'+pic(a)+'<span class="eyebrow">'+a.cat+'</span><h3>'+C.esc(a.title)+'</h3><p>'+C.esc(a.excerpt)+'</p><span class="meta">'+a.author+' · '+a.mins+' min read</span></a>';}
// Home
var feat=document.getElementById("featured");
if(feat){var f=A[0];feat.innerHTML='<a href="article.html?slug='+f.slug+'">'+pic(f)+'</a><div><p class="eyebrow">Featured · '+f.cat+'</p><h1><a href="article.html?slug='+f.slug+'">'+f.title+'</a></h1><p class="excerpt">'+f.excerpt+'</p><p class="meta">By '+f.author+' · '+fmt(f.date)+' · '+f.mins+' min read</p></div>';
 var cats=["All"].concat(A.map(function(a){return a.cat;}).filter(function(c,i,s){return s.indexOf(c)===i;}));var chips=document.querySelector(".chips");var q=document.getElementById("q");var cur=C.param("cat")||"All";
 chips.innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c===cur)+'" data-c="'+c+'">'+c+'</button>';}).join("");
 function render(){var s=q.value.toLowerCase();var list=A.slice(1).filter(function(a){return (cur==="All"||a.cat===cur)&&(a.title+a.excerpt+a.author).toLowerCase().indexOf(s)>=0;});document.getElementById("articles").innerHTML=list.map(card).join("");document.querySelector(".none").hidden=list.length>0;}
 chips.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cur=b.dataset.c;chips.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});render();});q.addEventListener("input",render);render();}
// Article
var post=document.getElementById("post");
if(post){var a=A.filter(function(x){return x.slug===C.param("slug");})[0]||A[0];document.title=a.title+" | Field Notes";
 var body=a.body.map(function(p,i){return (i===2?'<blockquote>'+a.quote+'</blockquote>':'')+'<p>'+C.esc(p)+'</p>';}).join("");
 post.innerHTML='<header><a class="eyebrow" href="index.html?cat='+a.cat+'">'+a.cat+'</a><h1>'+a.title+'</h1><p class="excerpt">'+a.excerpt+'</p><p class="meta">By '+a.author+' · '+fmt(a.date)+' · '+a.mins+' min read</p></header>'+pic(a,"hero-img")+'<div class="body">'+body+'<div class="share"><button data-share>Copy link</button><button onclick="window.print()">Print</button></div><div class="author"><span class="av">'+a.author.charAt(0)+'</span><span><strong>'+a.author+'</strong><br>Contributing writer at Field Notes.</span></div></div>';
 post.querySelector("[data-share]").addEventListener("click",function(e){(navigator.clipboard?navigator.clipboard.writeText(location.href):Promise.reject()).then(function(){C.toast("Link copied");},function(){C.toast(location.href);});});
 document.getElementById("related").innerHTML=A.filter(function(x){return x!==a;}).sort(function(x,y){return (y.cat===a.cat)-(x.cat===a.cat);}).slice(0,3).map(card).join("");
 var bar=document.getElementById("progress");addEventListener("scroll",function(){var b=post.querySelector(".body").getBoundingClientRect();var p=Math.min(1,Math.max(0,-b.top/(b.height-innerHeight*.6)));bar.style.width=(p*100)+"%";},{passive:true});}
// Subscribe
var sub=document.getElementById("sub");if(sub)sub.addEventListener("submit",function(e){e.preventDefault();if(!C.validate(sub))return;document.getElementById("sub-name").textContent=sub.first.value;sub.hidden=true;var d=document.getElementById("subbed");d.hidden=false;d.focus();});
})();
`,
};
