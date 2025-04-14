document.addEventListener('DOMContentLoaded', function() {
  // Vodafone Cash Payment Handler
  document.getElementById('confirm-vodafone')?.addEventListener('click', processVodafonePayment);
});

function processVodafonePayment() {
  const phoneNumber = document.getElementById('vodafone-number').value.trim();
  
  // Validate phone number
  if (!phoneNumber || !/^01[0-9]{9}$/.test(phoneNumber)) {
    alert('Please enter a valid Vodafone Egypt number (e.g., 01012345678)');
    return;
  }

  const order = {
    id: Date.now(),
    userId: JSON.parse(localStorage.getItem('currentUser'))?.id,
    items: JSON.parse(localStorage.getItem('cart')) || [],
    total: calculateTotal(),
    paymentMethod: 'vodafone_cash',
    transactionId: `VOD-${Date.now()}`,
    phoneNumber: phoneNumber,
    status: 'pending',
    date: new Date().toISOString()
  };

  // Save order
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.setItem('cart', JSON.stringify([]));
  
  // Show confirmation
  alert(`Payment request sent to ${phoneNumber}\nOrder ID: ${order.id}`);
  window.location.href = 'orders.html';
}

// Helper function to calculate total
function calculateTotal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
}