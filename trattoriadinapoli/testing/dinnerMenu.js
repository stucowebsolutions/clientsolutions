/* ============================
   Dinner Menu
   ============================ */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("menu");

  // Initial skeletons for perceived load time
  container.innerHTML = '<div class="skeleton skeleton-title"></div>'.repeat(5);

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

  // Determine if this is a Protein Add-On header
  const isProteinAddOn = item.itemName && item.itemName.toLowerCase().includes("protein add-on");

  let descriptionHtml = "";

  if (item.description) {
    // Render protein options as separate lines if this is a protein add-on
    if (isProteinAddOn) {
      const lines = item.description.split("\n");
      descriptionHtml = lines.map(line => `<div class="menu-item-description">${line.trim()}</div>`).join("");
    } else {
      descriptionHtml = `<div class="menu-item-description">${item.description}</div>`;
    }
  }

  // Format price
  let priceText = "";
  if (item.price) {
    priceText = formatPrice(item.price);
  } else if (item.PriceFixed || item.PriceSmall || item.PriceLarge) {
    // fallback for legacy fields
    priceText = formatPrice({
      small: item.PriceSmall,
      large: item.PriceLarge,
      fixed: item.PriceFixed
    });
  }

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName ?? ""}</span>
      <span class="menu-item-price">${priceText}</span>
    </div>

    ${item.sizeLabel ? `<div class="menu-item-size">${item.sizeLabel}</div>` : ""}
    ${item.servings ? `<div class="menu-item-servings">${formatServings(item.servings)}</div>` : ""}
    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${descriptionHtml}
  `;

  return el;
}
