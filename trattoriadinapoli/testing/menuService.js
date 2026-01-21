/* ============================
   Menu Service (Shared)
============================ */

const MENU_ENDPOINT =
  "https://script.google.com/macros/s/AKfycby0Wni3IlZM2l13bdXrekk895IDFG-mmxnkaTN7u-T6utxLR1XIpBulmcnzeymkw4Ku/exec";

/**
 * Fetch menu data from GAS
 * @param {string} menuName - Sheet name (e.g. 'Lunch_Menu')
 */
async function fetchMenu(menuName) {
  const res = await fetch(`${MENU_ENDPOINT}?menu=${menuName}`);
  if (!res.ok) throw new Error(`Failed to load menu: ${menuName}`);
  return res.json();
}

/**
 * Format price display safely
 */
function formatPrice({ small, large, fixed }, isCatering = false) {
  if (fixed) return isCatering ? `${fixed}` : `$${fixed}`;
  if (small && large) return isCatering ? `${small}(Half)/${large}(Full)` : `$${small} / $${large}`;
  if (small) return isCatering ? `${small}` : `$${small}`;
  return "";
}

/**
 * Format serving counts (catering only)
 */
function formatServings({ small, large }) {
  const parts = [];
  if (small) parts.push(small);
  if (large) parts.push(large);
  return parts.length ? parts.join("–") : "";
}
