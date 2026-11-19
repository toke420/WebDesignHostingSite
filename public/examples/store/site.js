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
