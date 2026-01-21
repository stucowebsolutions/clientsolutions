/* ============================
   Lunch Menu
============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Lunch_Menu");
    renderMenu(menu, "#menu"); // Lunch menu, isCatering = false
  } catch (err) {
    console.error("Failed to load Lunch Menu:", err);
  }
});
