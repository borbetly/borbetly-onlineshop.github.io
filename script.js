const products = [
    { id: 1, name: "Valorant Points - 475 VP", price: 290.00, category: "vp", image: "", description: "Starter bundle" },
    { id: 2, name: "Valorant Points - 750 VP", price: 480.00, category: "vp", image: "", description: "Great value VP bundle" },
    { id: 3, name: "Valorant Points - 1650 VP", price: 890.00, category: "vp", image: "", description: "Most popular VP bundle" },
    { id: 4, name: "Valorant Points - 2500 VP", price: 1500.00, category: "vp", image: "", description: "Best value" },
    { id: 5, name: "Valorant Points - 5350 VP", price: 3000.00, category: "vp", image: "", description: "Premium VP bundle with bonus points" },
    { id: 6, name: "Reaver Vandal Skin", price: 1190.00, category: "skins", image: "", description: "Reaver Vandal" },
    { id: 7, name: "Forsaken Vandal Skin", price: 1300.00, category: "skins", image: "", description: "Forsaken Vandal skin" },
    { id: 8, name: "Reaver Karambit", price: 2370.00, category: "skins", image: "", description: "Premium melee weapon skin" },
    { id: 9, name: "Champions Bundle 2025", price: 4700.00, category: "bundles", image: "", description: "Complete Champions collection" },
    { id: 10, name: "Battle Pass", price: 1770.00, category: "bundles", image: "", description: "Battle pass" }
];

let currentCategory = 'all';

const renderProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grid = document.getElementById('catalog-grid');
    const filtered = currentCategory === 'all' ? products : products.filter(p => p?.category === currentCategory);
    
    grid.innerHTML = filtered.map(product => `
        <aside class="catalog-card">
            <aside class="catalog-image"><img src="${product?.image ?? ''}" alt="${product?.name}" width="150" height="150"></aside>
            <h3>${product?.name}</h3>
            <p class="catalog-description">${product?.description}</p>
            <p class="catalog-price">₱${(product?.price ?? 0).toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart({...this.product})">Add to Cart</button>
        </aside>
    `).join('');
    
    grid.querySelectorAll('.add-to-cart-btn').forEach((btn, i) => {
        btn.product = filtered[i];
        btn.onclick = () => addToCart(filtered[i]);
    });
};

const setupFilters = () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this?.dataset?.category;
            await renderProducts();
        });
    });
};

const initProductsPage = async () => {
    const grid = document.getElementById('catalog-grid');
    if (grid) {
        await renderProducts();
        setupFilters();
    }
};

const loadCart = () => {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.style.display = 'none';
        const emptyMsg = document.getElementById('empty-cart-message');
        if (emptyMsg) emptyMsg.style.display = 'block';
        const summary = document.querySelector('.cart-summary');
        if (summary) summary.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item?.image ?? 'placeholder.png'}" alt="${item?.name}" width="80" height="80">
            </div>
            <div class="item-info">
                <h4>${item?.name}</h4>
                <p class="item-price">₱${(item?.price ?? 0).toFixed(2)}</p>
                <p class="item-description">${item?.description ?? 'Premium item'}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantityAndReload(${i}, ${(item?.quantity ?? 1) - 1})">-</button>
                <input type="number" class="qty-input" value="${item?.quantity ?? 1}" readonly>
                <button class="qty-btn" onclick="updateQuantityAndReload(${i}, ${(item?.quantity ?? 1) + 1})">+</button>
            </div>
            <div class="item-total">
                <p>₱${((item?.price ?? 0) * (item?.quantity ?? 1)).toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeAndReload(${i})">✕</button>
        </div>
    `).join('');
    
    updateSummary();
};

const updateQuantityAndReload = (index, quantity) => {
    updateQuantity(index, quantity);
    loadCart();
};

const removeAndReload = (index) => {
    removeFromCart(index);
    loadCart();
};

const updateSummary = () => {
    const { subtotal, tax, total } = calculateTotals();
    const cart = getCart();
    const itemCount = cart.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);

    const subtotalEl = document.getElementById('subtotal');
    const itemCountEl = document.getElementById('item-count');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = '₱' + subtotal.toFixed(2);
    if (itemCountEl) itemCountEl.textContent = itemCount;
    if (taxEl) taxEl.textContent = '₱' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '₱' + total.toFixed(2);
};

const proceedToCheckout = () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    window.location.href = 'payment.html';
};

const continueShopping = () => window.location.href = 'products.html';

const initCartPage = () => {
    const container = document.getElementById('cart-items-container');
    if (container) loadCart();
};

const loadCartItems = () => {
    const cart = getCart();
    const list = document.getElementById('cart-items-list');
    
    if (!list) return;
    
    if (cart.length === 0) {
        list.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    list.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <h4>${item?.name}</h4>
                <p class="item-quantity">Qty: ${item?.quantity}</p>
            </div>
            <div class="item-price">
                ₱${((item?.price ?? 0) * (item?.quantity ?? 1)).toFixed(2)}
            </div>
        </div>
    `).join('');
};

