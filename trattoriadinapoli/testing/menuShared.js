/* ============================
   Shared Menu Rendering
============================ */

/**
 * Render a category header with anchor ID
 * @param {string} title
 * @param {string} description
 */
function renderCategoryHeader(title, description) {
  const el = document.createElement("div");
  el.className = "menu-category";
  // Create a safe ID for anchor links
  const anchorId = title.toLowerCase().replace(/\s+/g, "-");

  el.id = anchorId;
  el.innerHTML = `
    <h2 class="menu-category-title">${title}</h2>
    ${description ? `<p class="menu-category-description">${description}</p>` : ""}
  `;

  // Add a horizontal line below category title
  const hr = document.createElement("hr");
  el.appendChild(hr);

  return el;
}

/**
 * Generate top-of-page jump links for categories
 * @param {Array<string>} categories - array of category titles
 */
function renderCategoryNav(categories) {
  const nav = document.getElementById("menu-nav");
  if (!nav) return;

  nav.innerHTML = ""; // Clear existing links
  categories.forEach(title => {
    const link = document.createElement("a");
    link.href = `#${title.toLowerCase().replace(/\s+/g, "-")}`;
    link.textContent = title;
    nav.appendChild(link);
  });
}

/**
 * Utility: Clear skeleton loader after menu is rendered
 */
function clearSkeleton() {
  const container = document.getElementById("menu");
  const skeletons = container.querySelectorAll(".skeleton");
  skeletons.forEach(s => s.remove());
}
