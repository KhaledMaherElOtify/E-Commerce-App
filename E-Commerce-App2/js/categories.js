// Admin categories management
if (document.getElementById('categories-admin-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadAdminCategories();
        
        // Add category button
        document.getElementById('add-category-btn').addEventListener('click', function() {
            openCategoryModal();
        });
        
        // Category modal form
        document.getElementById('category-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveCategory();
        });
        
        // Close modal
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal('category-modal');
            });
        });
    });
}

// Load categories in admin panel
function loadAdminCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const container = document.getElementById('categories-admin-container');
    
    if (categories.length === 0) {
        container.innerHTML = '<p>No categories found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${categories.map((category, index) => `
                    <tr>
                        <td>${category}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editCategory(${index})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteCategory(${index})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Open category modal for add/edit
function openCategoryModal(category = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('category-modal-title');
    const form = document.getElementById('category-form');
    
    if (category !== null) {
        title.textContent = 'Edit Category';
        document.getElementById('category-id').value = category.index;
        document.getElementById('category-name').value = category.name;
    } else {
        title.textContent = 'Add Category';
        form.reset();
        document.getElementById('category-id').value = '';
    }
    
    modal.style.display = 'block';
}

// Save category (add or update)
function saveCategory() {
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value.trim();
    
    // Basic validation
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    if (id !== '') {
        // Update existing category
        const index = parseInt(id);
        if (index >= 0 && index < categories.length) {
            categories[index] = name;
        }
    } else {
        // Add new category
        categories.push(name);
    }
    
    localStorage.setItem('categories', JSON.stringify(categories));
    closeModal('category-modal');
    loadAdminCategories();
    
    // Reload products if on products page to reflect category changes
    if (document.getElementById('products-container')) {
        loadProducts();
        loadCategoriesFilter();
    }
    
    // Reload category filter in product modal if open
    if (document.getElementById('product-modal').style.display === 'block') {
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Edit category
function editCategory(index) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    if (index >= 0 && index < categories.length) {
        openCategoryModal({ index, name: categories[index] });
    }
}

// Delete category
function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category? Products in this category will not be deleted.')) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));
        loadAdminCategories();
        
        // Reload products if on products page to reflect category changes
        if (document.getElementById('products-container')) {
            loadProducts();
            loadCategoriesFilter();
        }
    }
}