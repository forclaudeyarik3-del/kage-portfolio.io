const images={rolls:'https://catchsushibar.dk/wp-content/uploads/2020/10/DSC03020-2-min.jpg',sashimi:'https://citta.com.my/wp-content/uploads/2018/04/Sushi-Zanmai-Salmon-Sashimi.jpg',platter:'https://isorepublic.com/wp-content/uploads/2018/11/isorepublic-sushi-platter-1.jpg',omakase:'https://cdn.babyseo.ai/images/foodshot.ai/sushi-photography/sushi-photography-omakase-dark-slate-hero.webp'};
const dishes=[
{id:1,name:'Kage Roll',category:'Роллы',desc:'Тунец, гребешок, авокадо, юдзу-косё',weight:'240 г',price:1290,image:images.rolls,popular:true},
{id:2,name:'Hamachi Truffle',category:'Сашими',desc:'Желтохвост, трюфельный понзу, шисо',weight:'110 г',price:1490,image:images.sashimi,popular:true},
{id:3,name:'Akami Nigiri',category:'Суши',desc:'Дикий тунец, рис акита комати, васаби',weight:'70 г',price:780,image:images.omakase,popular:true},
{id:4,name:'Mori Set',category:'Сеты',desc:'Авторская подборка суши, роллов и сашими',weight:'740 г',price:5290,image:images.platter,popular:true},
{id:5,name:'Salmon Aburi',category:'Роллы',desc:'Лосось, снежный краб, огурец, мисо',weight:'230 г',price:1190,image:images.rolls},
{id:6,name:'Unagi Maki',category:'Роллы',desc:'Угорь, авокадо, кунжут, соус кабаяки',weight:'210 г',price:1090,image:images.platter},
{id:7,name:'Hotate Nigiri',category:'Суши',desc:'Морской гребешок, лайм, морская соль',weight:'65 г',price:690,image:images.omakase},
{id:8,name:'Ebi Nigiri',category:'Суши',desc:'Сладкая креветка, юдзу, рис акита комати',weight:'65 г',price:620,image:images.platter},
{id:9,name:'Toro Sashimi',category:'Сашими',desc:'Брюшко голубого тунца, свежий васаби',weight:'100 г',price:1890,image:images.sashimi},
{id:10,name:'Краб на углях',category:'Морепродукты',desc:'Камчатский краб, масло шисо, лимон',weight:'280 г',price:3490,image:images.platter},
{id:11,name:'Чёрная треска',category:'Горячее',desc:'Мисо, баклажан, маринованный имбирь',weight:'260 г',price:2290,image:images.omakase},
{id:12,name:'Wagyu Don',category:'Горячее',desc:'Вагю, рис, онсэн-тамаго, трюфель',weight:'330 г',price:2590,image:images.omakase},
{id:13,name:'Sencha Kyoto',category:'Напитки',desc:'Зелёный чай первого сбора',weight:'500 мл',price:590,image:images.platter},
{id:14,name:'Mochi Sakura',category:'Десерты',desc:'Рисовое тесто, вишня, белый шоколад',weight:'120 г',price:690,image:images.rolls}
];
const categories=['Все','Роллы','Суши','Сашими','Морепродукты','Горячее','Сеты','Напитки','Десерты'];
let category='Все';let cart={};
try{cart=JSON.parse(localStorage.getItem('kage-cart')||'{}')}catch{cart={}}
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
function card(d){return `<article class="dish"><img src="${d.image}" alt="${d.name}" loading="lazy"><div class="dish-body"><h3>${d.name}</h3><p>${d.desc}</p><div class="dish-foot"><small>${d.weight} · <strong>${money(d.price)}</strong></small><button type="button" data-add="${d.id}" aria-label="Добавить ${d.name}">＋</button></div></div></article>`}
function renderMenu(){const q=$('#search').value.trim().toLowerCase();const list=dishes.filter(d=>(category==='Все'||d.category===category)&&(!q||(d.name+' '+d.desc).toLowerCase().includes(q)));$('#menu-grid').innerHTML=list.map(card).join('');$('#empty').hidden=!!list.length;bindAdd()}
function bindAdd(){$$('[data-add]').forEach(b=>b.onclick=()=>add(Number(b.dataset.add)))}
function add(id){cart[id]=(cart[id]||0)+1;save();const dish=dishes.find(d=>d.id===id);showToast(`${dish.name} — в корзине`)}
function save(){localStorage.setItem('kage-cart',JSON.stringify(cart));renderCart()}
function renderCart(){const items=dishes.filter(d=>cart[d.id]);const count=Object.values(cart).reduce((a,b)=>a+b,0);$('#cart-count').textContent=count;$('#cart-items').innerHTML=items.length?items.map(d=>`<article class="cart-item"><img src="${d.image}" alt=""><div><h3>${d.name}</h3><p>${money(d.price)}</p><div class="qty"><button data-minus="${d.id}">−</button><span>${cart[d.id]}</span><button data-plus="${d.id}">+</button></div></div><button class="remove" data-remove="${d.id}" aria-label="Удалить">×</button></article>`).join(''):'<p>Корзина пуста. Добавьте блюда из меню.</p>';const subtotal=items.reduce((s,d)=>s+d.price*cart[d.id],0);const delivery=subtotal&&subtotal<4000?390:0;$('#total').textContent=money(subtotal+delivery);$$('[data-plus]').forEach(b=>b.onclick=()=>{cart[b.dataset.plus]++;save()});$$('[data-minus]').forEach(b=>b.onclick=()=>{const id=b.dataset.minus;if(--cart[id]<=0)delete cart[id];save()});$$('[data-remove]').forEach(b=>b.onclick=()=>{delete cart[b.dataset.remove];save()});$('#checkout-open').disabled=!items.length}
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2500)}
function openCart(){renderCart();$('#overlay').hidden=false;$('#cart').classList.add('open');$('#cart').setAttribute('aria-hidden','false')}
function closeCart(){$('#overlay').hidden=true;$('#cart').classList.remove('open');$('#cart').setAttribute('aria-hidden','true')}
$('#popular-grid').innerHTML=dishes.filter(d=>d.popular).map(card).join('');
$('#tabs').innerHTML=categories.map((c,i)=>`<button role="tab" class="${i?'':'active'}" data-category="${c}">${c}</button>`).join('');
$$('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));renderMenu()});
$('#search').addEventListener('input',renderMenu);bindAdd();renderMenu();renderCart();
$$('.cart-open').forEach(b=>b.onclick=openCart);$('#cart .close').onclick=closeCart;$('#overlay').onclick=closeCart;
$('#add-set').onclick=()=>add(4);
$('.menu-toggle').onclick=()=>$('.nav').classList.toggle('open');$$('.nav a').forEach(a=>a.onclick=()=>$('.nav').classList.remove('open'));
$$('.reserve-open').forEach(b=>b.onclick=()=>{const d=$('#reserve');d.querySelector('.form-view').hidden=false;d.querySelector('.success').hidden=true;d.showModal()});
$$('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#reserve-form [name=date]').min=new Date().toISOString().split('T')[0];
$('#reserve-form').onsubmit=e=>{e.preventDefault();e.target.closest('.form-view').hidden=true;$('#reserve .success').hidden=false};
$('#checkout-open').onclick=()=>{closeCart();const d=$('#checkout');d.querySelector('.form-view').hidden=false;d.querySelector('.success').hidden=true;d.showModal()};
$$('#checkout-form [name=type]').forEach(r=>r.onchange=()=>{const label=$('#address-label');label.hidden=r.value==='pickup';label.querySelector('input').required=r.value!=='pickup'});
$('#checkout-form').onsubmit=e=>{e.preventDefault();cart={};save();e.target.closest('.form-view').hidden=true;$('#checkout .success').hidden=false};
$('.to-top').onclick=()=>scrollTo({top:0,behavior:'smooth'});