const updateOrderSummary = () => {
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = '₱' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = '₱' + shipping.toFixed(2);
    if (taxEl) taxEl.textContent = '₱' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '₱' + total.toFixed(2);
};

const setupPaymentForm = () => {
    document.querySelectorAll('input[name="delivery"]')?.forEach(input => {
        input?.addEventListener('change', updateOrderSummary);
    });

    document.querySelectorAll('input[name="payment"]')?.forEach(input => {
        input?.addEventListener('change', togglePaymentFields);
    });

    document.getElementById('card-number')?.addEventListener('input', formatCardNumber);
    document.getElementById('card-expiry')?.addEventListener('input', formatExpiryDate);
    document.getElementById('card-cvv')?.addEventListener('input', formatCVV);

    togglePaymentFields();
};

const togglePaymentFields = () => {
    const cardSection = document.getElementById('card-details-section');
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    if (cardSection) {
        cardSection.style.display = ['credit', 'debit'].includes(payment) ? 'block' : 'none';
    }
};

const validateForm = () => {
    const required = ['email', 'full-name', 'phone', 'address', 'city', 'province', 'postal'];
    const allFilled = required.every(id => document.getElementById(id)?.value?.trim());
    
    if (!allFilled) {
        alert('Please fill in all required fields');
        return false;
    }

    if (!document.getElementById('terms')?.checked) {
        alert('Please agree to the Terms and Conditions');
        return false;
    }

    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    if (['credit', 'debit'].includes(payment)) {
        const cardNumber = document.getElementById('card-number')?.value?.replace(/\s/g, '');
        const cvv = document.getElementById('card-cvv')?.value;
        
        if (cardNumber?.length !== 16 || cvv?.length !== 3) {
            alert('Invalid card details');
            return false;
        }
    }

    return true;
};

const processPayment = async () => {
    if (!validateForm()) return;

    const paymentData = {
        email: document.getElementById('email')?.value,
        fullName: document.getElementById('full-name')?.value,
        phone: document.getElementById('phone')?.value,
        address: document.getElementById('address')?.value,
        city: document.getElementById('city')?.value,
        province: document.getElementById('province')?.value,
        postal: document.getElementById('postal')?.value,
        country: document.getElementById('country')?.value,
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value,
        deliveryOption: document.querySelector('input[name="delivery"]:checked')?.value
    };

    localStorage.setItem('paymentDetails', JSON.stringify(paymentData));
    alert('Payment processed successfully!');
    window.location.href = 'transact.html';
};

const goBack = () => window.location.href = 'cart.html';

const initPaymentPage = async () => {
    const list = document.getElementById('cart-items-list');
    if (list) {
        loadCartItems();
        setupPaymentForm();
        updateOrderSummary();
    }
};

