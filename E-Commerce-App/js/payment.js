// Initialize all payment methods
function initPaymentMethods() {
    // PayPal
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: calculateTotal().toFixed(2),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(completePayment);
      }
    }).render('#paypal-container');
  
    // Payment method switcher
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
      radio.addEventListener('change', function() {
        document.querySelectorAll('.payment-details').forEach(div => {
          div.style.display = 'none';
        });
        document.getElementById(`${this.id.split('-')[0]}-container`).style.display = 'block';
      });
    });
  }
  
  // Handle checkout
  function proceedToPayment() {
    const method = document.querySelector('input[name="payment"]:checked').id.split('-')[0];
    
    switch(method) {
      case 'paypal':
        // Handled automatically
        break;
      case 'vodafone':
        processVodafonePayment();
        break;
      case 'fawry':
        processFawryPayment();
        break;
    }
  }
  
  function processVodafonePayment() {
    const phone = document.getElementById('vodafone-number').value;
    if (!phone) {
      alert('Please enter Vodafone Cash number');
      return;
    }
    completePayment({
      method: 'vodafone',
      transactionId: `VOD-${Date.now()}`,
      phone: phone
    });
  }
  
  function processFawryPayment() {
    completePayment({
      method: 'fawry',
      transactionId: `FAWRY-${Date.now()}`
    });
    alert('You will receive payment code via SMS');
  }