document.addEventListener("DOMContentLoaded", function() {

  /* ---------------- Floating labels ----------------
     Wrap inputs with .float-label-wrapper, build per-letter spans for wave animation.
     Also set basic ARIA attributes so screen readers can read placeholders/labels.
  */
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

      // keep input behavior; remove placeholder visually (we keep accessible label)
      el.classList.add('float-field');
      el.removeAttribute('placeholder');

      // replace in DOM
      const parent = el.parentNode;
      parent.replaceChild(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(label);

      // accessibility helpers
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', placeholder);
      }
      // link error message for screen reader
      if (el.id) {
        const errId = 'err-' + el.id;
        el.setAttribute('aria-describedby', errId);
      }

      // play wave per-letter when focused (only if empty)
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

  /* ---------------------------
     Menu data and rendering (left unchanged functionally)
  */
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

    // top line: checkbox + name
    const top = document.createElement('div'); top.className = 'top-line';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.className = 'menu-checkbox';
    cb.setAttribute('aria-label', `Add ${item.name}`);
    top.appendChild(cb);

    const nameSpan = document.createElement('div'); nameSpan.className = 'item-name'; nameSpan.textContent = item.name;
    top.appendChild(nameSpan);
    card.appendChild(top);

    // options row (hidden until checkbox checked)
    const optionsRow = document.createElement('div'); optionsRow.className = 'menu-options';

    // create row contents
    if (item.perPerson || (!item.priceHalf && item.priceFull && categoryKey === 'Desserts')) {
      const sizeDiv = document.createElement('div'); sizeDiv.className = 'size-text';
      if (item.name === "Cheesecake" || item.name === "Olive Oil Cake") sizeDiv.textContent = `Full (${item.servesFull})`;
      else sizeDiv.textContent = item.perPerson ? 'Per Person' : (item.servesFull ? item.servesFull : 'Full');

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

    // checkbox toggles the options (single row appears)
    cb.addEventListener('change', () => {
      card.classList.toggle('active', cb.checked);
      calculateTotals();
    });

    // changing qty or size updates totals
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

  /* ---------------------------
     Totals & DOM refs
  */
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

  // run totals on change
  menuContainer.addEventListener('input', calculateTotals);
  menuContainer.addEventListener('change', calculateTotals);

  /* ---------------------------
     Time options (populate selects)
  */
  const startTime = document.getElementById("startTime");
  const endTime = document.getElementById("endTime");
  function format12(h,m){ const ampm = h>=12?"PM":"AM"; let hh=h%12; if(hh===0) hh=12; const mm = m<10?"0"+m:m; return `${hh}:${mm} ${ampm}`; }
  if (startTime && endTime) {
    for(let h=8; h<=20; h++){
      for(let m=0; m<60; m+=15){
        const v = format12(h,m);
        const o1 = document.createElement("option"); o1.value = o1.textContent = v;
        const o2 = document.createElement("option"); o2.value = o2.textContent = v;
        startTime.appendChild(o1);
        endTime.appendChild(o2);
      }
    }
  }

  /* ---------------------------
     Ensure eventDate exists and set min date (2 weeks out)
  */
  (function ensureEventDate(){
    let eventDate = document.getElementById('eventDate');
    if (!eventDate) {
      // if the HTML somehow doesn't include it, create it (keeps backward compat)
      const form = document.getElementById('catering-form');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <input id="eventDate" name="eventDate" required type="date" aria-describedby="err-eventDate">
        <span class="error-message" id="err-eventDate" role="alert" aria-live="polite"></span>
      `;
      form.insertBefore(wrapper, form.firstChild);
      eventDate = document.getElementById('eventDate');
    }
    function setMinDate(){
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
      if (eventDate) eventDate.min = min.toISOString().split("T")[0];
    }
    setMinDate();
    try { setInterval(setMinDate, 6*60*60*1000); } catch(e){}
  })();

  /* ---------------------------
     Pickup / Delivery toggle logic + keyboard accessibility
  */
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
    clearError('deliveryAddress');
  }
  function setDelivery() {
    deliveryBtn.classList.add('toggle-active'); deliveryBtn.classList.remove('toggle-inactive');
    pickupBtn.classList.remove('toggle-active'); pickupBtn.classList.add('toggle-inactive');
    if (pickupInput) pickupInput.value = 'delivery';
    if (deliveryWrapper) deliveryWrapper.style.display = 'block';
    pickupBtn.setAttribute('aria-pressed','false'); pickupBtn.setAttribute('aria-checked','false');
    deliveryBtn.setAttribute('aria-pressed','true'); deliveryBtn.setAttribute('aria-checked','true');
  }

  if (pickupBtn) {
    pickupBtn.addEventListener('click', setPickup);
    pickupBtn.addEventListener('keydown', (e)=> { if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); setPickup(); }});
  }
  if (deliveryBtn) {
    deliveryBtn.addEventListener('click', setDelivery);
    deliveryBtn.addEventListener('keydown', (e)=> { if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); setDelivery(); }});
  }

  /* ---------------------------
     Contact method logic (select-based)
  */
  const contactMethod = document.getElementById('contactMethod');
  const reachWrapper = document.getElementById('reachWrapper');

  function updateContactMethodUI() {
    if (!contactMethod) return;
    const val = contactMethod.value;
    if (val === 'phone') {
      if (reachWrapper) reachWrapper.style.display = 'block';
      // focus first checkbox for keyboard users
      const firstChk = reachWrapper.querySelector("input[type='checkbox']");
      if (firstChk) firstChk.focus();
    } else {
      if (reachWrapper) reachWrapper.style.display = 'none';
      clearError('timeframe');
    }
    clearError('contactMethod');
  }
  if (contactMethod) contactMethod.addEventListener('change', updateContactMethodUI);

  /* ---------------------------
     Validation helpers (also set ARIA states)
  */
  function showError(id, message) {
    const el = document.getElementById('err-' + id);
    if (el) {
      el.textContent = message;
      el.style.display = 'block';
      el.setAttribute('role','alert');
      const input = document.getElementById(id);
      if (input) input.setAttribute('aria-invalid','true');
    }
  }
  function clearError(id) {
    const el = document.getElementById('err-' + id);
    if (el) {
      el.textContent = '';
      el.style.display = 'block'; // keep block to preserve spacing (empty)
      el.removeAttribute('role');
    }
    const input = document.getElementById(id);
    if (input) input.removeAttribute('aria-invalid');
  }

  function validateName() {
    const el = document.getElementById('name'); if (!el) return true;
    const v = String(el.value || '').trim();
    if (!v || v.length < 2) { showError('name', 'Please enter name (2+ chars)'); return false; }
    clearError('name'); return true;
  }
  function validateEmail() {
    const el = document.getElementById('email'); if (!el) return true;
    const v = String(el.value || '').trim();
    if (!v) { showError('email', 'Please enter your email'); return false; }
    if (!el.checkValidity()) { showError('email', 'Please enter a valid email'); return false; }
    clearError('email'); return true;
  }
  function validatePhone() {
    const el = document.getElementById('phone'); if (!el) return true;
    const v = String(el.value || '').trim();
    const digits = v.replace(/[^\d]/g, '');
    if (!v || digits.length < 7) { showError('phone', 'Please enter a valid phone number'); return false; }
    clearError('phone'); return true;
  }
  function validatePeople() {
    const el = document.getElementById('people'); if (!el) return true;
    const v = el.value;
    if (!v || Number(v) < 1) { showError('people', 'Enter number of people (1+)'); return false; }
    clearError('people'); return true;
  }
  function validateEventDate() {
    const el = document.getElementById('eventDate'); if (!el) return true;
    const v = el.value;
    if (!v) { showError('eventDate', 'Please pick an event date'); return false; }
    const selected = new Date(v);
    const minDate = new Date(el.min || (new Date().toISOString().split('T')[0]));
    if (selected < minDate) { showError('eventDate', 'Event date must be at least two weeks from today'); return false; }
    clearError('eventDate'); return true;
  }
  function validateTimeframe() {
    if (contactMethod && contactMethod.value === 'phone') {
      const s = (document.getElementById('startTime') || {}).value;
      const e = (document.getElementById('endTime') || {}).value;
      const daysChecked = [...document.querySelectorAll("input[name='confirmationDays']:checked")];
      if (!daysChecked.length) { showError('timeframe', 'Select at least one day'); return false; }
      if (!s || !e) { showError('timeframe', 'Pick a start and end time'); return false; }
    }
    clearError('timeframe'); return true;
  }
  function validateDeliveryAddressIfNeeded() {
    if (pickupInput && pickupInput.value === 'delivery') {
      const el = document.getElementById('deliveryAddress');
      if (!el) { showError('deliveryAddress','Please enter delivery address'); return false; }
      const v = String(el.value || '').trim();
      if (!v) { showError('deliveryAddress','Please enter delivery address'); return false; }
    }
    clearError('deliveryAddress'); return true;
  }

  // attach blur/listeners (keyboard friendly)
  ['name','email','phone','people','deliveryAddress'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('blur', () => {
      const map = { name: validateName, email: validateEmail, phone: validatePhone, people: validatePeople, deliveryAddress: validateDeliveryAddressIfNeeded };
      map[id]?.();
    });
  });
  document.getElementById('eventDate')?.addEventListener('change', validateEventDate);
  document.getElementById('startTime')?.addEventListener('change', validateTimeframe);
  document.getElementById('endTime')?.addEventListener('change', validateTimeframe);

  /* ---------------------------
     Form submission: summary formatting for Formspree (unchanged behavior)
  */
  const form = document.getElementById('catering-form');
  const summaryField = document.getElementById('summaryField');

  if (form) {
    form.addEventListener('submit', function(e) {
      // run validators
      const validators = [validateName, validateEmail, validatePhone, validatePeople, validateEventDate, validateTimeframe, validateDeliveryAddressIfNeeded];
      for (const fn of validators) {
        if (!fn()) {
          e.preventDefault();
          const firstErr = document.querySelector('.error-message:not(:empty)');
          if (firstErr) {
            // focus the related input if possible
            const id = (firstErr.id || '').replace('err-','');
            const input = document.getElementById(id);
            if (input) input.focus();
            firstErr.scrollIntoView({behavior:'smooth', block:'center'});
          }
          return;
        }
      }

      // Build ordered items summary (same logic as before)
      const itemCards = menuContainer.querySelectorAll(".menu-item");
      let idx = 0;
      const ordered = [];
      for (const category in menuData) {
        menuData[category].forEach(item => {
          const card = itemCards[idx++];
          const checked = card.querySelector('.menu-checkbox');
          if (!checked || !checked.checked) return;
          const qty = card.querySelector('.menu-qty')?.value || "0";
          const sizeSel = card.querySelector('.menu-size');
          const size = sizeSel ? sizeSel.value : (item.perPerson ? 'Per Person' : (item.servesFull ? `Full (${item.servesFull})` : 'Full'));
          let priceUsed = "";
          if (item.perPerson || (!item.priceHalf && item.priceFull)) priceUsed = `$${item.priceFull}`;
          else if (item.priceHalf && item.priceFull) {
            const p = (size === 'half') ? item.priceHalf : item.priceFull;
            priceUsed = `$${p}`;
          } else priceUsed = `$${item.priceFull}`;

          if (item.name === "Cheesecake" || item.name === "Olive Oil Cake") {
            ordered.push(`${item.name} — Full (${item.servesFull}) x${qty} @ ${priceUsed}`);
          } else {
            ordered.push(`${item.name} — ${size} x${qty} @ ${priceUsed}`);
          }
        });
      }

      const subtotal = parseFloat(document.getElementById("subtotal").textContent || "0");
      const service = parseFloat(document.getElementById("serviceCharge").textContent || "0");
      const total = parseFloat(document.getElementById("totalPrice").textContent || "0");
      const deposit = parseFloat(document.getElementById("deposit").textContent || "0");
      const est = document.getElementById("estimatedPeople").textContent || "0";
      const confDays = [...document.querySelectorAll("input[name='confirmationDays']:checked")].map(x=>x.value).join(", ");

      const summaryLines = [
        `Number of People: ${document.getElementById('people')?.value || ''}`,
        `Event Date: ${document.getElementById('eventDate')?.value || ''}`,
        `Confirmation Days: ${confDays}`,
        `Timeframe: ${document.getElementById('startTime')?.value || ''} - ${document.getElementById('endTime')?.value || ''}`,
        `Pickup/Delivery: ${pickupInput?.value || ''}`,
        '',
        'Ordered Items:',
        ...ordered,
        '',
        `Subtotal: $${subtotal.toFixed(2)}`,
        `Service: $${service.toFixed(2)}`,
        `Total: $${total.toFixed(2)}`,
        `Deposit: $${deposit.toFixed(2)}`,
        `Estimated Servings: ${est}`
      ];

      if (summaryField) summaryField.value = summaryLines.join("\n");

      // Remove name attributes except for name/email/phone/summary so Formspree receives the required fields
      form.querySelectorAll('input, select, textarea').forEach(f => {
        const keep = ['name','email','phone','summary'];
        if (!keep.includes(f.name)) f.removeAttribute('name');
      });

      // allow the form to submit normally to Formspree
    });
  }

  /* ---------------------------
     Initialize floating labels (for key inputs)
  */
  enhanceFloatingInputs([
    '#name', '#email', '#phone', '#people', '#deliveryAddress'
  ]);

  /* ---------------------------
     Initial UI defaults
  */
  try { setPickup(); } catch(e){}
  try { updateContactMethodUI(); } catch(e){}
  try { calculateTotals(); } catch(e){}
});
