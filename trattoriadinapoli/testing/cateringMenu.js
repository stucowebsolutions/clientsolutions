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
  const categories = Object.keys(menu);

  categories.forEach(category => {
    const data = menu[category];
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderCateringItem(item));
    });
  });

  renderCategoryNav(categories);
  clearSkeleton();
}

function renderCateringItem(item) {
  const el = document.createElement("div");
  el.className = "menu-item catering";

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName}</span>
      <span class="menu-item-price">${formatPrice(item.price)}</span>
    </div>

    ${item.sizeLabel ? `<div class="menu-item-size">${item.sizeLabel}</div>` : ""}
    ${item.servings.small || item.servings.large
      ? `<div class="menu-item-servings">${formatServings(item.servings)}</div>`
      : ""}
    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${item.description
      ? `<div class="menu-item-description">${item.description}</div>`
      : ""}
  `;

  return el;
}
