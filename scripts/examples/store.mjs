import { navLinks } from "./lib.mjs";

const nav = [
  ["index.html", "Home"],
  ["shop.html", "Shop"],
  ["about.html", "Our story"],
];

export default {
  id: "store",
  name: "Offbeat Audio",
  tagline: "Headphones and speakers designed for everyday listening.",
  header: (file) => `<header class="site-header"><div class="wrap head">
<a class="logo" href="index.html">offbeat<sup>®</sup></a>
<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
<nav id="nav" class="site-nav" aria-label="Main">${navLinks(nav, file)}</nav>
<a class="cart-link" href="cart.html" aria-label="Cart">Cart <span class="cart-count" aria-live="polite">0</span></a>
</div></header>`,
  footer: () => `<footer class="site-footer"><div class="wrap foot">
<p class="logo">offbeat<sup>®</sup></p>
<div><strong>Shop</strong><a href="shop.html?cat=headphones">Headphones</a><a href="shop.html?cat=earbuds">Earbuds</a><a href="shop.html?cat=speakers">Speakers</a></div>
<div><strong>Help</strong><a href="about.html#shipping">Shipping</a><a href="about.html#returns">Returns</a><a href="about.html">Our story</a></div>
<form class="mini-sub" onsubmit="event.preventDefault();concept.toast('Thanks! You’re on the list.');this.reset()"><label for="sub">Get 10% off your first order</label><div><input id="sub" type="email" required placeholder="you@email.com"><button>Join</button></div></form>
</div><p class="wrap fine">Design concept. No products are for sale and no payments are taken.</p></footer>`,
  pages: {
    "index.html": {
      title: "Headphones & speakers",
      body: `
<section class="hero"><div class="wrap hero-grid">
  <div><p class="tag">New · Drift 2 wireless</p><h1>Find your own frequency.</h1><p class="lead">Warm sound, soft materials and 40 hours of battery. Headphones that feel as good as they sound.</p>
  <div class="actions"><a class="btn" href="product.html?id=drift-2">Shop Drift 2 · $349</a><a class="btn ghost" href="shop.html">Browse all</a></div></div>
  <img src="/images/example-headphones.webp" alt="Cream Drift 2 headphones on a terracotta background">
</div></section>
<section class="perks wrap"><span>Free shipping over $150</span><span>60-night trial</span><span>2-year warranty</span><span>Carbon-neutral delivery</span></section>
<section class="section wrap"><div class="section-head"><h2>Bestsellers</h2><a href="shop.html">View all →</a></div><div class="grid" data-products="featured"></div></section>
<section class="section wrap cats">
  <a href="shop.html?cat=headphones" class="cat c1"><span>Headphones</span></a>
  <a href="shop.html?cat=earbuds" class="cat c2"><span>Earbuds</span></a>
  <a href="shop.html?cat=speakers" class="cat c3"><span>Speakers</span></a>
</section>
<section class="section wrap quote"><p>“The most comfortable headphones I've owned. I forget I'm wearing them.”</p><span>★★★★★ · Jess, verified buyer</span></section>`,
    },
    "shop.html": {
      title: "Shop all",
      body: `
<section class="wrap shop-head"><h1>Shop all</h1><p class="lead" id="result-count"></p></section>
<section class="wrap shop">
  <aside class="filters" aria-label="Filters">
    <fieldset><legend>Category</legend>
      <label><input type="radio" name="cat" value="all" checked> All</label>
      <label><input type="radio" name="cat" value="headphones"> Headphones</label>
      <label><input type="radio" name="cat" value="earbuds"> Earbuds</label>
      <label><input type="radio" name="cat" value="speakers"> Speakers</label>
    </fieldset>
    <fieldset><legend>Max price</legend><input type="range" id="max-price" min="50" max="500" step="10" value="500" aria-describedby="max-label"><output id="max-label">$500</output></fieldset>
    <label class="check"><input type="checkbox" id="in-stock"> In stock only</label>
  </aside>
  <div><div class="toolbar"><label>Sort by <select id="sort"><option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="new">Newest</option></select></label></div>
  <div class="grid" data-products="all"></div><p class="empty" hidden>No products match. Try widening the filters.</p></div>
</section>`,
    },
    "product.html": {
      title: "Product",
      body: `<section class="wrap product" id="product" aria-live="polite"></section>
<section class="section wrap"><h2>You might also like</h2><div class="grid" data-products="related"></div></section>`,
    },
    "cart.html": {
      title: "Your cart",
      body: `<section class="wrap cart-page"><h1>Your cart</h1><div id="cart"></div></section>`,
    },
    "checkout.html": {
      title: "Checkout",
      body: `<section class="wrap checkout">
<form id="checkout" novalidate>
  <h1>Checkout</h1>
  <fieldset><legend>Contact</legend><label>Email<input type="email" name="email" required autocomplete="email"></label></fieldset>
  <fieldset><legend>Delivery</legend>
    <div class="row"><label>First name<input name="first" required autocomplete="given-name"></label><label>Last name<input name="last" required autocomplete="family-name"></label></div>
    <label>Address<input name="address" required autocomplete="street-address"></label>
    <div class="row three"><label>Suburb<input name="suburb" required></label><label>State<select name="state"><option>VIC</option><option>NSW</option><option>QLD</option><option>SA</option><option>WA</option><option>TAS</option><option>ACT</option><option>NT</option></select></label><label>Postcode<input name="postcode" required pattern="\\d{4}" inputmode="numeric"></label></div>
  </fieldset>
  <fieldset><legend>Shipping</legend>
    <label class="radio"><input type="radio" name="ship" value="0" checked> Standard (3–6 days) <b data-ship-label>Free over $150</b></label>
    <label class="radio"><input type="radio" name="ship" value="14.95"> Express (1–2 days) <b>$14.95</b></label>
  </fieldset>
  <fieldset><legend>Payment</legend><p class="notice">Payments are disabled in this design concept. A real store would show a secure card form or Apple Pay / Google Pay here.</p></fieldset>
  <button class="btn wide" type="submit">Place demo order</button>
</form>
<aside class="summary" id="summary"></aside>
</section>
<section class="wrap confirm" id="confirm" hidden tabindex="-1"><h1>Order confirmed 🎉</h1><p>Order <strong id="order-no"></strong>. In a real store you'd now receive an email receipt and tracking link.</p><a class="btn" href="shop.html">Keep shopping</a></section>`,
    },
    "about.html": {
      title: "Our story",
      body: `<section class="wrap about"><p class="tag">Our story</p><h1>Designed in Melbourne. Made to last.</h1>
<div class="about-grid"><img src="/images/example-headphones.webp" alt="Headphones detail"><div>
<p class="lead">Offbeat started in a Brunswick garage in 2019 with a simple idea: headphones should be repairable, comfortable all day and sound like the studio intended.</p>
<p>Every pair uses replaceable ear cushions, a user-swappable battery and recycled aluminium. When something wears out, we sell the part, not a new pair.</p></div></div>
<h2 id="shipping">Shipping</h2><p>Free standard shipping on orders over $150 within Australia. Express delivery is $14.95. We ship to New Zealand for a flat $19.</p>
<h2 id="returns">Returns</h2><p>Try anything for 60 nights. If it's not right, send it back for a full refund. Return shipping is on us.</p></section>`,
    },
  },
  css: `
:root{--bg:#f4efe7;--ink:#2b211c;--terra:#c8553d;--muted:#7a6b62;--card:#fffaf3}
body{background:var(--bg);color:var(--ink);font-family:"Avenir Next","Helvetica Neue",Arial,sans-serif}
h1,h2{letter-spacing:-1px;line-height:1.05;font-weight:700}h1{font-size:clamp(38px,6vw,72px)}h2{font-size:clamp(26px,3vw,38px)}
.wrap{width:min(1200px,calc(100% - 32px));margin:auto}
.site-header{position:sticky;top:0;z-index:10;background:#f4efe7ee;backdrop-filter:blur(8px);border-bottom:1px solid #2b211c14}
.head{display:flex;align-items:center;gap:30px;height:72px;position:relative}.logo{font-size:24px;font-weight:800;letter-spacing:-1.5px;text-decoration:none}
.site-nav{display:flex;gap:28px;margin-right:auto}.site-nav a{text-decoration:none;color:var(--muted)}.site-nav a[aria-current]{color:var(--ink);font-weight:700}
.site-nav.open{background:var(--bg)}
.cart-link{text-decoration:none;font-weight:700;display:flex;gap:8px;align-items:center}
.cart-count{background:var(--terra);color:#fff;border-radius:99px;min-width:24px;height:24px;display:grid;place-items:center;font-size:13px;padding:0 6px}
.btn{display:inline-block;background:var(--ink);color:var(--bg);padding:14px 24px;border-radius:99px;text-decoration:none;font-weight:700;border:2px solid var(--ink)}
.btn:hover{background:var(--terra);border-color:var(--terra)}.btn.ghost{background:transparent;color:var(--ink)}.btn.wide{width:100%}
.tag{text-transform:uppercase;letter-spacing:2px;font-size:12px;font-weight:700;color:var(--terra);margin-bottom:16px}
.lead{font-size:18px;color:var(--muted);margin-top:16px;max-width:520px}
.hero{padding:50px 0}.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}.hero img{border-radius:24px;aspect-ratio:1;object-fit:cover}
.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.perks{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:20px 0;border-top:1px solid #2b211c1f;border-bottom:1px solid #2b211c1f;font-weight:600;font-size:14px}
.section{padding:70px 0}.section-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:24px}.section-head a{font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:22px}
.product-card{background:var(--card);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;text-decoration:none;transition:transform .2s}
.product-card:hover{transform:translateY(-4px)}
.thumb{aspect-ratio:1;position:relative;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}
.badge{position:absolute;top:12px;left:12px;background:#fff;border-radius:99px;padding:4px 10px;font-size:12px;font-weight:700}
.badge.out{background:var(--ink);color:#fff}
.pc-body{padding:16px 18px 18px;display:grid;gap:4px}.pc-body .kind{font-size:12px;color:var(--muted);text-transform:capitalize}.pc-row{display:flex;justify-content:space-between;align-items:center;margin-top:8px}
.pc-row button{border:0;background:var(--ink);color:#fff;border-radius:99px;padding:8px 14px;font-weight:700;font-size:13px}.pc-row button:disabled{opacity:.4}
.stars{color:#d4891e;font-size:13px}
.cats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.cat{height:260px;border-radius:20px;display:flex;align-items:flex-end;padding:24px;text-decoration:none;font-size:26px;font-weight:800;color:#fff}
.c1{background:linear-gradient(140deg,#c8553d,#7c2e1f)}.c2{background:linear-gradient(140deg,#4a6b5d,#1f342b)}.c3{background:linear-gradient(140deg,#d9a441,#8a5a12)}
.quote{text-align:center}.quote p{font-size:clamp(24px,3vw,36px);font-weight:700;letter-spacing:-.5px;max-width:800px;margin:auto}.quote span{display:block;margin-top:14px;color:var(--muted)}
.shop-head{padding:40px 0 10px}.shop{display:grid;grid-template-columns:220px 1fr;gap:34px;padding-bottom:60px}
.filters{display:grid;gap:22px;align-content:start;position:sticky;top:90px}fieldset{border:0;padding:0;margin:0;display:grid;gap:8px}legend{font-weight:800;margin-bottom:8px}
.filters label{display:flex;gap:8px;align-items:center;cursor:pointer}.toolbar{display:flex;justify-content:flex-end;margin-bottom:16px}
select,input{border:1px solid #2b211c33;border-radius:10px;padding:10px 12px;background:#fff}.empty{padding:40px;text-align:center;color:var(--muted)}
.product{display:grid;grid-template-columns:1.1fr .9fr;gap:50px;padding:40px 0}.product .gallery{border-radius:24px;overflow:hidden;aspect-ratio:1}.product .gallery img{width:100%;height:100%;object-fit:cover}
.product .info{display:grid;gap:16px;align-content:start}.product .price{font-size:28px;font-weight:800}
.swatches{display:flex;gap:10px}.swatches button{width:38px;height:38px;border-radius:50%;border:3px solid transparent;box-shadow:inset 0 0 0 2px #fff}.swatches button[aria-pressed=true]{border-color:var(--ink)}
.qty{display:inline-flex;border:1px solid #2b211c33;border-radius:99px;overflow:hidden}.qty button{width:42px;border:0;background:#fff;font-size:18px}.qty input{width:50px;text-align:center;border:0;border-radius:0}
.specs{display:grid;grid-template-columns:auto 1fr;gap:6px 20px;margin:0}.specs dt{font-weight:700}.specs dd{margin:0;color:var(--muted)}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--muted)}
.cart-page{padding:40px 0 70px}.line{display:grid;grid-template-columns:90px 1fr auto auto;gap:18px;align-items:center;padding:18px 0;border-bottom:1px solid #2b211c1a}
.line img{border-radius:12px;aspect-ratio:1;object-fit:cover}.line .remove{border:0;background:none;color:var(--terra);font-weight:700}
.totals{margin-left:auto;max-width:360px;display:grid;gap:10px;margin-top:24px}.totals div{display:flex;justify-content:space-between}.totals .grand{font-size:22px;font-weight:800;border-top:2px solid var(--ink);padding-top:10px}
.free-ship{background:#fff;border-radius:12px;padding:12px 16px;margin-top:20px}.free-ship progress{width:100%;accent-color:var(--terra)}
.checkout{display:grid;grid-template-columns:1.2fr .8fr;gap:40px;padding:40px 0 70px;align-items:start}
#checkout{display:grid;gap:22px}#checkout fieldset{background:var(--card);padding:20px;border-radius:16px}#checkout label{display:grid;gap:4px;font-weight:600;font-size:14px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.row.three{grid-template-columns:2fr 1fr 1fr}.radio{display:flex!important;grid-template-columns:none;align-items:center;gap:10px!important}.radio b{margin-left:auto}
.notice{background:#fff3d6;border-radius:10px;padding:12px;font-size:14px}
.summary{background:var(--card);border-radius:16px;padding:22px;position:sticky;top:90px;display:grid;gap:10px}.summary .mini{display:flex;justify-content:space-between;gap:10px;font-size:14px}
.confirm{padding:80px 0;text-align:center;display:grid;gap:16px;justify-items:center}
.about{padding:50px 0 70px;display:grid;gap:18px;max-width:900px}.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;margin:20px 0}.about-grid img{border-radius:20px}
.site-footer{background:var(--ink);color:#d8cfc7;padding:50px 0 20px}.foot{display:grid;grid-template-columns:1fr 1fr 1fr 1.5fr;gap:30px}.foot div{display:grid;gap:8px;align-content:start}.foot a{text-decoration:none;color:#b8ada4}.foot strong{color:#fff}
.site-footer .logo{color:#fff}.mini-sub{display:grid;gap:8px}.mini-sub div{display:flex;gap:8px}.mini-sub input{flex:1;min-width:0}.mini-sub button{border:0;border-radius:10px;background:var(--terra);color:#fff;font-weight:700;padding:0 16px}
.fine{font-size:12px;color:#8f847b;margin-top:30px}
@media(max-width:860px){.hero-grid,.product,.checkout,.about-grid{grid-template-columns:1fr}.shop{grid-template-columns:1fr}.filters{position:static;grid-template-columns:1fr 1fr}.foot{grid-template-columns:1fr 1fr}.cats{grid-template-columns:1fr}.cat{height:150px}}
@media(max-width:760px){.head{gap:12px}.site-nav{margin:0}.cart-link{margin-left:auto}.line{grid-template-columns:64px 1fr;}.line .line-price{grid-column:2}.row,.row.three{grid-template-columns:1fr}.summary{position:static}.foot{grid-template-columns:1fr}.foot>*{min-width:0}}
`,
  js: `
(function(){
var P=[
 {id:"drift-2",name:"Drift 2",kind:"headphones",price:349,rating:4.8,reviews:412,hue:0,bg:"#c8553d",stock:true,new:true,pop:10,desc:"Our flagship wireless over-ears with adaptive noise cancelling and 40-hour battery."},
 {id:"drift-2-sand",name:"Drift 2 Sand",kind:"headphones",price:349,rating:4.8,reviews:120,hue:40,bg:"#b98d5a",stock:true,pop:7,desc:"The Drift 2 in a sandstone finish with oat ear cushions."},
 {id:"loop",name:"Loop",kind:"headphones",price:189,rating:4.5,reviews:233,hue:180,bg:"#4a6b5d",stock:true,pop:8,desc:"Lightweight on-ears that fold flat. 30 hours of playback."},
 {id:"loop-kids",name:"Loop Junior",kind:"headphones",price:79,rating:4.6,reviews:98,hue:260,bg:"#7d6bb3",stock:false,pop:3,desc:"Volume-limited headphones sized for smaller heads."},
 {id:"pebble",name:"Pebble Buds",kind:"earbuds",price:229,rating:4.7,reviews:301,hue:120,bg:"#6c8b4f",stock:true,new:true,pop:9,desc:"True wireless earbuds with a pocketable stone-shaped case."},
 {id:"pebble-sport",name:"Pebble Sport",kind:"earbuds",price:199,rating:4.4,reviews:87,hue:300,bg:"#9b4a72",stock:true,pop:5,desc:"Sweat-proof fit with wing tips for running and the gym."},
 {id:"hearth",name:"Hearth Speaker",kind:"speakers",price:449,rating:4.9,reviews:156,hue:20,bg:"#d9a441",stock:true,pop:6,desc:"Room-filling stereo sound in a wool-wrapped cabinet."},
 {id:"hearth-mini",name:"Hearth Mini",kind:"speakers",price:149,rating:4.6,reviews:205,hue:200,bg:"#3f6f8f",stock:true,pop:4,desc:"A portable speaker with 18-hour battery and a leather strap."}
];
var colours=[["Terracotta",0],["Sage",150],["Midnight",220]];
var C=concept,store=C.store;
function cart(){return store.get("offbeat-cart",[]);}
function saveCart(c){store.set("offbeat-cart",c);count();}
function count(){var n=cart().reduce(function(a,l){return a+l.qty;},0);document.querySelectorAll(".cart-count").forEach(function(e){e.textContent=n;});}
function find(id){return P.filter(function(p){return p.id===id;})[0];}
function add(id,qty,colour){var c=cart();var key=id+"|"+(colour||"");var line=c.filter(function(l){return l.key===key;})[0];
 if(line)line.qty+=qty;else c.push({key:key,id:id,qty:qty,colour:colour||""});saveCart(c);C.toast(find(id).name+" added to your cart");}
function img(p,hue){return '<img src="/images/example-headphones.webp" alt="'+C.esc(p.name)+'" style="filter:hue-rotate('+(hue===undefined?p.hue:hue)+'deg)" loading="lazy">';}
function card(p){return '<article class="product-card"><a href="product.html?id='+p.id+'" class="thumb">'+img(p)+(p.new?'<span class="badge">New</span>':'')+(!p.stock?'<span class="badge out">Sold out</span>':'')+'</a><div class="pc-body"><span class="kind">'+p.kind+'</span><a href="product.html?id='+p.id+'"><strong>'+C.esc(p.name)+'</strong></a><span class="stars">★ '+p.rating+' ('+p.reviews+')</span><div class="pc-row"><strong>$'+p.price+'</strong><button data-add="'+p.id+'"'+(p.stock?'':' disabled')+'>'+(p.stock?'Add to cart':'Sold out')+'</button></div></div></article>';}
document.addEventListener("click",function(e){var b=e.target.closest("[data-add]");if(b){add(b.dataset.add,1);}});
count();
// Featured + related grids
document.querySelectorAll('[data-products="featured"]').forEach(function(g){g.innerHTML=P.slice().sort(function(a,b){return b.pop-a.pop;}).slice(0,4).map(card).join("");});
// Shop
var all=document.querySelector('[data-products="all"]');
if(all){var cat=C.param("cat")||"all";var r=document.querySelector('input[name=cat][value="'+cat+'"]');if(r)r.checked=true;
 var max=document.getElementById("max-price"),label=document.getElementById("max-label"),stock=document.getElementById("in-stock"),sort=document.getElementById("sort");
 function render(){var c=document.querySelector("input[name=cat]:checked").value;label.textContent="$"+max.value;
  var list=P.filter(function(p){return (c==="all"||p.kind===c)&&p.price<=+max.value&&(!stock.checked||p.stock);});
  var s=sort.value;list.sort(function(a,b){return s==="low"?a.price-b.price:s==="high"?b.price-a.price:s==="new"?(b.new?1:0)-(a.new?1:0):b.pop-a.pop;});
  all.innerHTML=list.map(card).join("");document.querySelector(".empty").hidden=list.length>0;document.getElementById("result-count").textContent=list.length+" product"+(list.length===1?"":"s");
  history.replaceState(null,"",c==="all"?"shop.html":"shop.html?cat="+c);}
 document.querySelector(".filters").addEventListener("input",render);sort.addEventListener("change",render);render();}
// Product page
var el=document.getElementById("product");
if(el){var p=find(C.param("id"))||P[0];document.title=p.name+" | Offbeat Audio";var hue=p.hue,colour=colours[0][0];
 el.innerHTML='<div class="gallery">'+img(p)+'</div><div class="info"><p class="crumbs"><a href="shop.html">Shop</a> / <a href="shop.html?cat='+p.kind+'">'+p.kind+'</a></p><h1>'+C.esc(p.name)+'</h1><span class="stars">★★★★★ '+p.rating+' · '+p.reviews+' reviews</span><p class="price">$'+p.price+'</p><p class="lead">'+C.esc(p.desc)+'</p>'
 +'<div><strong>Colour: <span id="colour-name">'+colour+'</span></strong><div class="swatches" role="group" aria-label="Colour">'+colours.map(function(c,i){return '<button aria-pressed="'+(i===0)+'" aria-label="'+c[0]+'" data-hue="'+c[1]+'" data-name="'+c[0]+'" style="background:hsl('+(20+c[1])+' 45% 50%)"></button>';}).join("")+'</div></div>'
 +'<div class="qty"><button aria-label="Decrease quantity" data-q="-1">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button aria-label="Increase quantity" data-q="1">+</button></div>'
 +'<button class="btn wide" id="add"'+(p.stock?'':' disabled')+'>'+(p.stock?'Add to cart · $'+p.price:'Sold out')+'</button>'
 +'<dl class="specs"><dt>Battery</dt><dd>Up to 40 hours</dd><dt>Connectivity</dt><dd>Bluetooth 5.3, USB-C</dd><dt>Warranty</dt><dd>2 years</dd><dt>Delivery</dt><dd>Free over $150 · 60-night trial</dd></dl></div>';
 el.addEventListener("click",function(e){var s=e.target.closest("[data-hue]");if(s){hue=+s.dataset.hue+p.hue;colour=s.dataset.name;el.querySelector(".gallery img").style.filter="hue-rotate("+hue+"deg)";document.getElementById("colour-name").textContent=colour;el.querySelectorAll(".swatches button").forEach(function(b){b.setAttribute("aria-pressed",String(b===s));});}
  var q=e.target.closest("[data-q]");if(q){var i=document.getElementById("qty");i.value=Math.max(1,Math.min(9,(+i.value||1)+(+q.dataset.q)));}
  if(e.target.id==="add"){add(p.id,Math.max(1,+document.getElementById("qty").value||1),colour);}});
 var rel=document.querySelector('[data-products="related"]');rel.innerHTML=P.filter(function(x){return x.id!==p.id&&x.kind===p.kind;}).concat(P.filter(function(x){return x.kind!==p.kind;})).slice(0,4).map(card).join("");}
// Cart
function totals(c,ship){var sub=c.reduce(function(a,l){return a+find(l.id).price*l.qty;},0);var s=ship===undefined?(sub>=150||!sub?0:9.95):(+ship||(sub>=150?0:9.95));return {sub:sub,ship:s,total:sub+s};}
var cartEl=document.getElementById("cart");
function renderCart(){var c=cart();if(!c.length){cartEl.innerHTML='<p class="lead">Your cart is empty.</p><p style="margin-top:20px"><a class="btn" href="shop.html">Start shopping</a></p>';return;}
 var t=totals(c);cartEl.innerHTML=c.map(function(l,i){var p=find(l.id);return '<div class="line"><a href="product.html?id='+p.id+'">'+img(p)+'</a><div><strong>'+C.esc(p.name)+'</strong><br><small>'+(l.colour||"")+' · $'+p.price+' each</small><br><button class="remove" data-remove="'+i+'">Remove</button></div><div class="qty"><button data-dq="'+i+'" data-d="-1" aria-label="Decrease">−</button><input value="'+l.qty+'" readonly aria-label="Quantity"><button data-dq="'+i+'" data-d="1" aria-label="Increase">+</button></div><strong class="line-price">'+C.money(p.price*l.qty)+'</strong></div>';}).join("")
 +'<div class="free-ship">'+(t.sub>=150?'🎉 You’ve unlocked free shipping':'Spend '+C.money(150-t.sub)+' more for free shipping')+'<progress max="150" value="'+Math.min(150,t.sub)+'"></progress></div>'
 +'<div class="totals"><div><span>Subtotal</span><span>'+C.money(t.sub)+'</span></div><div><span>Shipping</span><span>'+(t.ship?C.money(t.ship):"Free")+'</span></div><div class="grand"><span>Total</span><span>'+C.money(t.total)+'</span></div><a class="btn wide" href="checkout.html" style="text-align:center">Checkout</a></div>';}
if(cartEl){renderCart();cartEl.addEventListener("click",function(e){var c=cart();var r=e.target.closest("[data-remove]");if(r){c.splice(+r.dataset.remove,1);saveCart(c);renderCart();}
 var d=e.target.closest("[data-dq]");if(d){var l=c[+d.dataset.dq];l.qty=Math.max(1,Math.min(9,l.qty+(+d.dataset.d)));saveCart(c);renderCart();}});}
// Checkout
var form=document.getElementById("checkout");
if(form){var sum=document.getElementById("summary");
 function renderSum(){var c=cart();var ship=form.ship.value;var t=totals(c,ship);sum.innerHTML='<h2>Order summary</h2>'+(c.length?c.map(function(l){var p=find(l.id);return '<div class="mini"><span>'+l.qty+' × '+C.esc(p.name)+'</span><span>'+C.money(p.price*l.qty)+'</span></div>';}).join(""):'<p>Your cart is empty. <a href="shop.html">Shop now</a></p>')+'<hr><div class="mini"><span>Shipping</span><span>'+(t.ship?C.money(t.ship):"Free")+'</span></div><div class="mini"><strong>Total</strong><strong>'+C.money(t.total)+'</strong></div>';}
 form.addEventListener("change",renderSum);renderSum();
 form.addEventListener("submit",function(e){e.preventDefault();if(!cart().length){C.toast("Your cart is empty");return;}if(!C.validate(form))return;
  document.getElementById("order-no").textContent="OB-"+Math.floor(100000+Math.random()*900000);saveCart([]);form.parentElement.hidden=true;var cf=document.getElementById("confirm");cf.hidden=false;cf.focus();});}
})();
`,
};
