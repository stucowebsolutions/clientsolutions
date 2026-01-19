const MENU_ENDPOINT = "https://script.google.com/macros/s/AKfycbzHZh1cxpyVnQDdD0GuU95wWbhQTplJ7_w4--jEhqQLAuKY89RaOi51S-t18kFdyCdl/exec";

async function loadCateringMenu() {
  try {
    const res = await fetch(MENU_ENDPOINT);
    const menu = await res.json();

    const container = document.getElementById('catering-menu-container');
    container.innerHTML = ''; // clear placeholder

    for (const category in menu) {
      // Filter active items
      const activeItems = menu[category].filter(item => item.active !== false && item.active !== "FALSE" && item.active !== 0 && item.active !== "");

      if (activeItems.length === 0) continue; // skip empty categories

      // Category header
      const catHeader = document.createElement('div');
      catHeader.className = 'catering-category';
      catHeader.textContent = category;
      container.appendChild(catHeader);

      // Render each item
      activeItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'catering-item';

        // Left section: Name, size/servings, description
        const leftDiv = document.createElement('div');
        leftDiv.className = 'catering-item-left';

        // Name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'catering-item-name';
        nameDiv.textContent = item.item_name;
        leftDiv.appendChild(nameDiv);

        // Size/Servings
        let sizeText = '';
        if (item.ordering_type === 'half_full_pan') {
          sizeText = `${item.serves_half_pan ? 'Half: ' + item.serves_half_pan : ''}${item.serves_full_pan ? ' / Full: ' + item.serves_full_pan : ''}`;
        } else if (item.ordering_type === 'fixed_quantity') {
          sizeText = item.fixed_quantity ? item.fixed_quantity : '';
        } else if (item.ordering_type === 'per_person') {
          sizeText = item.per_person_price ? item.per_person_price + ' per person' : '';
        }
        if (sizeText) {
          const sizeDiv = document.createElement('div');
          sizeDiv.className = 'catering-item-size';
          sizeDiv.textContent = sizeText;
          leftDiv.appendChild(sizeDiv);
        }

        // Description
        if (item.description) {
          const descDiv = document.createElement('div');
          descDiv.className = 'catering-item-description';
          descDiv.textContent = item.description;
          leftDiv.appendChild(descDiv);
        }

        itemDiv.appendChild(leftDiv);

        // Right section: Pricing
        const rightDiv = document.createElement('div');
        rightDiv.className = 'catering-item-right';

        let priceText = '';
        switch(item.ordering_type) {
          case 'half_full_pan':
            if (item.half_pan_price) priceText += `$${item.half_pan_price} (Half)`;
            if (item.full_pan_price) priceText += (priceText ? ' / ' : '') + `$${item.full_pan_price} (Full)`;
            break;
          case 'fixed_quantity':
            if (item.fixed_price) priceText = `$${item.fixed_price}`;
            break;
          case 'per_person':
            if (item.per_person_price) priceText = `$${item.per_person_price} per person`;
            break;
        }
        rightDiv.textContent = priceText;
        itemDiv.appendChild(rightDiv);

        container.appendChild(itemDiv);
      });
    }
  } catch (err) {
    console.error('Error loading catering menu:', err);
    document.getElementById('catering-menu-container').textContent = 'Failed to load menu.';
  }
}

document.addEventListener('DOMContentLoaded', loadCateringMenu);
