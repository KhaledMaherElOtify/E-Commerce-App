// Initialize cart in localStorage if not exists
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Load cart on cart page
if (document.getElementById('cart-items-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCart();
        
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', function() {
            checkout();
        });
    });
}

// Load cart items
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('cart-items-container');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        subtotalElement.textContent = '$0.00';
        taxElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        return;
    }
    
    let subtotal = 0;
    
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <p>Item Total: $${itemTotal.toFixed(2)}</p>
                    <span class="remove-item" onclick="removeFromCart(${product.id})">Remove</span>
                </div>
            </div>
        `;
    }).join('');
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update quantity of cart item
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Checkout process
function checkout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to proceed to checkout');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Calculate order total
    let subtotal = 0;
    const orderItems = [];
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    // Create order
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Save order
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    
    alert('Order placed successfully! It will be processed after admin confirmation.');
    window.location.href = 'orders.html';
}
// 