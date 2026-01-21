/* ============================
   Catering Menu
============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Catering_Menu");
    renderMenu(menu, "#menu", true); // Catering menu, isCatering = true
  } catch (err) {
    console.error("Failed to load Catering Menu:", err);
  }
});
