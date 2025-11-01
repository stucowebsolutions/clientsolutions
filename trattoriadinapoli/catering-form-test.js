document.addEventListener("DOMContentLoaded", function() {
  // =========================
  // Floating Label Setup
  // =========================
  const floatInputs = document.querySelectorAll(
    '#catering-form input, #catering-form textarea, #catering-form select'
  );

  floatInputs.forEach(input => {
    const wrapper = document.createElement('div');
    wrapper.className = 'float-label-wrapper';
    const labelText = input.placeholder || input.getAttribute('aria-label') || input.name;
    input.removeAttribute('placeholder');
    const label = document.createElement('label');
    label.className = 'float-label';
    label.textContent = labelText;
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(label);

    // Initial state
    if(input.value) wrapper.classList.add('has-value');

    // Events
    input.addEventListener('focus', () => wrapper.classList.add('focused'));
    input.addEventListener('blur', () => {
      wrapper.classList.remove('focused');
      if(input.value) wrapper.classList.add('has-value');
      else wrapper.classList.remove('has-value');
    });
    input.addEventListener('input', () => {
      if(input.value) wrapper.classList.add('has-value');
      else wrapper.classList.remove('has-value');
    });
  });

  // =========================
  // Menu Data & Rendering
  // =========================
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
  for (const category in menuData) {
    const section = document.createElement("div");
    section.className = "menu-section";
    section.innerHTML = `<h4>${category}</h4>`;
    const grid = document.createElement("div");
    grid.className = "menu-grid";
    menuData[category].forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-item";

      const top = document.createElement("div");
      top.className = "top-line";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "menu-checkbox";
      top.appendChild(cb);
      const nameSpan = document.createElement("span");
      nameSpan.className = "item-name";
      nameSpan.textContent = item.name;
      top.appendChild(nameSpan);
      card.appendChild(top);

      const optionsRow = document.createElement("div");
      optionsRow.className = "menu-options";

      if(item.perPerson || (!item.priceHalf && item.priceFull && category === "Desserts")){
        const sizeDiv = document.createElement("div");
        sizeDiv.className = "size-text";
        if(item.name === "Cheesecake" || item.name === "Olive Oil Cake"){
          sizeDiv.textContent = `Full (${item.servesFull})`;
        } else {
          sizeDiv.textContent = item.perPerson ? "Per Person" : (item.servesFull ? item.servesFull : "Full");
        }
        const priceDiv = document.createElement("div");
        priceDiv.className = "menu-price";
        priceDiv.textContent = `$${item.priceFull}`;
        const qty = document.createElement("input");
        qty.type="number";
        qty.min="1";
        qty.value="1";
        qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv);
        optionsRow.appendChild(priceDiv);
        optionsRow.appendChild(qty);
      } else if (item.priceHalf && item.priceFull) {
        const sizeDiv = document.createElement("div"); sizeDiv.className = "size-text"; sizeDiv.textContent = `Half (${item.servesHalf}) / Full (${item.servesFull})`;
        const select = document.createElement("select"); select.className = "menu-size";
        const optHalf = document.createElement("option"); optHalf.value="half"; optHalf.textContent=`Half - $${item.priceHalf}`;
        const optFull = document.createElement("option"); optFull.value="full"; optFull.textContent=`Full - $${item.priceFull}`;
        select.appendChild(optHalf); select.appendChild(optFull);
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(select); optionsRow.appendChild(qty);
      } else {
        const sizeDiv = document.createElement("div"); sizeDiv.className = "size-text"; sizeDiv.textContent = item.servesFull ? `Full (${item.servesFull})` : "Full";
        const priceDiv = document.createElement("div"); priceDiv.className = "menu-price"; priceDiv.textContent = `$${item.priceFull}`;
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(priceDiv); optionsRow.appendChild(qty);
      }

      card.appendChild(optionsRow);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    menuContainer.appendChild(section);
  }

  // =========================
  // Totals Calculation
  // =========================
  const subtotalEl = document.getElementById("subtotal"),
        serviceEl = document.getElementById("serviceCharge"),
        totalEl = document.getElementById("totalPrice"),
        depositEl = document.getElementById("deposit"),
        estEl = document.getElementById("estimatedPeople");

  function calculateTotals(){
    let subtotal=0, totalServings=0;
    const items = menuContainer.querySelectorAll(".menu-item");
    let index=0;
    for (const category in menuData) {
      menuData[category].forEach(item=>{
        const card = items[index++];
        const checked = card.querySelector(".menu-checkbox");
        if(!checked || !checked.checked) return;
        const qtyEl = card.querySelector(".menu-qty");
        const qty = parseInt(qtyEl?.value||"0",10) || 0;
        const sizeSel = card.querySelector(".menu-size");
        const size = sizeSel ? (sizeSel.value || "full") : "full";

        if(item.perPerson){
          subtotal += item.priceFull * qty;
          totalServings += (item.servesFull || 1) * qty;
        } else if(item.priceHalf && item.priceFull){
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

  menuContainer.addEventListener("input", calculateTotals);
  menuContainer.addEventListener("change", calculateTotals);

  // =========================
  // Time options
  // =========================
  const startTime = document.getElementById("startTime"), endTime = document.getElementById("endTime");
  function format12(h,m){ const ampm = h>=12?"PM":"AM"; let hh=h%12; if(hh===0) hh=12; const mm = m<10?"0"+m:m; return `${hh}:${mm} ${ampm}`; }
  for(let h=8; h<=20; h++){
    for(let m=0; m<60; m+=15){
      const v = format12(h,m);
      const o1 = document.createElement("option"); o1.value=o1.textContent=v;
      const o2 = document.createElement("option"); o2.value=o2.textContent=v;
      startTime.appendChild(o1); endTime.appendChild(o2);
    }
  }

  // =========================
  // Pickup / Delivery toggle
  // =========================
  const pickupBtn = document.getElementById("togglePickup"),
        deliveryBtn = document.getElementById("toggleDelivery"),
        pickupInput = document.getElementById("pickupDeliveryInput"),
        deliveryWrapper = document.getElementById("deliveryWrapper");

  pickupBtn.addEventListener("click", ()=>{
    pickupBtn.style.background=var(--accent); pickupBtn.style.color="#fff"; pickupBtn.setAttribute("aria-pressed","true");
    deliveryBtn.style.background="#fff"; deliveryBtn.style.color="#000"; deliveryBtn.setAttribute("aria-pressed","false");
    pickupInput.value="pickup"; deliveryWrapper.style.display="none";
    clearError('deliveryAddress');
  });
  deliveryBtn.addEventListener("click", ()=>{
    deliveryBtn.style.background=var(--accent); deliveryBtn.style.color="#fff"; deliveryBtn.setAttribute("aria-pressed","true");
    pickupBtn.style.background="#fff"; pickupBtn.style.color="#000"; pickupBtn.setAttribute("aria-pressed","false");
    pickupInput.value="delivery"; deliveryWrapper.style.display="block";
  });

  // =========================
  // Contact method toggle
  // =========================
  const contactSelect = document.getElementById("contactMethod"),
        reachWrapper = document.getElementById("reachWrapper");
  contactSelect.addEventListener("change", ()=>{
    if(contactSelect.value) reachWrapper.style.display="block";
    else reachWrapper.style.display="none";
  });

  // =========================
  // Date min
  // =========================
  const eventDate = document.getElementById("eventDate");
  function setMinDate(){
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
    eventDate.min = min.toISOString().split("T")[0];
  }
  if(eventDate) setMinDate();

  // =========================
  // Form submission
  // =========================
  const form = document.getElementById("catering-form");
  const summaryField = document.getElementById("summaryField");

  function clearError(id){ const el=document.getElementById('err-'+id); if(el) el.textContent=''; }
  function setError(id,msg){ const el=document.getElementById('err-'+id); if(el) el.textContent=msg; }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    // Basic validation
    let valid = true;
    ['name','email','phone','people'].forEach(f=>{
      const val = document.getElementById(f).value.trim();
      if(!val){ setError(f,"Required"); valid=false; } else clearError(f);
    });
    if(pickupInput.value==="delivery"){
      const addr = document.getElementById("deliveryAddress").value.trim();
      if(!addr){ setError("deliveryAddress","Required"); valid=false; } else clearError("deliveryAddress");
    }
    if(!contactSelect.value){ setError("contactMethod","Required"); valid=false; } else clearError("contactMethod");

    // Confirmation days
    const daysChecked = reachWrapper.querySelectorAll("input[name='confirmationDays']:checked");
    if(contactSelect.value && daysChecked.length===0){ setError("timeframe","Select at least one day"); valid=false; } else clearError("timeframe");

    if(!valid) return;

    // Build summary
    let summary = "";
    const items = menuContainer.querySelectorAll(".menu-item");
    let index=0;
    for(const category in menuData){
      menuData[category].forEach(item=>{
        const card = items[index++];
        const checked = card.querySelector(".menu-checkbox");
        if(!checked || !checked.checked) return;
        const qty = card.querySelector(".menu-qty").value;
        const sizeSel = card.querySelector(".menu-size");
        const size = sizeSel ? sizeSel.value : 'full';
        summary += `${item.name} (${size}) x ${qty}\n`;
      });
    }
    summary += `Subtotal: $${subtotalEl.textContent}\n`;
    summary += `Total: $${totalEl.textContent}\n`;
    summaryField.value = summary;

    form.submit();
  });
});
