/* ============================
   Shared Menu Utilities & Loader + Modal
============================ */

const MENU_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz9cPiTEWGhnLM-euQLMSek-TtVDsQzVzEQpH9-ni4vebaqPn0Z0SGEQI6UL0cJTH3F/exec";

/* -------- Slugify -------- */
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* =========================
   Rolling Pizza Loader (4s min)
========================= */

let loaderStartTime = 0;

function renderSkeletonLoader() {
  loaderStartTime = Date.now();

  return `
    <div class="menu-skeleton-wrapper">
      <img 
        src="https://stucowebsolutions.github.io/clientsolutions/trattoriadinapoli/testing/Circle.jpg"
        class="skeleton-pizza"
        alt="Loading menu"
      />
    </div>
  `;
}

function ensureMinimumLoaderTime() {
  const elapsed = Date.now() - loaderStartTime;
  const remaining = 4000 - elapsed;
  return remaining > 0
    ? new Promise(resolve => setTimeout(resolve, remaining))
    : Promise.resolve();
}

/* -------- Fetch Menu -------- */
async function fetchMenu(menuName) {
  const res = await fetch(`${MENU_ENDPOINT}?menu=${menuName}`);
  if (!res.ok) throw new Error(`Failed to load menu: ${menuName}`);
  return res.json();
}

/* =========================
   Render Category
========================= */

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

/* =========================
   Render Item (Modal Version)
========================= */

function renderMenuItem(item, isCatering = false) {
  const el = document.createElement("div");
  el.className = "menu-item";

  const price = isCatering
    ? formatCateringPrice(item.price)
    : formatPrice(item.price);

  const servings = isCatering
    ? formatCateringServings(item.servings)
    : "";

  const hasImage = !!item.image;

  el.innerHTML = `
    <div class="menu-item-header">
      <span class="menu-item-name">
        ${item.itemName}
        ${hasImage ? `
          <span class="menu-item-icon" data-image="${item.image}" data-caption="${item.imageCaption || ''}">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm8-12h-3.17l-1.84-2h-6l-1.84 2h-3.17c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2z"/>
            </svg>
          </span>
        ` : ""}
      </span>
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
    data.items.forEach(item =>
      container.appendChild(renderMenuItem(item, options.isCatering))
    );
  });
}

/* =========================
   Modal Logic (Scoped to menu-page)
========================= */

function initMenuModal(menuPage) {
  const modal = document.createElement("div");
  modal.className = "menu-modal";

  modal.innerHTML = `
    <div class="menu-modal-overlay"></div>
    <div class="menu-modal-content">
      <img class="menu-modal-image" />
      <div class="menu-modal-caption"></div>
    </div>
  `;

  menuPage.appendChild(modal);

  const overlay = modal.querySelector(".menu-modal-overlay");
  const content = modal.querySelector(".menu-modal-content");
  const img = modal.querySelector(".menu-modal-image");
  const caption = modal.querySelector(".menu-modal-caption");

  function openModal(src, cap) {
    img.src = src;
    caption.textContent = cap || "";
    modal.classList.add("active");
    menuPage.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("active");
    menuPage.classList.remove("modal-open");
    img.classList.remove("zoomed");
  }

  overlay.addEventListener("click", closeModal);

  img.addEventListener("click", e => {
    e.stopPropagation();
    img.classList.toggle("zoomed");
  });

  // Swipe down close
  let startY = 0;
  content.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });

  content.addEventListener("touchmove", e => {
    const delta = e.touches[0].clientY - startY;
    if (delta > 100) closeModal();
  });

  // Delegated icon click
  menuPage.addEventListener("click", e => {
    const icon = e.target.closest(".menu-item-icon");
    if (!icon) return;

    e.stopPropagation();
    openModal(icon.dataset.image, icon.dataset.caption);
  });
}

/* =========================
   Price Formatters
========================= */

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

function formatCateringServings({ a, b }) {
  if (a && b) return `Half Pan serves ${a}. Full Pan serves ${b}`;
  return "";
}
