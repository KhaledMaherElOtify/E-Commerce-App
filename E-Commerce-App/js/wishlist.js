// تهيئة القائمة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
    updateWishlistCount();
});

// عرض عناصر القائمة
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('wishlist-items');

    if (wishlist.length === 0) {
        container.innerHTML = '<p>لا توجد منتجات في قائمة الرغبات</p>';
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
                <p>السعر: $${product.price.toFixed(2)}</p>
                <div class="wishlist-actions">
                    <button class="btn" onclick="addToCart(${product.id})">أضف إلى السلة</button>
                    <button class="btn" onclick="location.href='product-details.html?id=${product.id}'">التفاصيل</button>
                </div>
            </div>
        `;
    }).join('');
}

// تحديث العداد في الـ navbar
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('#wishlist-count').forEach(el => {
        el.textContent = wishlist.length;
    });
}

// إزالة عنصر من القائمة
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.productId !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    updateWishlistCount();
}

// هذه الدوال يجب أن تكون متاحة من ملفات أخرى
function addToCart(productId) {
    // نفس الدالة المستخدمة في cart.js
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('تمت إضافة المنتج إلى السلة');
    updateCartCount(); // تأكد من وجود هذه الدالة في auth.js
}