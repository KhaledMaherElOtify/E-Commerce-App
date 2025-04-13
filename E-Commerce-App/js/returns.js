// returns.js
document.addEventListener('DOMContentLoaded', function() {
    // Only run on order details page
    if (!document.getElementById('return-section')) return;
    
    const orderId = getOrderIdFromUrl();
    const order = getOrderById(orderId);
    
    // Only show return section for delivered orders
    if (order && order.status === 'delivered' && !order.returnRequest) {
      initReturnForm(orderId);
    }
  });
  
  function getOrderIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
  }
  
  function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.find(o => o.id === orderId);
  }
  
  function initReturnForm(orderId) {
    const returnSection = document.getElementById('return-section');
    
    returnSection.innerHTML = `
      <h3>Request Return</h3>
      <select id="return-reason" class="form-input">
        <option value="">Select reason...</option>
        <option value="wrong-item">Wrong item received</option>
        <option value="damaged">Item arrived damaged</option>
        <option value="not-as-described">Not as described</option>
        <option value="other">Other</option>
      </select>
      <textarea id="return-notes" class="form-input" placeholder="Additional details..."></textarea>
      <button id="submit-return" class="btn">Submit Return Request</button>
    `;
    
    document.getElementById('submit-return').addEventListener('click', () => {
      processReturnRequest(orderId);
    });
  }
  
  function processReturnRequest(orderId) {
    const reason = document.getElementById('return-reason').value;
    const notes = document.getElementById('return-notes').value;
    
    if (!reason) {
      alert('Please select a return reason');
      return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      alert('Order not found');
      return;
    }
    
    orders[orderIndex].returnRequest = {
      status: 'pending',
      reason: reason,
      notes: notes,
      requestDate: new Date().toISOString()
    };
    
    localStorage.setItem('orders', JSON.stringify(orders));
    alert('Return request submitted successfully!');
    window.location.reload();
  }