/* ============================
   Shared Menu Utilities
   ============================ */

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')  // replace spaces/special chars with -
    .replace(/^-+|-+$/g, '');     // remove leading/trailing -
}

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