const populateReceipt = () => {
    const cart = getCart();
    const itemsBody = document.getElementById('receipt-items-body');
    
    if (!itemsBody) return;
    
    const itemsHTML = cart.map(item => `
        <tr>
            <td>${item?.name}</td>
            <td>${item?.quantity}</td>
            <td>₱${(item?.price ?? 0).toFixed(2)}</td>
            <td>₱${((item?.price ?? 0) * (item?.quantity ?? 1)).toFixed(2)}</td>
        </tr>
    `).join('');

    itemsBody.innerHTML = itemsHTML || '<tr><td colspan="4" style="text-align: center;">No items found</td></tr>';

    const { subtotal, shipping, tax, total } = calculateTotals();
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total-amount');

    if (subtotalEl) subtotalEl.textContent = '₱' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = '₱' + shipping.toFixed(2);
    if (taxEl) taxEl.textContent = '₱' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '₱' + total.toFixed(2);

    const orderIdEl = document.getElementById('order-id');
    const transactionIdEl = document.getElementById('transaction-id');
    
    if (orderIdEl) orderIdEl.textContent = '#VT-' + generateOrderID();
    if (transactionIdEl) transactionIdEl.textContent = 'TRX-' + generateTransactionID();
};

const updateDateTime = () => {
    const now = new Date();
    const dateEl = document.getElementById('transaction-date');
    const timeEl = document.getElementById('transaction-time');
    
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
};

const printReceipt = () => window.print();

const downloadReceipt = () => alert('Receipt download feature coming soon!');

const goToHome = () => {
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
};

const initTransactPage = async () => {
    const itemsBody = document.getElementById('receipt-items-body');
    if (itemsBody) {
        populateReceipt();
        updateDateTime();
    }
};

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    
    const userData = JSON.parse(localStorage.getItem('userData') ?? '{}');
    
    if (userData?.email && userData.email === email) {
        localStorage.setItem('isLoggedIn', 'true');
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Login successful! Welcome back.');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password. Please sign up first.');
    }
};

const initLoginPage = () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
};

const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name')?.value;
    const lastName = document.getElementById('last-name')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const mobile = document.getElementById('mobile')?.value;
    const address = document.getElementById('address')?.value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
        address: address
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    alert('Account created successfully! Welcome, ' + firstName + '!');
    window.location.href = 'profile.html';
};

const initSignUpPage = () => {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUpSubmit);
    }
};

const loadUserProfile = () => {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '{}');
    
    if (userData?.firstName) {
        const profileFirstName = document.getElementById('profile-first-name');
        const profileLastName = document.getElementById('profile-last-name');
        const profileEmail = document.getElementById('profile-email');
        const profileMobile = document.getElementById('profile-mobile');
        const profileAddress = document.getElementById('profile-address');
        const profileFullName = document.getElementById('profile-full-name');
        const profileInitials = document.getElementById('profile-initials');

        if (profileFirstName) profileFirstName.textContent = userData.firstName;
        if (profileLastName) profileLastName.textContent = userData.lastName;
        if (profileEmail) profileEmail.textContent = userData.email;
        if (profileMobile) profileMobile.textContent = userData?.mobile ?? '-';
        if (profileAddress) profileAddress.textContent = userData?.address ?? '-';
        
        const fullName = userData.firstName + ' ' + userData.lastName;
        if (profileFullName) profileFullName.textContent = fullName;
        
        const initials = (userData.firstName.charAt(0) + userData.lastName.charAt(0)).toUpperCase();
        if (profileInitials) profileInitials.textContent = initials;
    } else {
        alert('No profile data found. Please sign up first.');
        window.location.href = 'sign-up.html';
    }
};

const initProfilePage = async () => {
    await initializeHeader();
    loadUserProfile();
};

const handleContactSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    alert('Thank you, ' + name + '! Your message has been sent successfully.');
    e.target.reset();
};

const initContactPage = async () => {
    await initializeHeader();
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
};

const initIndexPage = async () => {
    await initializeHeader();
};

document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    
    if (path.includes('index') || path.endsWith('/')) await initIndexPage();
    if (path.includes('products')) await initProductsPage();
    if (path.includes('cart')) await initCartPage();
    if (path.includes('payment')) await initPaymentPage();
    if (path.includes('transact')) await initTransactPage();
    if (path.includes('login')) await initLoginPage();
    if (path.includes('sign-up')) await initSignUpPage();
    if (path.includes('profile')) await initProfilePage();
    if (path.includes('contact')) await initContactPage();
});
