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

  function createMenuItemCard(item, categoryKey, itemIndex) {
    const card = document.createElement('div');
    card.className = 'menu-item';

    const top = document.createElement('div'); top.className = 'top-line';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'menu-checkbox';
    cb.setAttribute('aria-label', `Add ${item.name}`);
    top.appendChild(cb);

    const nameSpan = document.createElement('div'); nameSpan.className = 'item-name'; nameSpan.textContent = item.name;
    top.appendChild(nameSpan);
    card.appendChild(top);

    const optionsRow = document.createElement('div'); optionsRow.className = 'menu-options';

    if (item.perPerson || (!item.priceHalf && item.priceFull && categoryKey === 'Desserts')) {
      const sizeDiv = document.createElement('div'); sizeDiv.className = 'size-text';
      sizeDiv.textContent = item.perPerson ? 'Per Person' : (item.servesFull ? `Full (${item.servesFull})` : 'Full');

      const priceDiv = document.createElement('div'); priceDiv.className = 'menu-price'; priceDiv.textContent = `$${item.priceFull}`;

      const qty = document.createElement('input'); qty.type = 'number'; qty.min = '1'; qty.value = '1'; qty.className = 'menu-qty';
      qty.setAttribute('aria-label', `Quantity for ${item.name}`);

      optionsRow.appendChild(sizeDiv); optionsRow.appendChild(priceDiv); optionsRow.appendChild(qty);

    } else if (item.priceHalf && item.priceFull) {
      const sizeDiv = document.createElement('div'); sizeDiv.className = 'size-text';
      sizeDiv.textContent = `Half (${item.servesHalf}) / Full (${item.servesFull})`;

      const select = document.createElement('select'); select.className = 'menu-size';
      const optHalf = document.createElement('option'); optHalf.value = 'half'; optHalf.textContent = `Half - $${item.priceHalf}`;
      const optFull = document.createElement('option'); optFull.value = 'full'; optFull.textContent = `Full - $${item.priceFull}`;
      select.appendChild(optHalf); select.appendChild(optFull);

      const qty = document.createElement('input'); qty.type = 'number'; qty.min = '1'; qty.value = '1'; qty.className = 'menu-qty';
      qty.setAttribute('aria-label', `Quantity for ${item.name}`);

      optionsRow.appendChild(sizeDiv); optionsRow.appendChild(select); optionsRow.appendChild(qty);

    } else {
      const sizeDiv = document.createElement('div'); sizeDiv.className = 'size-text';
      sizeDiv.textContent = item.servesFull ? `Full (${item.servesFull})` : 'Full';

      const priceDiv = document.createElement('div'); priceDiv.className = 'menu-price'; priceDiv.textContent = `$${item.priceFull}`;

      const qty = document.createElement('input'); qty.type = 'number'; qty.min = '1'; qty.value = '1'; qty.className = 'menu-qty';
      qty.setAttribute('aria-label', `Quantity for ${item.name}`);

      optionsRow.appendChild(sizeDiv); optionsRow.appendChild(priceDiv); optionsRow.appendChild(qty);
    }

    card.appendChild(optionsRow);

    cb.addEventListener('change', () => {
      card.classList.toggle('active', cb.checked);
      calculateTotals();
    });
    optionsRow.addEventListener('input', calculateTotals);
    optionsRow.addEventListener('change', calculateTotals);

    return card;
  }

  // populate menu DOM
  for (const category in menuData) {
    const section = document.createElement('div'); section.className = 'menu-section';
    section.innerHTML = `<h4 style="margin:0 0 8px 0;">${category}</h4>`;
    const grid = document.createElement('div'); grid.className = 'menu-grid';
    menuData[category].forEach((item, idx) => {
      const card = createMenuItemCard(item, category, idx);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    menuContainer.appendChild(section);
  }

  /* ---------------- Totals ---------------- */
  const subtotalEl = document.getElementById("subtotal"),
        serviceEl = document.getElementById("serviceCharge"),
        totalEl = document.getElementById("totalPrice"),
        depositEl = document.getElementById("deposit"),
        estEl = document.getElementById("estimatedPeople");

  function calculateTotals(){
    let subtotal=0, totalServings=0;
    const itemCards = menuContainer.querySelectorAll(".menu-item");
    let idx = 0;
    for (const category in menuData) {
      menuData[category].forEach(item => {
        const card = itemCards[idx++];
        const checked = card.querySelector(".menu-checkbox");
        if (!checked || !checked.checked) return;
        const qtyEl = card.querySelector(".menu-qty");
        const qty = parseInt(qtyEl?.value || "0", 10) || 0;
        const sizeSel = card.querySelector(".menu-size");
        const size = sizeSel ? (sizeSel.value || "full") : "full";

        if (item.perPerson) {
          subtotal += item.priceFull * qty;
          totalServings += (item.servesFull || 1) * qty;
        } else if (item.priceHalf && item.priceFull) {
          const price = (size === "half") ? item.priceHalf : item.priceFull;
          const serves = (size === "half") ? item.servesHalf : item.servesFull;
          subtotal += price * qty;
          totalServings += serves * qty;
        } else {
          subtotal += item.priceFull * qty;
          totalServings += (item.servesFull || 1) * qty;
        }
      });
    }
    const service = subtotal * 0.2;
    const total = subtotal + service;
    const deposit = total * 0.5;

    subtotalEl.textContent = subtotal.toFixed(2);
    serviceEl.textContent = service.toFixed(2);
    totalEl.textContent = total.toFixed(2);
    depositEl.textContent = deposit.toFixed(2);
    estEl.textContent = totalServings;
  }

  menuContainer.addEventListener('input', calculateTotals);
  menuContainer.addEventListener('change', calculateTotals);

  /* ---------------- Time Options ---------------- */
  const startTime = document.getElementById("startTime");
  const endTime = document.getElementById("endTime");
  const eventTime = document.getElementById("eventTime");

  function format12(h, m) {
    const ampm = h >= 12 ? "PM" : "AM";
    let hh = h % 12; if (hh === 0) hh = 12;
    const mm = m.toString().padStart(2,"0");
    return `${hh}:${mm} ${ampm}`;
  }

  function populateTimeSelect(select) {
    if (!select) return;
    for (let h=10; h<=21; h++){
      for (let m=0; m<60; m+=30){
        if (h===10 && m<30) continue;
        if (h===21 && m>0) continue;
        const option = document.createElement("option");
        option.value = option.textContent = format12(h,m);
        select.appendChild(option);
      }
    }
  }

  populateTimeSelect(startTime);
  populateTimeSelect(endTime);
  populateTimeSelect(eventTime);

  /* ---------------- Event Date Min ---------------- */
  (function ensureEventDate(){
    let eventDate = document.getElementById('eventDate');
    function setMinDate(){
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
      if (eventDate) eventDate.min = min.toISOString().split("T")[0];
    }
    setMinDate();
    try { setInterval(setMinDate, 6*60*60*1000); } catch(e){}
  })();

  /* ---------------- Pickup / Delivery ---------------- */
  const pickupBtn = document.getElementById("togglePickup"),
        deliveryBtn = document.getElementById("toggleDelivery"),
        pickupInput = document.getElementById("pickupDeliveryInput"),
        deliveryWrapper = document.getElementById("deliveryWrapper");

  function setPickup() {
    pickupBtn.classList.add('toggle-active'); pickupBtn.classList.remove('toggle-inactive');
    deliveryBtn.classList.remove('toggle-active'); deliveryBtn.classList.add('toggle-inactive');
    if (pickupInput) pickupInput.value = 'pickup';
    if (deliveryWrapper) deliveryWrapper.style.display = 'none';
    pickupBtn.setAttribute('aria-pressed','true'); pickupBtn.setAttribute('aria-checked','true');
    deliveryBtn.setAttribute('aria-pressed','false'); deliveryBtn.setAttribute('aria-checked','false');
  }
  function setDelivery() {
    deliveryBtn.classList.add('toggle-active'); deliveryBtn.classList.remove('toggle-inactive');
    pickupBtn.classList.remove('toggle-active'); pickupBtn.classList.add('toggle-inactive');
    if (pickupInput) pickupInput.value = 'delivery';
    if (deliveryWrapper) deliveryWrapper.style.display = 'block';
    pickupBtn.setAttribute('aria-pressed','false'); pickupBtn.setAttribute('aria-checked','false');
    deliveryBtn.setAttribute('aria-pressed','true'); deliveryBtn.setAttribute('aria-checked','true');
  }

  pickupBtn?.addEventListener('click', setPickup);
  deliveryBtn?.addEventListener('click', setDelivery);

  /* ---------------- Contact Method ---------------- */
  const contactMethod = document.getElementById('contactMethod');
  const reachWrapper = document.getElementById('reachWrapper');
  function updateContactMethodUI() {
    if (!contactMethod) return;
    const val = contactMethod.value;
    if (val === 'phone') reachWrapper.style.display = 'block';
    else reachWrapper.style.display = 'none';
  }
  contactMethod?.addEventListener('change', updateContactMethodUI);

  /* ---------------- Validation ---------------- */
  function showError(id, message) {
    const el = document.getElementById('err-' + id);
    if (el) { el.textContent = message; el.setAttribute('role','alert'); }
  }
  function clearError(id) {
    const el = document.getElementById('err-' + id); if (el) el.textContent='';
  }

  const validators = {
    name: ()=>{ const v = document.getElementById('name')?.value||''; if(v.trim().length<2){showError('name','Enter name'); return false;} clearError('name'); return true;},
    email: ()=>{ const el=document.getElementById('email'); if(!el) return true; const v=el.value||''; if(!v||!el.checkValidity()){showError('email','Enter valid email'); return false;} clearError('email'); return true; },
    phone: ()=>{ const v=document.getElementById('phone')?.value||''; if(!v.replace(/[^\d]/g,'')) {showError('phone','Enter phone'); return false;} clearError('phone'); return true;},
    people: ()=>{ const v=document.getElementById('people')?.value||''; if(!v||Number(v)<1){showError('people','Enter number of people'); return false;} clearError('people'); return true; },
    eventDate: ()=>{ const v=document.getElementById('eventDate')?.value||''; if(!v){showError('eventDate','Pick date'); return false;} clearError('eventDate'); return true;},
    eventTime: ()=>{ const v=document.getElementById('eventTime')?.value||''; if(!v){showError('eventTime','Pick time'); return false;} clearError('eventTime'); return true;},
    timeframe: ()=>{ if(contactMethod?.value==='phone'){ const s=document.getElementById('startTime')?.value||''; const e=document.getElementById('endTime')?.value||''; const days=[...document.querySelectorAll("input[name='confirmationDays']:checked")]; if(!days.length||!s||!e){showError('timeframe','Pick timeframe'); return false;} } clearError('timeframe'); return true;},
    deliveryAddress: ()=>{ if(pickupInput?.value==='delivery'){ const v=document.getElementById('deliveryAddress')?.value||''; if(!v){showError('deliveryAddress','Enter address'); return false;} } clearError('deliveryAddress'); return true;}
  };

  ['name','email','phone','people','deliveryAddress'].forEach(id=>{document.getElementById(id)?.addEventListener('blur',validators[id]);});
  document.getElementById('eventDate')?.addEventListener('change',validators.eventDate);
  document.getElementById('eventTime')?.addEventListener('change',validators.eventTime);
  document.getElementById('startTime')?.addEventListener('change',validators.timeframe);
  document.getElementById('endTime')?.addEventListener('change',validators.timeframe);

  /* ---------------- Toast ---------------- */
  let toast = document.getElementById('form-toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id='form-toast';
    toast.style.position='fixed'; toast.style.bottom='20px'; toast.style.left='50%';
    toast.style.transform='translateX(-50%)'; toast.style.background='#28a745';
    toast.style.color='#fff'; toast.style.padding='12px 24px'; toast.style.borderRadius='8px';
    toast.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'; toast.style.fontSize='16px';
    toast.style.zIndex=9999; toast.style.opacity=0; toast.style.transition='opacity 0.3s ease';
    document.body.appendChild(toast);
  }
  function showToast(message,success=true){toast.textContent=message;toast.style.background=success?'#28a745':'#dc3545';toast.style.opacity=1;setTimeout(()=>{toast.style.opacity=0;},3000);}

  /* ---------------- Form Submission ---------------- */
  const form=document.getElementById('catering-form');
  const summaryField=document.getElementById('summaryField');

  if(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();

      // Run validators
      for(const v of Object.values(validators)) if(!v()){return;}

      // Honeypot check
      if(form.querySelector('.honeypot')?.value){console.log('Bot detected'); return;}

      // Build ordered summary
      const itemCards=menuContainer.querySelectorAll('.menu-item'); let idx=0; const ordered=[];
      for(const cat in menuData){
        menuData[cat].forEach(item=>{
          const card=itemCards[idx++]; if(!card.querySelector('.menu-checkbox')?.checked) return;
          const qty=card.querySelector('.menu-qty')?.value||'1';
          const sizeSel=card.querySelector('.menu-size');
          const size=sizeSel?sizeSel.value:(item.perPerson?'Per Person':(item.servesFull?`Full (${item.servesFull})`:'Full'));
          let priceUsed='';
          if(item.perPerson||(!item.priceHalf&&item.priceFull)) priceUsed=`$${item.priceFull}`;
          else if(item.priceHalf&&item.priceFull) priceUsed=`$${size==='half'?item.priceHalf:item.priceFull}`;
          else priceUsed=`$${item.priceFull}`;
          if(item.name==='Cheesecake'||item.name==='Olive Oil Cake') ordered.push(`${item.name} — Full (${item.servesFull}) x${qty} @ ${priceUsed}`);
          else ordered.push(`${item.name} — ${size} x${qty} @ ${priceUsed}`);
        });
      }

      if(summaryField) summaryField.value=[
        `Number of People: ${document.getElementById('people')?.value||''}`,
        `Event Date: ${document.getElementById('eventDate')?.value||''}`,
        `Event Time: ${document.getElementById('eventTime')?.value||''}`,
        `Confirmation Method: ${document.getElementById('contactMethod')?.value||''}`,
        `Confirmation Days: ${[...document.querySelectorAll("input[name='confirmationDays']:checked")].map(x=>x.value).join(", ")}`,
        `Confirmation Timeframe: ${document.getElementById('startTime')?.value||''} - ${document.getElementById('endTime')?.value||''}`,
        `Pickup/Delivery: ${pickupInput?.value||''}`,
        '',
        'Ordered Items:',
        ...ordered
      ].join("\n");

      // Collect data for Google Apps Script
      const payload={};
      form.querySelectorAll('input, select, textarea').forEach(f=>{
        const keep=['name','email','phone','summary']; if(f.name&&!keep.includes(f.name)) return;
        if(f.name) payload[f.name]=f.value;
      });

      try{
        showToast('Submitting your request...');
        const res=await fetch('https://script.google.com/macros/s/AKfycbyPngXXnnT30UD4R44WRHdiskBHArENEdlIjjPcATrXB0aEr9Qt6KcWDGdZKVlYf9xK/exec',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        const data=await res.json();
        if(data.status==='success'){
          showToast('Catering request submitted!');
          form.reset(); calculateTotals(); setPickup(); updateContactMethodUI();
        }else showToast('Error: '+data.message,false);
      }catch(err){showToast('Submission failed',false);}
    });
  }

  /* ---------------- Initialize Floating Labels ---------------- */
  enhanceFloatingInputs(['#name','#email','#phone','#people','#deliveryAddress']);

  /* ---------------- Initial UI Defaults ---------------- */
  try{setPickup();}catch(e){}
  try{updateContactMethodUI();}catch(e){}
  try{calculateTotals();}catch(e){}
});
