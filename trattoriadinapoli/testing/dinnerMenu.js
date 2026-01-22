/* ============================
   Dinner Menu
============================ */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("menu");

  // Skeleton loader
  container.innerHTML = '<div class="skeleton skeleton-title"></div>'.repeat(6);

  try {
    const menu = await fetchMenu("Dinner_Menu");
    container.innerHTML = "";
    renderDinnerMenu(menu);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load menu.</p>";
  }
});

function renderDinnerMenu(menu) {
  const container = document.getElementById("menu");

  Object.entries(menu).forEach(([category, data]) => {
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderDinnerItem(item));
    });
  });
}

function renderDinnerItem(item) {
  const el = document.createElement("div");
  el.className = "menu-item";

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName}</span>
      <span class="menu-item-price">${formatPrice(item.price)}</span>
    </div>

    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description.replace(/\n/g, "<br>")}</div>` : ""}
  `;

  return el;
}
