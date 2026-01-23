/* ============================
   Fast Bites Menu
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("menu");

  container.innerHTML = '<div class="skeleton skeleton-title"></div>'.repeat(5);

  try {
    const menu = await fetchMenu("Fast_Bites_Menu");

    container.innerHTML = "";
    renderFastBitesMenu(menu);
     
     } 
  catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load menu.</p>";
  }
});

function renderFastBitesMenu(menu) {
  const container = document.getElementById("menu");

  Object.entries(menu).forEach(([category, data]) => {
    container.appendChild(renderCategoryHeader(category, data.description));

    data.items.forEach(item => {
      container.appendChild(renderFastBitesItem(item));
    });
  });
}

function renderFastBitesItem(item) {
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
