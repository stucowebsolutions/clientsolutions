const MENU_ENDPOINT = "https://script.google.com/macros/s/AKfycbwatAsc-09YgBpHczXp3Za8f287kRSH2oJHD5olfuzg7CfzTmMv0v0GWQe3MMmelw/exec";

async function loadCateringMenu() {
  try {
    const res = await fetch(MENU_ENDPOINT);
    const menu = await res.json();

    const container = document.getElementById('catering-menu-container');
    container.innerHTML = ''; // clear placeholder

    for (const category in menu) {
      // Create category header
      const catHeader = document.createElement('div');
      catHeader.className = 'catering-category';
      catHeader.textContent = category;
      container.appendChild(catHeader);

      // Render each item
      menu[category].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'catering-item';

        // Item Name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'catering-item-name';
        nameDiv.textContent = item.item_name;
        itemDiv.appendChild(nameDiv);

        // Pricing
        const pricingDiv = document.createElement('div');
        pricingDiv.className = 'catering-item-pricing';

        // Determine which price to show
        let priceText = '';
        if (item.ordering_type === 'half_full_pan') {
          priceText = `${item.half_pan_price ? '$'+item.half_pan_price : ''} / ${item.full_pan_price ? '$'+item.full_pan_price : ''}`;
        } else if (item.ordering_type === 'fixed_quantity') {
          priceText = item.fixed_quantity ? item.fixed_quantity : '';
        } else if (item.ordering_type === 'per_person') {
          priceText = item.per_person_price ? '$'+item.per_person_price+' per person' : '';
        }
        pricingDiv.textContent = priceText;
        itemDiv.appendChild(pricingDiv);

        // Description
        if (item.description) {
          const descDiv = document.createElement('div');
          descDiv.className = 'catering-item-description';
          descDiv.textContent = item.description;
          itemDiv.appendChild(descDiv);
        }

        container.appendChild(itemDiv);
      });
    }
  } catch (err) {
    console.error('Error loading catering menu:', err);
    document.getElementById('catering-menu-container').textContent = 'Failed to load menu.';
  }
}

// Load menu on page load
document.addEventListener('DOMContentLoaded', loadCateringMenu);
