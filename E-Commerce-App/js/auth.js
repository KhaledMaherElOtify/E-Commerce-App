// User types
const USER_TYPES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer'
};

// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = {
        admins: [
            { id: 1, email: 'admin@example.com', password: 'admin123', name: 'Admin User', type: USER_TYPES.ADMIN }
        ],
        customers: []
    };
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Initialize current user if not exists
if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
}

// Initialize wishlist if not exists
if (!localStorage.getItem('wishlist')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
}

// Register form
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // Reset error messages
        document.getElementById('name-error').textContent = '';
        document.getElementById('reg-email-error').textContent = '';
        document.getElementById('reg-password-error').textContent = '';
        document.getElementById('confirm-password-error').textContent = '';
        document.getElementById('register-error').textContent = '';
        
        let isValid = true;
        
        // Validate name
        if (name === '') {
            document.getElementById('name-error').textContent = 'Name is required';
            isValid = false;
        }
        
        // Validate email
        if (email === '') {
            document.getElementById('reg-email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('reg-email-error').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            document.getElementById('reg-password-error').textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            document.getElementById('reg-password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }
        
        // Validate confirm password
        if (confirmPassword === '') {
            document.getElementById('confirm-password-error').textContent = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users'));
        const emailExists = [...users.admins, ...users.customers].some(user => user.email === email);
        
        if (emailExists) {
            document.getElementById('register-error').textContent = 'Email already registered';
            return;
        }
        
        // Create new customer
        const newCustomer = {
            id: Date.now(),
            name,
            email,
            password,
            type: USER_TYPES.CUSTOMER
        };
        
        users.customers.push(newCustomer);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login the new user
        localStorage.setItem('currentUser', JSON.stringify(newCustomer));
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Login form
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Reset error messages
        document.getElementById('email-error').textContent = '';
        document.getElementById('password-error').textContent = '';
        document.getElementById('login-error').textContent = '';
        
        let isValid = true;
        
        // Validate email
        if (email === '') {
            document.getElementById('email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            document.getElementById('password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check credentials
        const users = JSON.parse(localStorage.getItem('users'));
        const allUsers = [...users.admins, ...users.customers];
        const user = allUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            document.getElementById('login-error').textContent = 'Invalid email or password';
            return;
        }
        
        // Set current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on user type
        if (user.type === USER_TYPES.ADMIN) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    });
}

// Logout functionality
if (document.getElementById('logout-link') || document.getElementById('admin-logout-link')) {
    const logoutLinks = document.getElementById('logout-link') || document.getElementById('admin-logout-link');
    logoutLinks.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('currentUser', JSON.stringify(null));
        window.location.href = 'index.html';
    });
}

// Update navigation based on login status
function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        
        if (currentUser.type === USER_TYPES.ADMIN && adminLink) {
            adminLink.style.display = 'block';
        } else if (adminLink) {
            adminLink.style.display = 'none';
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

// Helper function to validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Show featured products on homepage
    if (document.getElementById('featured-products-container')) {
        loadFeaturedProducts();
    }
});

// Load featured products
function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const featuredProducts = products.slice(0, 4); // Get first 4 products as featured
    const container = document.getElementById('featured-products-container');
    
    if (featuredProducts.length === 0) {
        container.innerHTML = '<p>No featured products available.</p>';
        return;
    }
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn" onclick="addToWishlist(${product.id})">Wishlist</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart function (available globally)
function addToCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.productId === productId);
    
    if (productIndex !== -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
    
    // Update cart count in navigation
    updateCartCount();
}

// Add to wishlist function (available globally)
function addToWishlist(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html';
        return;
    }
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Product added to wishlist');
    } else {
        alert('Product already in wishlist');
    }
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    });
}