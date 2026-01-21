/* ============================
   Fast Bites Menu
============================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const menu = await fetchMenu("Fast_Bites_Menu");
    renderMenu(menu, "#menu"); // Fast Bites menu, isCatering = false
  } catch (err) {
    console.error("Failed to load Fast Bites Menu:", err);
  }
});
