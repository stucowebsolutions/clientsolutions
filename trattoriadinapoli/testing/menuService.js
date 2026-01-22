/* ============================
   Menu Service (Shared)
   ============================ */

const MENU_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwXMbd0YpblLGWQ8W8KbVObTw715jz6TD4ug1b-FM-qo5q9v7LUZNU5p8wKdPw3z58/exec";

/**
 * Fetch menu data from GAS
 * @param {string} menuName - Sheet name (e.g. 'Lunch_Menu')
 */
async function fetchMenu(menuName) {
  const res = await fetch(`${MENU_ENDPOINT}?menu=${menuName}`);

  if (!res.ok) {
    throw new Error(`Failed to load menu: ${menuName}`);
  }

  return res.json();
}

/* ============================
   Price Formatting
   ============================ */

/**
 * Standard menu price formatter (Lunch / Fast Bites)
 * Uses dollar signs, no size labels
 */
function formatPrice({ small, large, fixed }) {
  if (fixed) return `$${fixed}`;

  if (small && large) {
    return `$${small} / $${large}`;
  }

  if (small) return `$${small}`;
  return "";
}

/**
 * Catering price formatter
 * Example: 45(Half) / 85(Full)
 * No dollar signs
 */
function formatCateringPrice({ small, large, fixed }) {
  if (fixed) return `${fixed}`;

  if (small && large) {
    return `${small}(Half) / ${large}(Full)`;
  }

  if (small) return `${small}`;
  return "";
}

/* ============================
   Catering Servings Formatting
   ============================ */

/**
 * Catering servings formatter
 * Example: Half Pan serves 10. Full Pan serves 20
 * Only used when numeric serving data exists
 */
function formatCateringServings({ small, large }) {
  if (small && large) {
    return `Half Pan serves ${small}. Full Pan serves ${large}`;
  }

  return "";
}
