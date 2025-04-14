// Initialize orders in localStorage if not exists
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}

// Load orders on orders page
if (document.getElementById('orders-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCustomerOrders();
    });
}

// Load orders in admin panel
if (document.getElementById('orders-admin-container')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadAllOrders();
    });
}

// Load customer orders
function loadCustomerOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        document.getElementById('orders-container').innerHTML = '<p>Please login to view your orders.</p>';
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customerOrders = orders.filter(order => order.userId === currentUser.id);
    const container = document.getElementById('orders-container');
    
    if (customerOrders.length === 0) {
        container.innerHTML = '<p>You have no orders yet.</p>';
        return;
    }
    
    // Sort orders by date (newest first)
    customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = customerOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <p>Order #${order.id}</p>
                    <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                    <span class="order-status status-${order.status}">${order.status}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div class="order-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                            <p>Item Total: $${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <p>Order Total: $${order.total.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Load all orders in admin panel
function loadAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('orders-admin-container');
    
    if (orders.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const customer = users.customers.find(u => u.id === order.userId) || {};
                    
                    return `
                        <tr>
                            <td>${order.id}</td>
                            <td>${customer.name || 'N/A'} (${order.userId})</td>
                            <td>${new Date(order.date).toLocaleDateString()}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td>
                                <span class="order-status status-${order.status}">${order.status}</span>
                            </td>
                            <td>
                                ${order.status === 'pending' ? `
                                    <button class="action-btn edit-btn" onclick="updateOrderStatus(${order.id}, 'confirmed')">Confirm</button>
                                    <button class="action-btn delete-btn" onclick="updateOrderStatus(${order.id}, 'rejected')">Reject</button>
                                ` : ''}
                                <button class="action-btn" onclick="viewOrderDetails(${order.id})">View</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Update order status (admin only)
function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadAllOrders();
    }
}

// View order details (admin only)
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        alert(`Order Details:\n\nOrder ID: ${order.id}\nCustomer ID: ${order.userId}\nStatus: ${order.status}\nDate: ${new Date(order.date).toLocaleDateString()}\n\nItems:\n${
            order.items.map(item => `- ${item.name} ($${item.price.toFixed(2)} x ${item.quantity})`).join('\n')
        }\n\nSubtotal: $${order.subtotal.toFixed(2)}\nTax: $${order.tax.toFixed(2)}\nTotal: $${order.total.toFixed(2)}`);
    }
}

