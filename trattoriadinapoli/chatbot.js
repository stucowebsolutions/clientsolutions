/* ==========================================================
   Trattoria Chatbot Script
   - Handles message sending, responses, and toggle logic
   - Includes fuzzy keyword matching for robust replies
   ========================================================== */

// --- Element references ---
const toggleBtn = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const chatBody = document.getElementById('chatbot-body');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const humanChatBtn = document.getElementById('humanChatBtn');
const closeBtn = document.getElementById('chatbot-close');

// --- Show/Hide Chat Window ---
toggleBtn.addEventListener('click', () => {
  toggleBtn.style.display = 'none';
  chatContainer.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  toggleBtn.style.display = 'inline-block';
});

// --- Helper: Add message to chat window ---
function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'You' ? 'user' : 'bot');
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// --- Handle Send button + Enter key ---
sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

// --- “Speak with a human” Button ---
humanChatBtn.addEventListener('click', () => {
  if (parent && parent.showHumanChat) parent.showHumanChat();
});

// ==========================================================
// 🧠 MESSAGE LOGIC + FUZZY MATCHING
// ==========================================================

// Normalize text for comparison
function normalize(str) {
  return str.toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')     // normalize spaces
    .trim();
}

// Check if user input contains any of the keywords
function matches(input, keywords) {
  return keywords.some(keyword => input.includes(keyword));
}

// Handle input + bot response
function handleInput() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage('You', text);
  userInput.value = '';

  setTimeout(() => {
    const response = getResponse(text);
    addMessage('Bot', response.text);
    if (response.triggerHuman && parent && parent.showHumanChat) {
      setTimeout(() => parent.showHumanChat(), 800);
    }
  }, 600);
}

// ==========================================================
// 🤖 RESPONSE ENGINE (robust keyword matching)
// ==========================================================
function getResponse(input) {
  const msg = normalize(input);

  // Reservation-related
  if (matches(msg, ['reservation', 'reserve', 'book table', 'booking'])) {
    return { text: "Reservations aren't required, but you can make one on our homepage or by calling us. Recommended during busy hours!", triggerHuman: false };
  }

  // Dress code
  if (matches(msg, ['dress', 'attire', 'clothing', 'what to wear'])) {
    return { text: "No dress code here — come as you are!", triggerHuman: false };
  }

  // Hours / schedule
  if (matches(msg, ['hour', 'open', 'close', 'when are you open', 'time'])) {
    return { text: "We're open Tue–Thu 11am–9pm, and Fri/Sat 11am–10pm.", triggerHuman: false };
  }

  // Menu / food
  if (matches(msg, ['menu', 'food', 'dishes', 'what do you serve'])) {
    return { text: "Check out our lunch and dinner menus through the navigation links.", triggerHuman: false };
  }

  // Delivery
  if (matches(msg, ['delivery', 'deliver', 'doordash', 'uber eats'])) {
    return { text: "We don't deliver, but we do offer to-go orders!", triggerHuman: false };
  }

  // Gift cards
  if (matches(msg, ['gift', 'giftcard', 'gift card', 'voucher'])) {
    return { text: "Gift cards can be purchased by calling us directly.", triggerHuman: false };
  }

  // Gluten-free
  if (matches(msg, ['gluten', 'celiac', 'wheat'])) {
    return { text: "Gluten-free pasta, salads, and non-breaded chicken are available.", triggerHuman: false };
  }

  // Vegetarian
  if (matches(msg, ['vegetarian', 'veggie', 'plant based'])) {
    return { text: "We offer a vegetarian pizza and several salad options!", triggerHuman: false };
  }

  // Allergies
  if (matches(msg, ['allergy', 'allergies', 'allergen', 'nuts', 'dairy free'])) {
    return { text: "We do our best to accommodate allergies — just let your server know.", triggerHuman: false };
  }

  // Catering
  if (matches(msg, ['cater', 'catering', 'event', 'party tray', 'banquet'])) {
    return { text: "Yes, we cater! Requests can be made online, by phone, or by email.", triggerHuman: false };
  }

  // Human support
  if (matches(msg, ['human', 'person', 'representative', 'staff', 'employee'])) {
    return { text: "Sure thing — connecting you with a human now!", triggerHuman: true };
  }

  // Default fallback
  return { text: "I’m not sure about that, but I can connect you with a team member if you'd like.", triggerHuman: true };
}
