// === Trattoria Chatbot Logic with Combo-Priority Matching ===

// --- Element references ---
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatbot-body");

// --- Helper: Add message to chat window ---
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// --- Input normalization ---
function normalize(input) {
  let msg = input.toLowerCase();
  msg = msg.replace(/[^a-z0-9\s]/g, ""); // remove punctuation
  msg = msg.replace(/([a-z])\1{2,}/g, "$1"); // reduce repeated letters
  msg = msg.replace(/\s+/g, " "); // normalize spaces
  return msg.trim();
}

// --- Fuzzy match ---
function fuzzyMatch(msg, root) {
  const pattern = new RegExp(root.split("").join(".{0,2}"), "i");
  return pattern.test(msg);
}

// --- Combo match ---
// All keywords in the array must appear
function comboMatch(msg, keywords) {
  return keywords.every(word => fuzzyMatch(msg, word));
}

// --- Ask helper ---
// Prioritize combo matches (arrays) over single keywords (strings)
function ask(msg, patterns) {
  // First, check for combo arrays
  for (let p of patterns) {
    if (Array.isArray(p) && comboMatch(msg, p)) return true;
  }
  // Then check single keywords
  return patterns.some(p => typeof p === "string" && fuzzyMatch(msg, p));
}

// --- Core chatbot logic ---
function getResponse(input) {
  const msg = normalize(input);

  // Combo-priority list
  if (ask(msg, [ ["menu","vegetarian"], ["menu","vegan"], ["vegetarian"], ["veggie"], ["vegan"] ])) {
    return { text: "We offer a vegetarian pizza and several salad options!", triggerHuman: false };
  }

  if (ask(msg, [["reservation"], ["book","table"], "reserve","booking"])) {
    return { text: "Reservations aren't required, but you can make one on our homepage or by calling us. Recommended during busy hours!", triggerHuman: false };
  }

  if (ask(msg, [["dress"], ["attire"], "clothes"])) {
    return { text: "No dress code here — come as you are!", triggerHuman: false };
  }

  if (ask(msg, [["hours"], ["open","time"], ["closing"], "when"])) {
    return { text: "We're open Tue–Thu 11am–9pm, and Fri/Sat 11am–10pm.", triggerHuman: false };
  }

  if (ask(msg, [["gluten"], ["celiac"], ["gf"]])) {
    return { text: "Gluten-free pasta, salads, and non-breaded chicken are available.", triggerHuman: false };
  }

  if (ask(msg, [["allergy"], ["allergen"], ["nuts"], ["peanut"], ["dairy"]])) {
    return { text: "We do our best to accommodate allergies — just let your server know.", triggerHuman: false };
  }

  if (ask(msg, [["menu"], ["food"], ["dishes"], ["lunch"], ["dinner"]])) {
    return { text: "Check out our lunch and dinner menus through the navigation links.", triggerHuman: false };
  }

  if (ask(msg, [["delivery"], ["deliver"], ["door"], ["to go"], ["takeout"], ["carryout"]])) {
    return { text: "We don't deliver, but we do offer to-go orders!", triggerHuman: false };
  }

  if (ask(msg, [["gift"], ["card"], ["certificate"], ["giftcard"]])) {
    return { text: "Gift cards can be purchased by calling us directly.", triggerHuman: false };
  }

  if (ask(msg, [["cater"], ["catering"], ["event"], ["party"], ["order","large"]])) {
    return { text: "Yes, we cater! Requests can be made online, by phone, or by email.", triggerHuman: false };
  }

  if (ask(msg, [["human"], ["person"], ["representative"], ["someone"], ["staff"]])) {
    return { text: "I’m not sure about that one — but you can reach our team instantly using the live chat widget in the bottom right corner of your screen!", triggerHuman: false };
  }

  return {   return { text: "I’m not sure about that one — but you can reach a team member instantly using the live chat widget in the bottom right corner of your screen!", 
    triggerHuman: false };
}

// --- Send message handler ---
function handleSend() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage("user", input);
  userInput.value = "";

  const response = getResponse(input);
  setTimeout(() => addMessage("bot", response.text), 400);
}

// --- Event Listeners ---
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") handleSend();
});

// --- Initial Greeting ---
window.addEventListener("DOMContentLoaded", () => {
  addMessage("bot", "Hello! 👋 I'm TrattBot. Ask me anything about our menu, hours, or catering services!");
});
