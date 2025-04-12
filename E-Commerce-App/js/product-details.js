document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Get product data
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        window.location.href = 'products.html';
        return;
    }
    
    // Display product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-category').textContent = `Category: ${product.category}`;
    document.getElementById('product-stock').textContent = product.stockQuantity > 0 
        ? 'In Stock' 
        : 'Out of Stock';
    document.getElementById('product-description').textContent = product.description;
    
    // Handle images (assuming product.image is an array or single string)
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('thumbnails');
    
    if (Array.isArray(product.image)) {
        mainImage.src = product.image[0];
        product.image.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.addEventListener('click', () => {
                mainImage.src = img;
            });
            thumbnailsContainer.appendChild(thumb);
        });
    } else {
        mainImage.src = product.image;
    }
    
    // Add to Cart button
    document.getElementById('add-to-cart').addEventListener('click', function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId: product.id, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        updateCartCount();
    });
    
    // Add to Wishlist button
    document.getElementById('add-to-wishlist').addEventListener('click', function() {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (!wishlist.some(item => item.productId === product.id)) {
            wishlist.push({ 
                productId: product.id,
                dateAdded: new Date().toISOString()
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert(`${product.name} added to wishlist!`);
            updateWishlistCount();
        } else {
            alert('This product is already in your wishlist!');
        }
    });
});

// These functions should be in your auth.js
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('#wishlist-count').forEach(el => {
        el.textContent = wishlist.length;
    });
}