/* ============================
   Shared Menu Utilities & Loader
============================ */

const MENU_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz9cPiTEWGhnLM-euQLMSek-TtVDsQzVzEQpH9-ni4vebaqPn0Z0SGEQI6UL0cJTH3F/exec";

/* -------- Slugify -------- */
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')  // replace spaces/special chars with -
    .replace(/^-+|-+$/g, '');     // remove leading/trailing -
}

/* -------- Skeleton Loader -------- */
function renderSkeletonLoader(count = 6) {
  const wrapper = document.createElement("div");
  wrapper.className = "menu-skeleton-wrapper";

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.src = "https://stucowebsolutions.github.io/clientsolutions/trattoriadinapoli/testing/Circle.jpg";
    img.className = "skeleton-pizza";
    wrapper.appendChild(img);
  }

  return wrapper.outerHTML;
}

/* -------- Fetch Menu -------- */
async function fetchMenu(menuName) {
  const res = await fetch(`${MENU_ENDPOINT}?menu=${menuName}`);
  if (!res.ok) throw new Error(`Failed to load menu: ${menuName}`);
  return res.json();
}

/* -------- Render Category -------- */
function renderCategoryHeader(title, description) {
  const el = document.createElement("div");
  el.className = "menu-category";
  el.id = slugify(title);

  el.innerHTML = `
    <h2 class="menu-category-title">${title}</h2>
    ${description ? `<p class="menu-category-description">${description}</p>` : ""}
  `;
  return el;
}

/* -------- Render Item -------- */
function renderMenuItem(item, isCatering = false) {
  const el = document.createElement("div");
  el.className = "menu-item";

  const price = isCatering ? formatCateringPrice(item.price) : formatPrice(item.price);
  const servings = isCatering ? formatCateringServings(item.servings) : "";

  const imgTag = item.imageName
    ? `<img class="menu-item-image" src="https://stucowebsolutions.github.io/clientsolutions/trattoriadinapoli/testing/${item.imageName}" alt="${item.itemName}">`
    : "";

  const caption = item.imageCaption ? `<div class="menu-item-caption">${item.imageCaption}</div>` : "";

  el.innerHTML = `
    ${imgTag}
    ${caption}
    <div class="menu-item-header">
      <span class="menu-item-name">${item.itemName}</span>
      <span class="menu-item-price">${price}</span>
    </div>
    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description.replace(/\n/g, "<br>")}</div>` : ""}
    ${servings ? `<div class="menu-item-servings">${servings}</div>` : ""}
  `;

  return el;
}

/* -------- Render Full Menu -------- */
function renderMenu(menu, container, options = { isCatering: false }) {
  Object.entries(menu).forEach(([category, data]) => {
    container.appendChild(renderCategoryHeader(category, data.description));
    data.items.forEach(item => container.appendChild(renderMenuItem(item, options.isCatering)));
  });
}

/* -------- Price Formatters -------- */
function formatPrice({ small, large, fixed }) {
  if (fixed) return `${fixed}`;
  if (small && large) return `${small} / ${large}`;
  if (small) return `${small}`;
  return "";
}

function formatCateringPrice({ small, large, fixed }) {
  if (fixed) return `${fixed}`;
  if (small && large) return `${small}(Half) / ${large}(Full)`;
  if (small) return `${small}`;
  return "";
}

function formatCateringServings({ small, large }) {
  if (small && large) return `Half Pan serves ${small}. Full Pan serves ${large}`;
  return "";
}
