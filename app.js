const CONFIG = {
    TAX_RATE: 0.12,
    DELIVERY_OPTIONS: {
        standard: { price: 50.00, name: 'Standard Delivery' },
        express: { price: 150.00, name: 'Express Delivery' },
        overnight: { price: 300.00, name: 'Overnight Delivery' }
    }
};

const initializeHeader = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const headerNav = document.querySelector('.header-nav');
    
    if (!headerNav) return;
    
    headerNav.innerHTML = isLoggedIn 
        ? `<a href="cart.html" class="cart-btn"><img src="cart-icon.png" alt="Shopping Cart" class="cart-icon"><span class="cart-badge" id="cart-badge" style="display:none;">0</span></a>
           <a href="profile.html" class="profile-btn">P</a>
           <button class="logout-btn" onclick="logout()">Logout</button>`
        : `<a href="cart.html" class="cart-btn"><img src="cart-icon.png" alt="Shopping Cart" class="cart-icon"><span class="cart-badge" id="cart-badge" style="display:none;">0</span></a>
           <a href="login.html" class="login-btn">Login</a>`;
    
    updateCartBadge();
};

const updateCartBadge = () => {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
};

const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    alert('Logged out successfully');
    window.location.href = 'index.html';
};

const getCart = () => JSON.parse(localStorage.getItem('cart') ?? '[]');

const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

const addToCart = async (product) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let cart = getCart();
    const existingItem = cart.find(item => item?.id === product?.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart(cart);
    updateCartBadge();
    alert(`${product?.name} added to cart!`);
};

const removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
};

const updateQuantity = (index, quantity) => {
    const cart = getCart();
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart(cart);
    }
};

const clearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        localStorage.removeItem('cart');
    }
};

const calculateTotals = () => {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += (item?.price ?? 0) * (item?.quantity ?? 0);
    });
    
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked')?.value ?? 'standard';
    const shipping = CONFIG.DELIVERY_OPTIONS[selectedDelivery]?.price ?? 0;
    const tax = subtotal * CONFIG.TAX_RATE;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
};

const generateOrderID = () => Math.random().toString().substring(2, 11).toUpperCase();

const generateTransactionID = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return today + '-' + Math.random().toString().substring(2, 6);
};

const formatCardNumber = (e) => {
    const value = e?.target?.value?.replace(/\s/g, '') ?? '';
    e.target.value = value.match(/.{1,4}/g)?.join(' ') ?? value;
};

const formatExpiryDate = (e) => {
    let value = e?.target?.value?.replace(/\D/g, '') ?? '';
    e.target.value = value.length >= 2 ? value.slice(0, 2) + '/' + value.slice(2, 4) : value;
};

const formatCVV = (e) => {
    e.target.value = e?.target?.value?.replace(/[^0-9]/g, '') ?? '';
};

document.addEventListener('DOMContentLoaded', async () => {
    await initializeHeader();
});
