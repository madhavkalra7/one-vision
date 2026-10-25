'use strict';
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
function closeMenu(){nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');document.querySelectorAll('.nav-submenu-toggle').forEach(button=>{button.setAttribute('aria-expanded','false');document.getElementById(button.getAttribute('aria-controls')).hidden=true;});}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
const form=document.querySelector('[data-enquiry]');
if(form){
const requestParams=new URLSearchParams(location.search);
const helpLabels={appraisal:'Rental appraisal',switch:'Switching managers',rental:'Rental interest',area:'Area enquiry',portal:'Portal access'};
if(helpLabels[requestParams.get('help')])form.elements.help.value=helpLabels[requestParams.get('help')];
if(requestParams.has('suburb'))form.elements.address.value=requestParams.get('suburb').slice(0,300);
const requestedDetails=[['property','Property'],['type','Preferred home type'],['query','Preferred suburb or keyword'],['maxRent','Maximum weekly rent'],['bedrooms','Minimum bedrooms']].filter(([key])=>requestParams.get(key)).map(([key,title])=>title+': '+requestParams.get(key).slice(0,200));
if(requestedDetails.length)form.elements.message.value=requestedDetails.join('\n');

form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('.form-status'),button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='Preparing your enquiry…';try{const response=await fetch('/assets/config.json');if(!response.ok)throw Error('Configuration unavailable');const config=await response.json(),data=Object.fromEntries(new FormData(form));const text=`One Vision — ${data.help}\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone||'Not provided'}\nProperty: ${data.address||'Not provided'}\n\n${data.message}\n`;
if(config.enquiryEndpoint&&form.dataset.enquiry!=='maintenance'){const result=await fetch(config.enquiryEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!result.ok)throw Error('Delivery failed');status.textContent='Your enquiry has been sent. Thank you for contacting One Vision.';form.reset();}
else if(config.email&&form.dataset.enquiry!=='maintenance'){location.href=`mailto:${config.email}?subject=${encodeURIComponent('One Vision: '+data.help)}&body=${encodeURIComponent(text)}`;status.textContent='Your email app has been requested. Review and send the message there. Nothing has been sent by this website.';}
else{const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=form.dataset.enquiry==='maintenance'?'one-vision-maintenance-report.txt':'one-vision-enquiry.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your file is ready. It has not been sent. Share it directly with your property contact when you are ready.';}
}catch{status.textContent='We could not prepare or send the enquiry. Your entries are still here. Please try again.';}finally{button.disabled=false;}});}


// Accessible nested navigation: mouse, touch and keyboard use the same controls.
for(const group of document.querySelectorAll('.nav-group')){
  const button=group.querySelector('.nav-submenu-toggle');
  const submenu=group.querySelector('.nav-submenu');
  const setOpen=open=>{button.setAttribute('aria-expanded',String(open));submenu.hidden=!open;};
  button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')!=='true';
    document.querySelectorAll('.nav-submenu-toggle').forEach(other=>{
      if(other!==button){other.setAttribute('aria-expanded','false');document.getElementById(other.getAttribute('aria-controls')).hidden=true;}
    });
    setOpen(open);
  });
  group.addEventListener('mouseenter',()=>{if(matchMedia('(hover: hover) and (min-width: 851px)').matches)setOpen(true);});
  group.addEventListener('mouseleave',()=>{if(!group.contains(document.activeElement))setOpen(false);});
  group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))setOpen(false);});
  group.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!submenu.hidden){event.preventDefault();event.stopPropagation();setOpen(false);button.focus();}
    if(event.key==='ArrowDown'&&event.target===button){event.preventDefault();setOpen(true);submenu.querySelector('a')?.focus();}
  });
}

// Native scroll-snap rails retain swipe, tab, wheel and no-JavaScript scrolling.
for(const rail of document.querySelectorAll('.card-rail')){
  const previous=document.querySelector(`[data-rail-prev][aria-controls="${rail.id}"]`);
  const next=document.querySelector(`[data-rail-next][aria-controls="${rail.id}"]`);
  const update=()=>{
    previous.disabled=rail.scrollLeft<=2;
    next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;
  };
  const move=direction=>rail.scrollBy({left:direction*((rail.firstElementChild?.getBoundingClientRect().width||250)+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  rail.addEventListener('scroll',update,{passive:true});
  rail.addEventListener('keydown',event=>{
    if(event.target===rail&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
  });
  if('ResizeObserver' in window)new ResizeObserver(update).observe(rail);
  else window.addEventListener('resize',update);
  update();
}

const questionSearch=document.querySelector('[data-faq-search]');
if(questionSearch){
  const details=[...document.querySelectorAll('[data-faq-results] details')];
  questionSearch.addEventListener('input',()=>{
    const query=questionSearch.value.toLocaleLowerCase().trim();
    let count=0;
    details.forEach(item=>{item.hidden=!item.textContent.toLocaleLowerCase().includes(query);if(!item.hidden)count++;});
    document.querySelector('[data-faq-count]').textContent=count+' matching '+(count===1?'question':'questions');
    document.querySelector('[data-faq-empty]').hidden=count!==0;
  });
}

const rentalSearch=document.querySelector('[data-rental-search]');
if(rentalSearch){
  const params=new URLSearchParams(location.search);
  for(const key of ['query','type','maxRent','bedrooms','sort']){
    const field=rentalSearch.elements.namedItem(key);
    if(params.has(key))field.value=params.get(key).slice(0,100);
  }
  const cards=[...document.querySelectorAll('[data-property]')];
  const grid=document.querySelector('[data-property-grid]');
  function filterRentals(updateUrl=false){
    const data=Object.fromEntries(new FormData(rentalSearch));
    const query=(data.query||'').trim().toLocaleLowerCase();
    const max=data.maxRent===''?Infinity:Number(data.maxRent);
    const beds=Number(data.bedrooms)||0;
    const sorted=[...cards];
    if(data.sort==='price-asc')sorted.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));
    if(data.sort==='price-desc')sorted.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));
    grid.append(...sorted);
    let count=0;
    sorted.forEach(card=>{
      const text=(card.dataset.suburb+' '+card.querySelector('h3').textContent).toLocaleLowerCase();
      const match=(!query||text.includes(query))&&(!data.type||card.dataset.type===data.type)&&Number(card.dataset.price)<=max&&Number(card.dataset.beds)>=beds;
      card.hidden=!match;
      if(match){
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&card.animate)card.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:450,delay:Math.min(count,3)*90,easing:'cubic-bezier(.2,.7,.2,1)'});
        count++;
      }
    });
    document.querySelector('[data-rental-count]').textContent=count+' '+(count===1?'property':'properties')+(cards.length?' found':' published');
    document.querySelector('[data-rental-empty]').hidden=count!==0;
    const enquiryParams=new URLSearchParams({help:'rental'});
    for(const key of ['query','type','maxRent','bedrooms'])if(data[key])enquiryParams.set(key,data[key]);
    document.querySelector('[data-rental-enquiry]').href='/contact-us/?'+enquiryParams;
    if(updateUrl){
      const current=new URL(location.href);
      current.search='';
      for(const[key,value]of Object.entries(data))if(value&&!(key==='sort'&&value==='default'))current.searchParams.set(key,value);
      history.replaceState(null,'',current);
    }
  }
  rentalSearch.addEventListener('submit',event=>{event.preventDefault();if(rentalSearch.reportValidity())filterRentals(true);});
  rentalSearch.addEventListener('reset',()=>setTimeout(()=>filterRentals(true),0));
  filterRentals();
}
