document.addEventListener("DOMContentLoaded", function() {
  // === MENU DATA ===
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

  // === DYNAMIC MENU GENERATION ===
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

      // Per person / full only
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
        qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv);
        optionsRow.appendChild(priceDiv);
        optionsRow.appendChild(qty);
      } else if(item.priceHalf && item.priceFull){
        const sizeDiv = document.createElement("div"); sizeDiv.className="size-text";
        sizeDiv.textContent = `Half (${item.servesHalf}) / Full (${item.servesFull})`;
        const select = document.createElement("select"); select.className="menu-size";
        const optHalf = document.createElement("option"); optHalf.value="half"; optHalf.textContent=`Half - $${item.priceHalf}`;
        const optFull = document.createElement("option"); optFull.value="full"; optFull.textContent=`Full - $${item.priceFull}`;
        select.appendChild(optHalf); select.appendChild(optFull);
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(select); optionsRow.appendChild(qty);
      } else {
        const sizeDiv = document.createElement("div"); sizeDiv.className="size-text"; sizeDiv.textContent = item.servesFull ? `Full (${item.servesFull})` : "Full";
        const priceDiv = document.createElement("div"); priceDiv.className="menu-price"; priceDiv.textContent = `$${item.priceFull}`;
        const qty = document.createElement("input"); qty.type="number"; qty.min="1"; qty.value="1"; qty.className="menu-qty";
        optionsRow.appendChild(sizeDiv); optionsRow.appendChild(priceDiv); optionsRow.appendChild(qty);
      }

      card.appendChild(optionsRow);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    menuContainer.appendChild(section);
  }

  // === FLOATING WAVE LABELS ===
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach(input=>{
    const wrapper = document.createElement("div");
    wrapper.className = "float-label-wrapper";
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    const label = document.createElement("label");
    label.className = "float-label";
    label.textContent = input.placeholder;
    wrapper.appendChild(label);
    input.removeAttribute("placeholder");

    const updateClass = ()=> {
      if(input.value.trim()!=="") wrapper.classList.add("has-value");
      else wrapper.classList.remove("has-value");
    }

    input.addEventListener("focus", ()=> wrapper.classList.add("focused"));
    input.addEventListener("blur", ()=> { wrapper.classList.remove("focused"); updateClass(); });
    input.addEventListener("input", updateClass);
  });

  // === TOTALS CALCULATION ===
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
          const price = (size==="half") ? item.priceHalf : item.priceFull;
          const serves = (size==="half") ? item.servesHalf : item.servesFull;
          subtotal += price * qty;
          totalServings += serves * qty;
        } else {
          subtotal += item.priceFull * qty;
          totalServings += (item.servesFull || 1);
        }
      });
    }
    const service = subtotal*0.2;
    const total = subtotal+service;
    const deposit = total*0.5;
    subtotalEl.textContent = subtotal.toFixed(2);
    serviceEl.textContent = service.toFixed(2);
    totalEl.textContent = total.toFixed(2);
    depositEl.textContent = deposit.toFixed(2);
    estEl.textContent = totalServings;
  }
  menuContainer.addEventListener("input", calculateTotals);
  menuContainer.addEventListener("change", calculateTotals);

  // === FORM SUBMISSION ===
  const form = document.getElementById("catering-form");
  form.addEventListener("submit", function(e){
    // Collect items for summary
    const items = menuContainer.querySelectorAll(".menu-item");
    let idx=0; let ordered=[];
    for (const category in menuData){
      menuData[category].forEach(item=>{
        const card = items[idx++]; const checked = card.querySelector(".menu-checkbox"); if(!checked || !checked.checked) return;
        const qty = card.querySelector(".menu-qty")?.value || "0";
        const sizeSel = card.querySelector(".menu-size"); const size = sizeSel ? sizeSel.value : (item.perPerson ? "Per Person" : (item.servesFull ? `Full (${item.servesFull})` : "Full"));
        let priceUsed = "";
        if(item.perPerson || (!item.priceHalf && item.priceFull)){ priceUsed = `$${item.priceFull}`; }
        else if(item.priceHalf && item.priceFull){ const p = (size === "half") ? item.priceHalf : item.priceFull; priceUsed = `$${p}`; }
        else { priceUsed = `$${item.priceFull}`; }
        if(item.name==="Cheesecake" || item.name==="Olive Oil Cake"){
          ordered.push(`${item.name} — Full (${item.servesFull}) x${qty} @ ${priceUsed}`);
        } else {
          ordered.push(`${item.name} — ${size} x${qty} @ ${priceUsed}`);
        }
      });
    }

    const subtotal = parseFloat(subtotalEl.textContent||"0");
    const service = parseFloat(serviceEl.textContent||"0");
    const total = parseFloat(totalEl.textContent||"0");
    const deposit = parseFloat(depositEl.textContent||"0");
    const est = estEl.textContent || "0";

    const summaryLines = [
      `Number of People: ${form.people.value||''}`,
      `Event Date: ${form.eventDate.value||''}`,
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
  });

  calculateTotals(); // initial totals
});
