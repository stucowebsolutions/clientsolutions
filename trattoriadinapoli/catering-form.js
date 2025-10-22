document.addEventListener("DOMContentLoaded", function() {
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
        const sizeDiv = document.createElement("div"); sizeDiv.className = "size-text"; sizeDiv.textContent = item.perPerson ? "Per Person" : (item.servesFull ? item.servesFull : "Full");
        const priceDiv = document.createElement("div"); priceDiv.className = "menu-price"; priceDiv.textContent = `$${item.priceFull}`;
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(priceDiv); optionsRow.appendChild(qty);
      } else if (item.priceHalf && item.priceFull) {
        const sizeDiv = document.createElement("div"); sizeDiv.className = "size-text"; sizeDiv.textContent = `Half (${item.servesHalf}) / Full (${item.servesFull})`;
        const select = document.createElement("select"); select.className = "menu-size";
        const optHalf = document.createElement("option"); optHalf.value="half"; optHalf.textContent=`Half - $${item.priceHalf}`;
        const optFull = document.createElement("option"); optFull.value="full"; optFull.textContent=`Full - $${item.priceFull}`;
        select.appendChild(optHalf); select.appendChild(optFull);
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(select); optionsRow.appendChild(qty);
      } else {
        const sizeDiv = document.createElement("div"); sizeDiv.className = "size-text"; sizeDiv.textContent = item.servesFull ? item.servesFull : "Full";
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

  const pickupBtn = document.getElementById("togglePickup"), deliveryBtn = document.getElementById("toggleDelivery"),
        pickupInput = document.getElementById("pickupDeliveryInput"), deliveryWrapper = document.getElementById("deliveryWrapper");

  pickupBtn.addEventListener("click", ()=>{
    pickupBtn.style.background="#000"; pickupBtn.style.color="#fff"; pickupBtn.setAttribute("aria-pressed","true");
    deliveryBtn.style.background="#fff"; deliveryBtn.style.color="#000"; deliveryBtn.setAttribute("aria-pressed","false");
    pickupInput.value="pickup"; deliveryWrapper.style.display="none";
    clearError('deliveryAddress');
  });
  deliveryBtn.addEventListener("click", ()=>{
    deliveryBtn.style.background="#000"; deliveryBtn.style.color="#fff"; deliveryBtn.setAttribute("aria-pressed","true");
    pickupBtn.style.background="#fff"; pickupBtn.style.color="#000"; pickupBtn.setAttribute("aria-pressed","false");
    pickupInput.value="delivery"; deliveryWrapper.style.display="block";
  });

  const eventDate = document.getElementById("eventDate");
  function setMinDate(){
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate()+14);
    eventDate.min = min.toISOString().split("T")[0];
  }
  setMinDate();
  eventDate.addEventListener("input", ()=>{
    if(!eventDate.value){ eventDate.style.color=""; eventDate.style.background=""; return; }
    const selected = new Date(eventDate.value);
    const minDate = new Date(eventDate.min);
    if(selected < minDate){
      eventDate.style.color = "#666";
      eventDate.style.background = "#f3f3f3";
    } else {
      eventDate.style.color = "";
      eventDate.style.background = "";
    }
  });

  function showError(id, message){ const el = document.getElementById('err-' + id); if(el){ el.textContent = message; el.style.display = 'block'; } }
  function clearError(id){ const el = document.getElementById('err-' + id); if(el){ el.textContent = ''; el.style.display = 'none'; } }

  function validateName(){ const v = document.getElementById('name').value.trim(); if(!v || v.length < 2){ showError('name', 'Please enter your name (at least 2 characters).'); return false; } clearError('name'); return true; }
  function validateEmail(){ const el = document.getElementById('email'); const v = el.value.trim(); if(!v){ showError('email','Please enter your email.'); return false; } if(!el.checkValidity()){ showError('email','Please enter a valid email address.'); return false; } clearError('email'); return true; }
  function validatePhone(){ const v = document.getElementById('phone').value.trim(); const digits = v.replace(/[^\d]/g,''); if(!v || digits.length < 7){ showError('phone','Please enter a valid phone number (at least 7 digits).'); return false; } clearError('phone'); return true; }
  function validatePeople(){ const v = document.getElementById('people').value; if(!v || Number(v) < 1){ showError('people','Please enter number of people (1 or more).'); return false; } clearError('people'); return true; }
  function validateEventDate(){ const v = document.getElementById('eventDate').value; if(!v){ showError('eventDate','Please pick an event date.'); return false; } const selected = new Date(v); const minDate = new Date(eventDate.min); if(selected < minDate){ showError('eventDate','Event date must be at least two weeks from today.'); return false; } clearError('eventDate'); return true; }
  function validateTimeframe(){ const s = document.getElementById('startTime').value; const e = document.getElementById('endTime').value; if(!s || !e){ showError('timeframe','Please select a start and end time.'); return false; } clearError('timeframe'); return true; }
  function validateDeliveryAddressIfNeeded(){ if(pickupInput.value === 'delivery'){ const v = document.getElementById('deliveryAddress').value.trim(); if(!v){ showError('deliveryAddress','Please enter a delivery address.'); return false; } clearError('deliveryAddress'); return true; } else { clearError('deliveryAddress'); return true; } }

  document.getElementById('name').addEventListener('blur', validateName);
  document.getElementById('email').addEventListener('blur', validateEmail);
  document.getElementById('phone').addEventListener('blur', validatePhone);
  document.getElementById('people').addEventListener('blur', validatePeople);
  document.getElementById('eventDate').addEventListener('change', validateEventDate);
  document.getElementById('startTime').addEventListener('change', validateTimeframe);
  document.getElementById('endTime').addEventListener('change', validateTimeframe);
  document.getElementById('deliveryAddress').addEventListener('blur', validateDeliveryAddressIfNeeded);

  const form = document.getElementById("catering-form");
  form.addEventListener("submit", function(e){
    const validators = [validateName,validateEmail,validatePhone,validatePeople,validateEventDate,validateTimeframe,validateDeliveryAddressIfNeeded];
    for(const fn of validators){ if(!fn()){ e.preventDefault(); const firstErr = document.querySelector('.error-msg[style*="display: block"], .error-msg[style*="display:block"], .error-message[style*="display:block"]'); if(firstErr){ const id = firstErr.id?.replace('err-',''); if(id && document.getElementById(id)) document.getElementById(id).focus(); } return; } }

    const items = menuContainer.querySelectorAll(".menu-item");
    let idx=0; let ordered=[];
    for(const category in menuData){
      menuData[category].forEach(item=>{
        const card = items[idx++]; const checked = card.querySelector(".menu-checkbox"); if(!checked || !checked.checked) return;
        const qty = card.querySelector(".menu-qty")?.value || "0";
        const sizeSel = card.querySelector(".menu-size"); const size = sizeSel ? sizeSel.value : (item.perPerson ? "per person" : (item.servesFull || "full"));
        let priceUsed = "";
        if(item.perPerson || (!item.priceHalf && item.priceFull)){ priceUsed = `$${item.priceFull}`; }
        else if(item.priceHalf && item.priceFull){ const p = (size === "half") ? item.priceHalf : item.priceFull; priceUsed = `$${p}`; }
        else { priceUsed = `$${item.priceFull}`; }
        if(item.name==="Cheesecake" || item.name==="Olive Oil Cake"){ ordered.push(`${item.name} — ${item.servesFull} x${qty} @ ${priceUsed}`); }
        else { ordered.push(`${item.name} — ${size} x${qty} @ ${priceUsed}`); }
      });
    }

    const subtotal = parseFloat(document.getElementById("subtotal").textContent || "0");
    const service = parseFloat(document.getElementById("serviceCharge").textContent || "0");
    const total = parseFloat(document.getElementById("totalPrice").textContent || "0");
    const deposit = parseFloat(document.getElementById("deposit").textContent || "0");
    const est = document.getElementById("estimatedPeople").textContent || "0";
    const confDays = [...document.querySelectorAll("input.confirmationDays:checked")].map(x=>x.value).join(", ");

    const summaryLines = [
      `Number of People: ${document.getElementById('people').value || ''}`,
      `Event Date: ${document.getElementById('eventDate').value || ''}`,
      `Confirmation Days: ${confDays}`,
      `Timeframe: ${startTime.value || ''} - ${endTime.value || ''}`,
      `Pickup/Delivery: ${pickupInput.value}`,
      "",
      "Ordered Items:",
      ...ordered,
      "",
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Service: $${service.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      `Deposit: $${deposit.toFixed(2)}`,
      `Estimated Servings: ${est}`
    ];

    document.getElementById("summaryField").value = summaryLines.join("\n");

    form.querySelectorAll("input, select, textarea").forEach(f=>{
      if(!["name","email","phone","summary"].includes(f.name)) f.removeAttribute("name");
    });

    form.scrollIntoView({behavior:"smooth"});
  });

});
