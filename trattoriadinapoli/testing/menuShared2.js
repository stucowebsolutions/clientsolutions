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

  const hasImage = !!item.image;

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">
        ${item.itemName}
        ${hasImage ? `<span class="menu-item-icon">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm8-12h-3.17l-1.84-2h-6l-1.84 2h-3.17c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2z"/>
  </svg>
</span>
` : ""}
      </span>
      <span class="menu-item-price">${price}</span>
    </div>

    ${item.choice ? `<div class="menu-item-choice">${item.choice}</div>` : ""}
    ${item.description ? `<div class="menu-item-description">${item.description.replace(/\n/g, "<br>")}</div>` : ""}
    ${servings ? `<div class="menu-item-servings">${servings}</div>` : ""}

    ${hasImage ? `
      <div class="menu-item-image-wrapper">
        <img class="menu-item-image" src="${item.image}" alt="${item.itemName}">
        ${item.imageCaption ? `<div class="menu-item-caption">${item.imageCaption}</div>` : ""}
      </div>
    ` : ""}
  `;

  if (hasImage) {
    const icon = el.querySelector(".menu-item-icon");
    icon.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent bubbling
      el.classList.toggle("expanded");
    });
  }

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
function formatPrice({ a, b, fixed }) {
  if (fixed) return `${fixed}`;
  if (a && b) return `${a} / ${b}`;
  if (a) return `${a}`;
  return "";
}


function formatCateringPrice({ a, b, fixed }) {
  if (fixed) return `${fixed}`;
  if (a && b) return `${a}(Half) / ${b}(Full)`;
  if (a) return `${a}`;
  return "";
}

function formatCateringServings({ small, large }) {
  if (small && large) return `Half Pan serves ${small}. Full Pan serves ${large}`;
  return "";
}
