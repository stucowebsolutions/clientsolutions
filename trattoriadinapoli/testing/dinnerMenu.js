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
  el.className = "menu-item dinner";

  // Format price for half/full servings or single price
  const priceText = formatPrice(item.price);

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName}</span>
      <span class="menu-item-price">${priceText}</span>
    </div>

    ${item.sizeLabel ? `<div class="menu-item-size">${item.sizeLabel}</div>` : ""}
    ${item.servings.small || item.servings.large ? `<div class="menu-item-servings">${formatServings(item.servings)}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ""}
    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
  `;

  // Render children (protein add-ons) if any
  if (item.children && item.children.length) {
    const childrenContainer = document.createElement("div");
    childrenContainer.className = "menu-item-children";

    item.children.forEach(child => {
      const childEl = document.createElement("div");
      childEl.className = "menu-item-child";

      childEl.innerHTML = `
        <span class="menu-item-name">${child.itemName}</span>
        ${child.price ? `<span class="menu-item-price">${formatPrice(child.price)}</span>` : ""}
        ${child.description ? `<div class="menu-item-description">${child.description}</div>` : ""}
        ${child.choice ? `<div class="menu-item-choice">${child.choice}</div>` : ""}
      `;

      childrenContainer.appendChild(childEl);
    });

    el.appendChild(childrenContainer);
  }

  return el;
}
