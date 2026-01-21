/* ============================
   Fast Bites Menu
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Fast_Bites_Menu");
    renderFastBitesMenu(menu);
  } catch (err) {
    console.error(err);
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
      <span class="menu-item-name">${item.name}</span>
      <span class="menu-item-price">
        ${formatPrice(item.price)}
      </span>
    </div>

    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}

    ${item.description
      ? `<div class="menu-item-description">${item.description}</div>`
      : ""}
  `;

  return el;
}
