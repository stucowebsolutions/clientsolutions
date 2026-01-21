/* ============================
   Menu Renderer (Shared)
============================ */

/**
 * Render category header
 */
function renderCategoryHeader(title, description) {
  const el = document.createElement("div");
  el.className = "menu-category";

  el.innerHTML = `
    <h2 class="menu-category-title">${title}</h2>
    ${description ? `<p class="menu-category-description">${description}</p>` : ""}
  `;

  return el;
}

/**
 * Render a menu item (works for all menus)
 */
function renderMenuItem(item, isCatering = false) {
  const el = document.createElement("div");
  el.className = `menu-item${isCatering ? " catering" : ""}`;

  const priceText = formatPrice(item.price, isCatering);
  const servingsText = isCatering ? formatServings(item.servings) : "";

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName || ""}</span>
      <span class="menu-item-price">${priceText}</span>
    </div>

    ${item.sizeLabel ? `<div class="menu-item-size">${item.sizeLabel}</div>` : ""}
    ${servingsText ? `<div class="menu-item-servings">${servingsText}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ""}
    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
  `;

  return el;
}

/**
 * Render full menu
 */
function renderMenu(menuData, containerSelector, isCatering = false) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  Object.entries(menuData).forEach(([category, data]) => {
    const catEl = renderCategoryHeader(category, data.description);
    container.appendChild(catEl);

    data.items.forEach(item => {
      catEl.appendChild(renderMenuItem(item, isCatering));
    });
  });
}
