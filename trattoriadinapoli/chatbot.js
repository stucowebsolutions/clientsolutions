// === Trattoria Chatbot Logic ===
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatbot-body");

// === Helper: Add message to chat window ===
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// === Input normalization for robustness ===
function normalize(input) {
  return input
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// === Smart keyword matching ===
function includesAny(msg, keywords) {
  return keywords.some(k => msg.includes(k));
}

// === Core Response Logic ===
function getResponse(input) {
  const msg = normalize(input);

  if (includesAny(msg, ["reservation", "book", "table"]))
    return { text: "Reservations aren't required, but you can make one on our homepage or by calling us. Recommended during busy hours!", triggerHuman: false };

  if (includesAny(msg, ["dress", "attire"]))
    return { text: "No dress code here — come as you are!", triggerHuman: false };

  if (includesAny(msg, ["hours", "open", "closing"]))
    return { text: "We're open Tue–Thu 11am–9pm, and Fri/Sat 11am–10pm.", triggerHuman: false };

  if (includesAny(msg, ["menu", "food", "dishes"]))
    return { text: "Check out our lunch and dinner menus through the navigation links.", triggerHuman: false };

  if (includesAny(msg, ["delivery", "deliver", "door"]))
    return { text: "We don't deliver, but we do offer to-go orders!", triggerHuman: false };

  if (includesAny(msg, ["gift", "card"]))
    return { text: "Gift cards can be purchased by calling us directly.", triggerHuman: false };

  if (includesAny(msg, ["gluten", "celiac"]))
    return { text: "Gluten-free pasta, salads, and non-breaded chicken are available.", triggerHuman: false };

  if (includesAny(msg, ["vegetarian", "veggie", "vegan"]))
    return { text: "We offer a vegetarian pizza and several salad options!", triggerHuman: false };

  if (includesAny(msg, ["allergy", "allergen", "nuts"]))
    return { text: "We do our best to accommodate allergies — just let your server know.", triggerHuman: false };

  if (includesAny(msg, ["cater", "catering", "event"]))
    return { text: "Yes, we cater! Requests can be made online, by phone, or by email.", triggerHuman: false };

  if (includesAny(msg, ["human", "person", "representative"]))
    return { text: "Sure thing — connecting you with a human now!", triggerHuman: true };

  return { text: "I’m not sure about that, but I can connect you with a team member if you'd like.", triggerHuman: true };
}

// === Send message handler ===
function handleSend() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage("user", input);
  userInput.value = "";

  const response = getResponse(input);
  setTimeout(() => addMessage("bot", response.text), 400);
}

// === Event Listeners ===
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
