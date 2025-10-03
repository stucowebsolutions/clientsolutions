document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // STYLE CONFIG
  // ----------------------------
  const bubbleImage = "https://stucowebsolutions.github.io/clientsolutions/trattoriadinapoli/assets/chat-icon.png";

  // ----------------------------
  // CREATE CHAT BUTTON
  // ----------------------------
  const chatButton = document.createElement("div");
  chatButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: #fff url(${bubbleImage}) center/cover no-repeat;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    z-index: 9999;
  `;
  document.body.appendChild(chatButton);

  // ----------------------------
  // CREATE CHAT WINDOW
  // ----------------------------
  const chatWindow = document.createElement("div");
  chatWindow.style.cssText = `
    display: none;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 320px;
    height: 420px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
    overflow: hidden;
    z-index: 10000;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
  `;
  document.body.appendChild(chatWindow);

  // ----------------------------
  // CHAT CONTENT AREA
  // ----------------------------
  chatWindow.innerHTML = `
    <div style="background:#e63946; color:white; padding:10px; font-weight:bold; font-size:16px; text-align:center;">
      Restaurant Assistant
    </div>
    <div id="chatLog" style="flex:1; padding:10px; overflow-y:auto; font-size:14px;"></div>
    <div style="padding:6px; border-top:1px solid #ddd; display:flex;">
      <input id="chatInput" type="text" placeholder="Type your question..." 
        style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px;" />
      <button id="chatSend" style="margin-left:6px; background:#e63946; color:white; border:none; border-radius:6px; padding:0 12px; cursor:pointer;">
        Send
      </button>
    </div>
    <div style="padding:6px; border-top:1px solid #ddd; text-align:center;">
      <button id="liveChatBtn" style="background:#444; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer; font-size:13px;">
        Switch to Live Chat
      </button>
    </div>
  `;

  const chatLog = chatWindow.querySelector("#chatLog");
  const chatInput = chatWindow.querySelector("#chatInput");
  const chatSend = chatWindow.querySelector("#chatSend");
  const liveChatBtn = chatWindow.querySelector("#liveChatBtn");

  // ----------------------------
  // FAQ DATA
  // ----------------------------
  const faqs = [
    { q: /(reservation|book|table)/i,
      a: [
        "Reservations aren't required.",
        "They are available through our homepage or by calling us.",
        "Reservations are recommended during peak hours."
      ]},
    { q: /(dress code)/i, a: ["No dress code."] },
    { q: /(hour|open|close)/i, a: ["Tue–Thu: 11am–9pm", "Fri/Sat: 11am–10pm"] },
    { q: /(menu)/i, a: ["Our menus can be viewed using the navigation links.", "We have both a lunch and a dinner menu."] },
    { q: /(delivery|deliver)/i, a: ["We do not deliver.", "We do offer to-go orders."] },
    { q: /(gift card)/i, a: ["Gift card purchases can be made by calling us."] },
    { q: /(gluten)/i, a: ["We have gluten-free pasta and salad options.", "We also offer non-breaded chicken."] },
    { q: /(vegetarian|veggie)/i, a: ["We offer a vegetarian pizza and several salads."] },
    { q: /(allergen|allergy|safe)/i, a: ["We try to accommodate allergies as much as possible."] },
    { q: /(cater|catering)/i, a: [
      "Yes, we do catering.",
      "Our catering menu can be viewed on our website.",
      "Requests can be made via the website, by calling us, or by email."
    ]}
  ];

  // ----------------------------
  // FUNCTIONS
  // ----------------------------
  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.style.margin = "6px 0";
    msg.style.padding = "8px 10px";
    msg.style.borderRadius = "8px";
    msg.style.maxWidth = "80%";
    msg.style.wordWrap = "break-word";
    if (sender === "user") {
      msg.style.background = "#e63946";
      msg.style.color = "white";
      msg.style.marginLeft = "auto";
      msg.innerText = text;
    } else {
      msg.style.background = "#f1f1f1";
      msg.style.color = "#000";
      msg.style.marginRight = "auto";
      msg.innerText = text;
    }
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight; // auto-scroll
  }

  function botReply(messages, i = 0) {
    if (i >= messages.length) return;
    setTimeout(() => {
      appendMessage("bot", messages[i]);
      botReply(messages, i + 1);
    }, i === 0 ? 300 : 1000); // first immediate, next with delay
  }

  function handleUserInput() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage("user", text);
    chatInput.value = "";

    let answered = false;
    for (const faq of faqs) {
      if (faq.q.test(text)) {
        botReply(faq.a);
        answered = true;
        break;
      }
    }
    if (!answered) {
      botReply(["I'm not sure about that. You can switch to Live Chat below."]);
    }
  }

  // ----------------------------
  // EVENT LISTENERS
  // ----------------------------
  chatButton.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
  });

  chatSend.addEventListener("click", handleUserInput);
  chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleUserInput();
  });

  liveChatBtn.addEventListener("click", () => {
    chatWindow.innerHTML = `
      <iframe src="https://example.com/godaddy-livechat" 
        style="width:100%; height:100%; border:none;"></iframe>
    `;
  });

  // ----------------------------
  // INITIAL GREETING
  // ----------------------------
  botReply(["Hi! I’m your assistant. Ask me about reservations, hours, menu, or catering."]);
});
