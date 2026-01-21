function renderCategoryHeader(title, description) {
  const el = document.createElement("div");
  el.className = "menu-category";

  el.innerHTML = `
    <h2 class="menu-category-title">${title}</h2>
    ${description
      ? `<p class="menu-category-description">${description}</p>`
      : ""}
  `;

  return el;
}
