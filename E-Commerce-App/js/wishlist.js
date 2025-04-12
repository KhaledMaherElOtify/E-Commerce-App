document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    updateWishlistCount();
});

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('wishlist-items');

    if (wishlist.length === 0) {
        container.innerHTML = '<p>No products in your wishlist.</p>';
        return;
    }

    container.innerHTML = wishlist.map(wishItem => {
        const product = products.find(p => p.id === wishItem.productId);
        if (!product) return '';
        
        return `
            <div class="wishlist-item" data-id="${product.id}">
                <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">×</button>
                <img src="${product.image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover;">
                <h3>${product.name}</h3>
                <p>price: $${product.price.toFixed(2)}</p>
                <div class="wishlist-actions">
                    <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn" onclick="location.href='product-details.html?id=${product.id}'">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('#wishlist-count').forEach(el => {
        el.textContent = wishlist.length;
    });
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    updateWishlistCount();
}

function addToCart(productId) {
   
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('product added to cart');
    updateCartCount(); 
}