// Initialize products in localStorage if not exists
if (!localStorage.getItem('products')) {
    const defaultProducts = [
        {
            id: 1,
            name: 'Smartphone X',
            image: 'images/4.png',
            category: 'Electronics',
            price: 699.99,
            description: 'Latest smartphone with advanced features',
            stockQuantity: 50
        },
        {
            id: 2,
            name: 'Wireless Headphones',
            image: 'images/5.jpg',
            category: 'Electronics',
            price: 149.99,
            description: 'Noise-cancelling wireless headphones',
            stockQuantity: 30
        },
        {
            id: 3,
            name: 'Running Shoes',
            image: 'images/badrek.jpg',
            category: 'Sports',
            price: 89.99,
            description: 'Comfortable running shoes for all terrains',
            stockQuantity: 40
        },
        {
            id: 4,
            name: 'Coffee Maker',
            image: 'images/fish.jpg',
            category: 'Home',
            price: 59.99,
            description: 'Automatic coffee maker with timer',
            stockQuantity: 25
        }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}

// Initialize categories in localStorage if not exists
if (!localStorage.getItem('categories')) {
    const defaultCategories = ['Electronics', 'Sports', 'Home', 'Clothing', 'Books'];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
}

// Load products on products page
if (document.getElementById('products-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadProducts();
        loadCategoriesFilter();
        
        // Apply filters button
        document.getElementById('apply-filters').addEventListener('click', function() {
            loadProducts();
        });
    });
}

// Load products with filters
function loadProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchFilter = document.getElementById('search-filter').value.toLowerCase();
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Apply filters
    if (categoryFilter) {
        products = products.filter(product => product.category === categoryFilter);
    }
    
    if (searchFilter) {
        products = products.filter(product => 
            product.name.toLowerCase().includes(searchFilter) || 
            product.description.toLowerCase().includes(searchFilter)
        );
    }
    
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn" onclick="addToWishlist(${product.id})">Wishlist</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load categories for filter dropdown
function loadCategoriesFilter() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryFilter = document.getElementById('category-filter');
    
    // Clear existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add categories to filter
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Admin products management
if (document.getElementById('products-admin-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadAdminProducts();
        
        // Add product button
        document.getElementById('add-product-btn').addEventListener('click', function() {
            openProductModal();
        });
        
        // Product modal form
        document.getElementById('product-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
        
        // Close modal
        document.querySelector('.close-modal').addEventListener('click', function() {
            closeModal('product-modal');
        });
    });
}

// Load products in admin panel
function loadAdminProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('products-admin-container');
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.stockQuantity}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Open product modal for add/edit
function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categorySelect = document.getElementById('product-category');
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Add categories to select
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    if (product) {
        title.textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-stock').value = product.stockQuantity;
    } else {
        title.textContent = 'Add Product';
        form.reset();
        document.getElementById('product-id').value = '';
    }
    
    modal.style.display = 'block';
}

// Save product (add or update)
function saveProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const stockQuantity = parseInt(document.getElementById('product-stock').value);
    
    // Basic validation
    if (!name || !image || !category || isNaN(price) || !description || isNaN(stockQuantity)) {
        alert('Please fill in all fields with valid values');
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = {
                id: parseInt(id),
                name,
                image,
                category,
                price,
                description,
                stockQuantity
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now(),
            name,
            image,
            category,
            price,
            description,
            stockQuantity
        };
        products.push(newProduct);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    closeModal('product-modal');
    loadAdminProducts();
}

// Edit product
function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    if (product) {
        openProductModal(product);
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
    }
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}