// Product Data based on uploaded images with prices in the ₦35,000 - ₦40,000 range
const products = [
  {
    id: 1,
    title: "Absond Black Sigil Longsleeve",
    price: 38000,
    image: "00_full_shirt_reference - Copy.jpg",
    description: "Heavyweight black cotton longsleeve featuring intricate distressed metal typography and graphic sleeves."
  },
  {
    id: 2,
    title: "Absond White Ghost Longsleeve",
    price: 36500,
    image: "1 (2).jpg",
    description: "Off-white washed cotton longsleeve with custom ethereal chest branding and textured sleeve patterns."
  },
  {
    id: 3,
    title: "Absond Spiderweb Edition Back View",
    price: 39000,
    image: "2 (2).jpg",
    description: "Signature web-back design paired with heavy cotton weave and signature neck prints."
  },
  {
    id: 4,
    title: "Absond Lightning Storm Cargo Pants",
    price: 40000,
    image: "7.jpg",
    description: "Relaxed fit dark streetwear cargo trousers featuring contrast lightning piping and distressed hem finishes."
  }
];

let cart = [];
let selectedSize = 'M';
let currentActiveProduct = null;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const sizeOptions = document.querySelectorAll('.size-btn');
const modalAddToCart = document.getElementById('modalAddToCart');

const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCount = document.getElementById('cartCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

// Format number to Naira currency
function formatNaira(amount) {
  return '₦' + amount.toLocaleString();
}

// Render Products Grid
function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <div class="product-title">${product.title}</div>
        <div class="product-price">${formatNaira(product.price)}</div>
      </div>
    </div>
  `).join('');
}

// Open Product Modal
window.openProductModal = function(id) {
  currentActiveProduct = products.find(p => p.id === id);
  if (!currentActiveProduct) return;

  modalImg.src = currentActiveProduct.image;
  modalTitle.textContent = currentActiveProduct.title;
  modalPrice.textContent = formatNaira(currentActiveProduct.price);
  
  productModal.classList.add('active');
}

// Close Modal
function closeModal() {
  productModal.classList.remove('active');
}

modalClose.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeModal();
});

// Size Selection Logic
sizeOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeOptions.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.dataset.size;
  });
});

// Add to Cart from Modal
modalAddToCart.addEventListener('click', () => {
  if (!currentActiveProduct) return;

  const cartItemIndex = cart.findIndex(
    item => item.id === currentActiveProduct.id && item.size === selectedSize
  );

  if (cartItemIndex > -1) {
    cart[cartItemIndex].quantity += 1;
  } else {
    cart.push({
      ...currentActiveProduct,
      size: selectedSize,
      quantity: 1
    });
  }

  updateCartUI();
  closeModal();
  openCartDrawer();
});

// Cart Drawer Toggles
function openCartDrawer() {
  cartDrawer.classList.add('open');
  drawerOverlay.classList.add('active');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  drawerOverlay.classList.remove('active');
}

cartToggle.addEventListener('click', openCartDrawer);
closeCart.addEventListener('click', closeCartDrawer);
drawerOverlay.addEventListener('click', closeCartDrawer);

// Update Cart Display & Totals
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Your bag is empty.</p>`;
    cartTotalPrice.textContent = formatNaira(0);
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-meta">Size: ${item.size} | Qty: ${item.quantity}</div>
        <div class="cart-item-price">${formatNaira(item.price * item.quantity)}</div>
        <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
      </div>
    </div>
  `).join('');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = formatNaira(totalPrice);
}

// Remove Item from Cart
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Checkout Button Click
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your bag is empty.');
    return;
  }
  alert('Thank you for shopping with ABSOND! Proceeding to secure checkout...');
  cart = [];
  updateCartUI();
  closeCartDrawer();
});

// Initialize App
renderProducts();
// Checkout Button Click with EmailJS Integration
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your bag is empty.');
    return;
  }

  // Format cart items into a readable text list for the email
  const itemsSummary = cart.map(item => `- ${item.title} (Size: ${item.size}, Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
  
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Parameters matching your EmailJS template variables
  const templateParams = {
    cart_items: itemsSummary,
    total_amount: totalPrice.toLocaleString()
  };

  // Replace with your actual EmailJS Service ID and Template ID
  const serviceID = 'service_abc123'; // Replace with your actual EmailJS Service ID    
  const templateID = 'template_oi0g8v2';

  // Send email via EmailJS
  emailjs.send(serviceID, templateID, templateParams)
    .then((response) => {
       alert('Order placed successfully! Details have been sent to your Gmail.');
       cart = [];
       updateCartUI();
       closeCartDrawer();
    }, (error) => {
       console.error('FAILED...', error);
       alert('Checkout failed to send notification email. Please try again.');
    });
});