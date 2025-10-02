// chatbot.js
document.addEventListener("DOMContentLoaded", () => {
  // Create floating chat button
  const chatButton = document.createElement("div");
  chatButton.innerText = "💬 Chat";
  chatButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #e63946;
    color: white;
    padding: 12px 16px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(chatButton);

  // Create chatbot window
  const chatWindow = document.createElement("div");
  chatWindow.style.cssText = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    height: 400px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    overflow: hidden;
    z-index: 10000;
    font-family: sans-serif;
  `;
  chatWindow.innerHTML = `
    <div style="background:#e63946;color:white;padding:10px;font-weight:bold">
      Restaurant FAQ Bot
    </div>
    <div id="chat-messages" style="height:300px;overflow-y:auto;padding:10px;font-size:14px"></div>
    <div style="padding:8px;border-top:1px solid #ddd">
      <input id="chat-input" type="text" placeholder="Ask me something..."
        style="width:80%;padding:6px;border:1px solid #ccc;border-radius:6px">
      <button id="chat-send" style="padding:6px 10px;background:#e63946;color:white;border:none;border-radius:6px;cursor:pointer">Send</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // Toggle chat
  chatButton.onclick = () => {
    chatWindow.style.display = (chatWindow.style.display === "none") ? "block" : "none";
  };

  // FAQ logic
  const faqs = [
    { q: /menu/i, a: "You can view our Lunch, Dinner, and Fast Bites menus right on the website." },
    { q: /vegetarian|vegan/i, a: "Yes, we offer several vegetarian options. Look for the 🥦 icon on our menu." },
    { q: /cater/i, a: "We offer catering! Visit the Catering page or call us to learn more." },
    { q: /location|address/i, a: "We’re located at 123 Main St, YourCity." },
    { q: /special/i, a: "Check out our Specials calendar for food truck events and seasonal offers." },
  ];

  function botReply(msg) {
    const messages = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.innerHTML = msg;
    div.style.cssText = "margin:6px 0;padding:6px;background:#f1f1f1;border-radius:6px";
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function userReply(msg) {
    const messages = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.innerHTML = msg;
    div.style.cssText = "margin:6px 0;padding:6px;background:#e63946;color:white;border-radius:6px;text-align:right";
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  document.getElementById("chat-send").onclick = () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    userReply(text);

    let answered = false;
    for (let faq of faqs) {
      if (faq.q.test(text)) {
        botReply(faq.a);
        answered = true;
        break;
      }
    }

    if (!answered) {
      botReply(`I'm not sure about that. Would you like to chat with our team? <br>
        <a href="#" onclick="document.querySelector('#original-chat-widget').click()">Open Live Chat</a>`);
    }

    input.value = "";
  };
});
