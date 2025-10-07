(function() {
  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://stucowebsolutions.github.io/clientsolutions/trattoriadinapoli/chatbot.html';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '360px';
  iframe.style.height = '500px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '999999';
  iframe.style.borderRadius = '12px';
  iframe.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
  iframe.style.transition = 'opacity 0.3s ease';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';

  // Add to page
  document.body.appendChild(iframe);

  // Create the bubble button
  const bubble = document.createElement('div');
  bubble.style.position = 'fixed';
  bubble.style.bottom = '20px';
  bubble.style.right = '20px';
  bubble.style.width = '60px';
  bubble.style.height = '60px';
  bubble.style.background = '#fff url(https://username.github.io/chatbot-widget/assets/bubble.png) center/cover no-repeat';
  bubble.style.borderRadius = '50%';
  bubble.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '1000000';
  document.body.appendChild(bubble);

  // Toggle chat visibility
  bubble.addEventListener('click', () => {
    if (iframe.style.opacity === '0') {
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';
    } else {
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
    }
  });
})();
