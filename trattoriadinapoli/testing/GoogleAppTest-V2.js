document.addEventListener("DOMContentLoaded", function() {

  /* ---------------- Floating labels ---------------- */
  function enhanceFloatingInputs(selectors) {
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (el.closest('.float-label-wrapper')) return;

      const placeholder = el.getAttribute('placeholder') || el.getAttribute('aria-label') || (el.getAttribute('id') || '');
      const wrapper = document.createElement('div');
      wrapper.className = 'float-label-wrapper';
      wrapper.dataset.label = placeholder;

      const label = document.createElement('label');
      label.className = 'float-label';
      const text = String(placeholder || '');
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] === ' ' ? '\u00A0' : text[i];
        const sp = document.createElement('span');
        sp.textContent = ch;
        sp.style.display = 'inline-block';
        label.appendChild(sp);
      }

      el.classList.add('float-field');
      el.removeAttribute('placeholder');
      const parent = el.parentNode;
      parent.replaceChild(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(label);

      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', placeholder);
      if (el.id) el.setAttribute('aria-describedby', 'err-' + el.id);

      const playWave = () => {
        wrapper.classList.add('focused');
        if (!(el.value && String(el.value).trim() !== '')) {
          const spans = label.querySelectorAll('span');
          spans.forEach((sp, i) => {
            sp.style.animationDelay = (i * 28) + 'ms';
            sp.style.animationDuration = '700ms';
          });
          label.classList.add('wave-play');
          setTimeout(() => label.classList.remove('wave-play'), spans.length * 28 + 900);
        }
      };
      const onBlur = () => {
        wrapper.classList.remove('focused');
        wrapper.classList.toggle('has-value', el.value && String(el.value).trim() !== '');
      };
      const onInput = () => {
        wrapper.classList.toggle('has-value', el.value && String(el.value).trim() !== '');
      };

      el.addEventListener('focus', playWave);
      el.addEventListener('blur', onBlur);
      el.addEventListener('input', onInput);
      label.addEventListener('click', () => el.focus());

      if (el.value && String(el.value).trim() !== '') wrapper.classList.add('has-value');
    });
  }

  /* ---------------- Menu Data ---------------- */
  const menuData = {
    "Antipasta":[
      {name:"House Salad",priceHalf:50,priceFull:100,servesHalf:10,servesFull:20},
      {name:"Caesar Salad",priceHalf:60,priceFull:120,servesHalf:10,servesFull:20},
      {name:"Arugula Salad",priceHalf:60,priceFull:120,servesHalf:10,servesFull:20},
      {name:"Mozzarella Sticks",priceFull:8,servesFull:1,perPerson:true},
      {name:"Salumi Board",priceFull:15,servesFull:1,perPerson:true}
    ],
    "Baked Pasta":[
      {name:"Penne Pesto",priceHalf:75,priceFull:150,servesHalf:10,servesFull:20},
      {name:"Penne Marinara",priceHalf:50,priceFull:100,servesHalf:10,servesFull:20},
      {name:"Penne Bolognese",priceHalf:150,priceFull:300,servesHalf:10,servesFull:20},
      {name:"Lasagna",priceHalf:150,priceFull:300,servesHalf:10,servesFull:20}
    ],
    "Paninis":[
      {name:"Pick A Parm Panini",priceFull:8,servesFull:1,perPerson:true},
      {name:"Caprese Panini",priceFull:8,servesFull:1,perPerson:true},
      {name:"Chimichurri Steak Panini",priceFull:12,servesFull:1,perPerson:true}
    ],
    "Proteins":[
      {name:"Grilled Chicken",priceHalf:60,priceFull:120,servesHalf:10,servesFull:20},
      {name:"Shrimp",priceHalf:100,priceFull:200,servesHalf:10,servesFull:20},
      {name:"Meatballs",priceHalf:80,priceFull:160,servesHalf:10,servesFull:20},
      {name:"Chicken Parm Cutlet",priceFull:10,servesFull:1,perPerson:true}
    ],
    "Desserts":[
      {name:"Tiramisu",priceHalf:125,priceFull:250,servesHalf:10,servesFull:20},
      {name:"Cheesecake",priceFull:80,servesFull:8},
      {name:"Olive Oil Cake",priceFull:80,servesFull:8}
    ]
  };

  const menuContainer = document.getElementById("menuContainer");

  function createMenuItemCard(item, categoryKey) {
    const card = document.createElement('div');
    card.className = 'menu-item';

    const top = document.createElement('div'); top.className = 'top-line';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'menu-checkbox';
    top.appendChild(cb);

    const nameSpan = document.createElement('div'); nameSpan.className = 'item-name'; nameSpan.textContent = item.name;
    top.appendChild(nameSpan);
    card.appendChild(top);

    const optionsRow = document.createElement('div'); optionsRow.className = 'menu-options';

    if (item.perPerson || (!item.priceHalf && item.priceFull && categoryKey === 'Desserts')) {
      optionsRow.innerHTML = `<div class="size-text">${item.perPerson?'Per Person':'Full'}</div><div class="menu-price">$${item.priceFull}</div>`;
      const qty = document.createElement('input'); qty.type='number'; qty.min='1'; qty.value='1'; qty.className='menu-qty';
      optionsRow.appendChild(qty);
    } else if (item.priceHalf && item.priceFull) {
      optionsRow.innerHTML = `<div class="size-text">Half (${item.servesHalf}) / Full (${item.servesFull})</div>`;
      const select=document.createElement('select'); select.className='menu-size';
      select.innerHTML=`<option value="half">Half - $${item.priceHalf}</option><option value="full">Full - $${item.priceFull}</option>`;
      const qty=document.createElement('input'); qty.type='number'; qty.min='1'; qty.value='1'; qty.className='menu-qty';
      optionsRow.appendChild(select); optionsRow.appendChild(qty);
    } else {
      optionsRow.innerHTML = `<div class="size-text">Full</div><div class="menu-price">$${item.priceFull}</div>`;
      const qty=document.createElement('input'); qty.type='number'; qty.min='1'; qty.value='1'; qty.className='menu-qty';
      optionsRow.appendChild(qty);
    }

    card.appendChild(optionsRow);

    cb.addEventListener('change', ()=>{card.classList.toggle('active',cb.checked);calculateTotals();});
    optionsRow.addEventListener('input',calculateTotals);
    optionsRow.addEventListener('change',calculateTotals);

    return card;
  }

  for(const cat in menuData){
    const section=document.createElement('div');
    section.innerHTML=`<h4>${cat}</h4>`;
    const grid=document.createElement('div');
    menuData[cat].forEach(i=>grid.appendChild(createMenuItemCard(i,cat)));
    section.appendChild(grid);
    menuContainer.appendChild(section);
  }

  /* ---------------- Totals ---------------- */
  const subtotalEl=document.getElementById("subtotal"),
        serviceEl=document.getElementById("serviceCharge"),
        totalEl=document.getElementById("totalPrice"),
        depositEl=document.getElementById("deposit"),
        estEl=document.getElementById("estimatedPeople");

  function calculateTotals(){
    let subtotal=0, servings=0;
    const cards=menuContainer.querySelectorAll(".menu-item");
    let idx=0;
    for(const cat in menuData){
      menuData[cat].forEach(item=>{
        const c=cards[idx++]; if(!c.querySelector(".menu-checkbox")?.checked) return;
        const qty=parseInt(c.querySelector(".menu-qty")?.value||1,10);
        const size=c.querySelector(".menu-size")?.value||"full";
        if(item.perPerson){subtotal+=item.priceFull*qty;servings+=qty;}
        else if(item.priceHalf){const p=size==="half"?item.priceHalf:item.priceFull;const s=size==="half"?item.servesHalf:item.servesFull;subtotal+=p*qty;servings+=s*qty;}
        else{subtotal+=item.priceFull*qty;servings+=item.servesFull||1;}
      });
    }
    const service=subtotal*0.2,total=subtotal+service,deposit=total*0.5;
    subtotalEl.textContent=subtotal.toFixed(2);
    serviceEl.textContent=service.toFixed(2);
    totalEl.textContent=total.toFixed(2);
    depositEl.textContent=deposit.toFixed(2);
    estEl.textContent=servings;
  }

  /* ---------------- Toast ---------------- */
  let toast=document.getElementById('form-toast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='form-toast';
    toast.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#28a745;color:#fff;padding:12px 24px;border-radius:8px;opacity:0;transition:opacity .3s;z-index:9999';
    document.body.appendChild(toast);
  }
  function showToast(msg){toast.textContent=msg;toast.style.opacity=1;setTimeout(()=>toast.style.opacity=0,3000);}

  /* ---------------- Submission ---------------- */
  const form=document.getElementById('catering-form');
  const summaryField=document.getElementById('summaryField');

  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();

      // Honeypot
      if(form.querySelector('.honeypot')?.value) return;

      // Build order-only summary
      const cards=menuContainer.querySelectorAll('.menu-item');
      let idx=0, ordered=[];
      for(const cat in menuData){
        menuData[cat].forEach(item=>{
          const c=cards[idx++]; if(!c.querySelector('.menu-checkbox')?.checked) return;
          const qty=c.querySelector('.menu-qty')?.value||1;
          const size=c.querySelector('.menu-size')?.value||'full';
          const price=item.priceHalf?(size==='half'?item.priceHalf:item.priceFull):item.priceFull;
          ordered.push(`${item.name} — ${item.perPerson?'Per Person':size} x${qty} @ $${price}`);
        });
      }
      summaryField.value=ordered.join('\n');

      const payload={
        name:document.getElementById('name')?.value||'',
        email:document.getElementById('email')?.value||'',
        phone:document.getElementById('phone')?.value||'',
        people:document.getElementById('people')?.value||'',
        eventDate:document.getElementById('eventDate')?.value||'',
        eventTime:document.getElementById('eventTime')?.value||'',
        pickupDelivery:document.getElementById('pickupDeliveryInput')?.value||'',
        deliveryAddress:document.getElementById('deliveryAddress')?.value||'',
        contactMethod:document.getElementById('contactMethod')?.value||'',
        confirmationDays:[...document.querySelectorAll("input[name='confirmationDays']:checked")].map(x=>x.value).join(','),
        confirmationTimeframe:`${document.getElementById('startTime')?.value||''} - ${document.getElementById('endTime')?.value||''}`,
        subtotal:subtotalEl.textContent,
        serviceCharge:serviceEl.textContent,
        totalPrice:totalEl.textContent,
        deposit:depositEl.textContent,
        estimatedPeople:estEl.textContent,
        summary:summaryField.value,
        company:form.querySelector('.honeypot')?.value||''
      };

      showToast('Submitting your catering request…');

      fetch('https://script.google.com/macros/s/AKfycbwYc5Yls60U5rO-M3fgPFrgzz-j61RUK8b-kUSVWb9tIfDkeEbCXeYgggYPDs4aaCPF/exec',{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });

      form.reset();
      calculateTotals();
      showToast('Catering request submitted!');
    });
  }

  enhanceFloatingInputs(['#name','#email','#phone','#people','#deliveryAddress']);
  calculateTotals();
});
