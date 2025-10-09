const toggleBtn = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const chatBody = document.getElementById('chatbot-body');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const humanChatBtn = document.getElementById('humanChatBtn');
const closeBtn = document.getElementById('chatbot-close');

toggleBtn.addEventListener('click', () => {
  toggleBtn.style.display = 'none';
  chatContainer.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  toggleBtn.style.display = 'block';
});

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'You' ? 'user' : 'bot');
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

sendBtn.addEventListener('click', handleInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleInput();
});

humanChatBtn.addEventListener('click', () => {
  if (parent && parent.showHumanChat) {
    parent.showHumanChat();
  }
});

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
  }, 700);
}

function getResponse(input) {
  const msg = input.toLowerCase();

  if (msg.includes('reservation')) return { text: "Reservations aren't required, but you can make one on our homepage or by calling us. Recommended during busy hours!", triggerHuman: false };
  if (msg.includes('dress')) return { text: "No dress code here — come as you are!", triggerHuman: false };
  if (msg.includes('hours')) return { text: "We're open Tue–Thu 11am–9pm, and Fri/Sat 11am–10pm.", triggerHuman: false };
  if (msg.includes('menu')) return { text: "Check out our lunch and dinner menus through the navigation links.", triggerHuman: false };
  if (msg.includes('delivery')) return { text: "We don't deliver, but we do offer to-go orders!", triggerHuman: false };
  if (msg.includes('gift')) return { text: "Gift cards can be purchased by calling us directly.", triggerHuman: false };
  if (msg.includes('gluten')) return { text: "Gluten-free pasta, salads, and non-breaded chicken are available.", triggerHuman: false };
  if (msg.includes('vegetarian')) return { text: "We offer a vegetarian pizza and several salad options!", triggerHuman: false };
  if (msg.includes('allergy') || msg.includes('allergen')) return { text: "We do our best to accommodate allergies — just let your server know.", triggerHuman: false };
  if (msg.includes('cater')) return { text: "Yes, we cater! Requests can be made online, by phone, or by email.", triggerHuman: false };
  if (msg.includes('human')) return { text: "Sure thing — connecting you with a human now!", triggerHuman: true };

  return { text: "I’m not sure about that, but I can connect you with a team member if you'd like.", triggerHuman: true };
}
