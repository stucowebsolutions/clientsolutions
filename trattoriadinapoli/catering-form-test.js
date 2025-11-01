/* catering-form.js
   Clean rebuild for Trattoria di Napoli catering form.
   - Wave floating labels (one smooth wave on first focus)
   - Menu rendering (same data & calc logic as before)
   - Hide/show menu options when selected (single-row appears)
   - Hide delivery address until Delivery chosen
   - Show "When can we reach you?" only when Phone is selected
   - Insert eventDate if missing, enforce 2-week min
   - Prepare "summary" textarea for Formspree submission
   - All logic self-contained in this single external file
*/

document.addEventListener("DOMContentLoaded", function() {
  /* ---------------------------
     Inject small CSS needed for wave animation & wrappers
     --------------------------- */
  (function injectCSS(){
    const css = `
    /* Animated wave label spans */
    .float-label { cursor: text; display:inline-block; white-space:nowrap; }
    .float-label span { display:inline-block; transform: translateY(0); }
    @keyframes float-wave {
      0%   { transform: translateY(0); }
      40%  { transform: translateY(-14px); }
      70%  { transform: translateY(-6px); }
      100% { transform: translateY(0); }
    }
    .float-label.wave-play span {
      animation-name: float-wave;
      animation-duration: 700ms;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.2,0.8,0.2,1);
    }

    /* wrappers */
    .float-label-wrapper { position: relative; display: inline-block; width: 100%; margin-top:10px; }
    .float-label-wrapper .float-field { width: 100%; padding: 12px 14px; font-size: 18px; border: 1px solid var(--input-border); border-radius: 6px; background: white; box-sizing: border-box; transition: all 0.22s ease; }
    .float-label-wrapper .float-label { position: absolute; left: 12px; top: 14px; font-size: 16px; color: #666; pointer-events: none; transition: all 0.28s cubic-bezier(0.68,-0.55,0.27,1.55); }
    .float-label-wrapper.focused .float-label,
    .float-label-wrapper.has-value .float-label { top: -10px; font-size: 13px; color: var(--accent); }
    /* menu options hidden by default until active */
    .menu-item .menu-options { display: none; }
    .menu-item.active .menu-options { display: flex; gap: 8px; align-items:center; flex-wrap:wrap; }
    /* Toggle button active states (fallback if not using additional styles) */
    .toggle-active {
      background: var(--accent) !important;
      color: #fff !important;
      border-color: var(--input-border) !important;
    }
    .toggle-inactive {
      background: #fff !important;
      color: #000 !important;
      border-color: var(--input-border) !important;
    }
    `;
    const s = document.createElement('style');
    s.setAttribute('data-generated','catering-form-wave');
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  })();

  /* ---------------------------
     Helper: wave label builder (wraps inputs if not already wrapped)
     - Triggers ONE wave animation on first focus (per-wrapper)
     --------------------------- */
  function enhanceFloatingInputs(selectors) {
    selectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;

      // if already wrapped, skip
      if (el.closest('.float-label-wrapper')) return;

      const placeholder = el.getAttribute('placeholder') || el.getAttribute('aria-label') || '';
      const wrapper = document.createElement('div');
      wrapper.className = 'float-label-wrapper';
      wrapper.dataset.label = placeholder;

      // create label element with spans
      const label = document.createElement('label');
      label.className = 'float-label';
      // build spans for wave (characters)
      const text = String(placeholder || '');
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] === ' ' ? '\u00A0' : text[i];
        const sp = document.createElement('span');
        sp.textContent = ch;
        // stagger slightly for wave effect; base delay will be applied on wave trigger
        sp.style.display = 'inline-block';
        label.appendChild(sp);
      }

      // prepare the input: add float-field class and remove placeholder (we keep value if present)
      el.classList.add('float-field');
      // keep placeholder for a11y but we'll visually float it; we rely on label
      el.removeAttribute('placeholder');

      // create cloned input to insert? We'll reparent the existing element
      const parent = el.parentNode;
      parent.replaceChild(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(label);

      // set input larger tappable area to avoid "too small" complaints
      el.style.padding = '12px 14px';
      el.style.fontSize = '18px';
      el.style.minHeight = '44px';

      // manage classes for focus/blur/has-value
      const playWaveOnce = (ev) => {
        // mark focused
        wrapper.classList.add('focused');

        // wave play only first time
        if (!wrapper.dataset.wavePlayed) {
          // apply animationDelay for each span so the characters wave in sequence
          const spans = label.querySelectorAll('span');
          spans.forEach((sp, i) => {
            // 28ms step gives a gentle wave; adjust if you'd like faster/slower
            sp.style.animationDelay = (i * 28) + 'ms';
            sp.style.animationDuration = '700ms';
          });
          // add wave-play class to cause CSS keyframes to run
          label.classList.add('wave-play');
          // make sure we don't re-run on future focuses
          wrapper.dataset.wavePlayed = '1';
          // remove wave-play class after animation to keep DOM tidy
          setTimeout(() => label.classList.remove('wave-play'), spans.length * 28 + 900);
        }
      };
      const onBlur = () => {
        wrapper.classList.remove('focused');
        if (el.value && String(el.value).trim().length) wrapper.classList.add('has-value');
        else wrapper.classList.remove('has-value');
      };
      const onInput = () => {
        if (el.value && String(el.value).trim().length) wrapper.classList.add('has-value');
        else wrapper.classList.remove('has-value');
      };

      el.addEventListener('focus', playWaveOnce, { once: false });
      el.addEventListener('focus', () => wrapper.classList.add('focused'));
      el.addEventListener('blur', onBlur);
      el.addEventListener('input', onInput);

      // clicking the label should focus input
      label.addEventListener('click', () => el.focus());

      // if it already has a value (prefill), mark has-value
      if (el.value && String(el.value).trim().length) wrapper.classList.add('has-value');
    });
  }

  /* ---------------------------
     Menu Data (unchanged)
     --------------------------- */
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

  /* ---------------------------
     Render menu into DOM (options hidden until checkbox checked)
     --------------------------- */
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
      if (cb.checked) card.classList.add('active');
      else card.classList.remove('active');
      // recalc totals
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
     --------------------------- */
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
     --------------------------- */
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
     Ensure eventDate exists (insert if missing)
     - Insert after the top-grid block
     --------------------------- */
  (function ensureEventDate(){
    let eventDate = document.getElementById('eventDate');
    if (!eventDate) {
      const form = document.getElementById('catering-form');
      const topGrid = form.querySelector('.top-grid');
      // build a small block with label + input
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <label class="field-label" for="eventDate">Event Date *</label>
        <input id="eventDate" name="eventDate" required type="date" placeholder="Event Date">
        <span class="error-message" id="err-eventDate"></span>
        <small class="note">*(Orders must be placed at least two weeks in advance.)</small>
      `;
      // insert wrapper after the first top-grid (or at top if not found)
      if (topGrid && topGrid.parentNode) topGrid.parentNode.insertBefore(wrapper, topGrid.nextSibling);
      else form.insertBefore(wrapper, form.firstChild);
      eventDate = document.getElementById('eventDate');
      // enhance newly created date input later with floating label
    }
    // set min date (2 weeks out)
    function setMinDate(){
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
      if (eventDate) eventDate.min = min.toISOString().split("T")[0];
    }
    setMinDate();
    // re-run when day changes (not strictly necessary but safe)
    try { setInterval(setMinDate, 6*60*60*1000); } catch(e){}
  })();

  /* ---------------------------
     Pickup / Delivery toggle logic + color swapping
     --------------------------- */
  const pickupBtn = document.getElementById("togglePickup"),
        deliveryBtn = document.getElementById("toggleDelivery"),
        pickupInput = document.getElementById("pickupDeliveryInput"),
        deliveryWrapper = document.getElementById("deliveryWrapper");

  function setPickup() {
    // visual states
    pickupBtn.classList.add('toggle-active'); pickupBtn.classList.remove('toggle-inactive');
    deliveryBtn.classList.add('toggle-inactive'); deliveryBtn.classList.remove('toggle-active');
    // semantic value
    if (pickupInput) pickupInput.value = 'pickup';
    if (deliveryWrapper) deliveryWrapper.style.display = 'none';
    clearError('deliveryAddress');
  }
  function setDelivery() {
    deliveryBtn.classList.add('toggle-active'); deliveryBtn.classList.remove('toggle-inactive');
    pickupBtn.classList.add('toggle-inactive'); pickupBtn.classList.remove('toggle-active');
    if (pickupInput) pickupInput.value = 'delivery';
    if (deliveryWrapper) deliveryWrapper.style.display = 'block';
  }

  if (pickupBtn) pickupBtn.addEventListener('click', setPickup);
  if (deliveryBtn) deliveryBtn.addEventListener('click', setDelivery);

  /* ---------------------------
     Contact method logic (select based)
     --------------------------- */
  const contactMethod = document.getElementById('contactMethod');
  const reachWrapper = document.getElementById('reachWrapper');

  function updateContactMethodUI() {
    if (!contactMethod) return;
    const val = contactMethod.value;
    if (val === 'phone') {
      if (reachWrapper) reachWrapper.style.display = 'block';
    } else {
      if (reachWrapper) reachWrapper.style.display = 'none';
      // clear any timeframe errors
      clearError('timeframe');
    }
    clearError('contactMethod');
  }
  if (contactMethod) contactMethod.addEventListener('change', updateContactMethodUI);

  /* ---------------------------
     Validation helpers
     --------------------------- */
  function showError(id, message) {
    const el = document.getElementById('err-' + id);
    if (el) { el.textContent = message; el.style.display = 'block'; }
  }
  function clearError(id) {
    const el = document.getElementById('err-' + id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }

  function validateName() {
    const el = document.getElementById('name');
    if (!el) return true;
    const v = String(el.value || '').trim();
    if (!v || v.length < 2) { showError('name', 'Please enter name (2+ chars)'); return false; }
    clearError('name'); return true;
  }
  function validateEmail() {
    const el = document.getElementById('email');
    if (!el) return true;
    const v = String(el.value || '').trim();
    if (!v) { showError('email', 'Please enter your email'); return false; }
    if (!el.checkValidity()) { showError('email', 'Please enter a valid email'); return false; }
    clearError('email'); return true;
  }
  function validatePhone() {
    const el = document.getElementById('phone');
    if (!el) return true;
    const v = String(el.value || '').trim();
    const digits = v.replace(/[^\d]/g, '');
    if (!v || digits.length < 7) { showError('phone', 'Please enter a valid phone number'); return false; }
    clearError('phone'); return true;
  }
  function validatePeople() {
    const el = document.getElementById('people');
    if (!el) return true;
    const v = el.value;
    if (!v || Number(v) < 1) { showError('people', 'Enter number of people (1+)'); return false; }
    clearError('people'); return true;
  }
  function validateEventDate() {
    const el = document.getElementById('eventDate');
    if (!el) return true;
    const v = el.value;
    if (!v) { showError('eventDate', 'Please pick an event date'); return false; }
    const selected = new Date(v);
    const minDate = new Date(el.min || (new Date().toISOString().split('T')[0]));
    if (selected < minDate) { showError('eventDate', 'Event date must be at least two weeks from today'); return false; }
    clearError('eventDate'); return true;
  }
  function validateTimeframe() {
    // timeframe only required if phone chosen
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

  // attach blur/listeners
  const nameEl = document.getElementById('name'), emailEl = document.getElementById('email'),
        phoneEl = document.getElementById('phone'), peopleEl = document.getElementById('people'),
        deliveryAddressEl = document.getElementById('deliveryAddress'),
        eventDateEl = document.getElementById('eventDate');

  if (nameEl) nameEl.addEventListener('blur', validateName);
  if (emailEl) emailEl.addEventListener('blur', validateEmail);
  if (phoneEl) phoneEl.addEventListener('blur', validatePhone);
  if (peopleEl) peopleEl.addEventListener('blur', validatePeople);
  if (eventDateEl) eventDateEl.addEventListener('change', validateEventDate);
  if (document.getElementById('startTime')) document.getElementById('startTime').addEventListener('change', validateTimeframe);
  if (document.getElementById('endTime')) document.getElementById('endTime').addEventListener('change', validateTimeframe);
  if (deliveryAddressEl) deliveryAddressEl.addEventListener('blur', validateDeliveryAddressIfNeeded);

  /* ---------------------------
     Form submission: summary formatting for Formspree
     --------------------------- */
  const form = document.getElementById('catering-form');
  const summaryField = document.getElementById('summaryField');

  if (form) {
    form.addEventListener('submit', function(e){
      // run validators
      const validators = [validateName, validateEmail, validatePhone, validatePeople, validateEventDate, validateTimeframe, validateDeliveryAddressIfNeeded];
      for (const fn of validators) {
        if (!fn()) {
          e.preventDefault();
          // scroll to first error (if present)
          const firstErr = document.querySelector('.error-message:not(:empty)');
          if (firstErr) firstErr.scrollIntoView({behavior:'smooth', block:'center'});
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
     - We'll target main contact inputs + delivery + eventDate
     --------------------------- */
  enhanceFloatingInputs([
    '#name', '#email', '#phone', '#people', '#deliveryAddress', '#eventDate'
  ]);

  /* ---------------------------
     Initial UI defaults
     --------------------------- */
  try { setPickup(); } catch(e){}
  try { updateContactMethodUI(); } catch(e){}
  try { calculateTotals(); } catch(e){}
});
