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
