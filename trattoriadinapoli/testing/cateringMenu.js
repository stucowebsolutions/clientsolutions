/* ============================
   Catering Menu
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Catering_Menu");
    renderCateringMenu(menu);
  } catch (err) {
    console.error(err);
  }
});

function renderCateringMenu(menu) {
  const container = document.getElementById("menu");

  Object.entries(menu).forEach(([category, data]) => {
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderCateringItem(item));
    });
  });
}

function renderCateringItem(item) {
  const el = document.createElement("div");
  el.className = "menu-item catering";

  const priceText = formatPrice(item.price);
  const servingsText = formatServings(item.servings);

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.name}</span>
      <span class="menu-item-price">${priceText}</span>
    </div>

    ${item.sizeLabel
      ? `<div class="menu-item-size">${item.sizeLabel}</div>`
      : ""}

    ${servingsText
      ? `<div class="menu-item-servings">${servingsText}</div>`
      : ""}

    ${item.choice
      ? `<div class="menu-item-choice">${item.choice}</div>`
      : ""}

    ${item.description
      ? `<div class="menu-item-description">${item.description}</div>`
      : ""}
  `;

  return el;
}
