/* ============================
   Lunch Menu
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("menu");

  // Add skeleton loader while fetching
  container.innerHTML = '<div class="skeleton skeleton-title"></div>'.repeat(5);

  try {
    const menu = await fetchMenu("Lunch_Menu");

    container.innerHTML = ""; // remove skeleton
    renderLunchMenu(menu);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load menu.</p>";
  }
});

function renderLunchMenu(menu) {
  const container = document.getElementById("menu");

  Object.entries(menu).forEach(([category, data]) => {
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderLunchItem(item));
    });
  });
}

function renderLunchItem(item) {
  const el = document.createElement("div");
  el.className = "menu-item";

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName}</span>
      <span class="menu-item-price">${formatPrice(item.price)}</span>
    </div>

    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ""}
  `;

  return el;
}
