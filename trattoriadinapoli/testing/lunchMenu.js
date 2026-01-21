/* ============================
   Lunch Menu
============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Lunch_Menu");
    renderLunchMenu(menu);
  } catch (err) {
    console.error(err);
  }
});

function renderLunchMenu(menu) {
  const container = document.getElementById("menu");
  const categories = Object.keys(menu);

  categories.forEach(category => {
    const data = menu[category];
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderLunchItem(item));
    });
  });

  // Add category jump links
  renderCategoryNav(categories);
  // Remove skeleton loaders
  clearSkeleton();
}

function renderLunchItem(item) {
  const el = document.createElement("div");
  el.className = "menu-item";

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
