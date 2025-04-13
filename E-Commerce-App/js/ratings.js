// ratings.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentRating = 0;
    const productId = getProductIdFromUrl();
    
    // Load existing reviews
    loadProductReviews(productId);
    
    // Star rating selection
    document.querySelectorAll('.star-rating span').forEach(star => {
      star.addEventListener('click', function() {
        currentRating = parseInt(this.dataset.rating);
        updateStarDisplay();
      });
    });
  
    // Submit review button
    document.getElementById('submit-review')?.addEventListener('click', function() {
      submitReview(productId, currentRating);
    });
  });
  
  // Helper function to get product ID from URL
  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
  }
  
  // Update star display
  function updateStarDisplay() {
    document.querySelectorAll('.star-rating span').forEach((star, index) => {
      star.textContent = index < currentRating ? '★' : '☆';
      star.style.color = index < currentRating ? 'gold' : '#ddd';
    });
  }
  
  // Load existing reviews
  function loadProductReviews(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const reviewsContainer = document.getElementById('reviews-list');
    const avgRatingElement = document.getElementById('avg-rating');
    const reviewCountElement = document.getElementById('review-count');
    
    // Display average rating
    if (product.averageRating) {
      avgRatingElement.textContent = product.averageRating;
    }
    
    // Display review count
    if (product.ratings) {
      reviewCountElement.textContent = product.ratings.length;
    }
    
    // Display all reviews
    if (reviewsContainer && product.ratings) {
      reviewsContainer.innerHTML = product.ratings.map(review => `
        <div class="review">
          <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
          <p class="review-text">${review.comment}</p>
          <div class="review-meta">
            <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
    }
  }
  
  // Submit new review
  function submitReview(productId, rating) {
    const reviewText = document.getElementById('review-text').value.trim();
    
    if (!rating) {
      alert('Please select a rating');
      return;
    }
    
    if (!reviewText) {
      alert('Please write a review');
      return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;
    
    // Initialize ratings array if it doesn't exist
    if (!products[productIndex].ratings) {
      products[productIndex].ratings = [];
    }
    
    // Add new review
    products[productIndex].ratings.push({
      userId: JSON.parse(localStorage.getItem('currentUser'))?.id || 0,
      rating: rating,
      comment: reviewText,
      date: new Date().toISOString()
    });
    
    // Calculate new average rating
    const ratings = products[productIndex].ratings;
    const sum = ratings.reduce((total, r) => total + r.rating, 0);
    products[productIndex].averageRating = (sum / ratings.length).toFixed(1);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reload reviews
    loadProductReviews(productId);
    
    // Reset form
    document.getElementById('review-text').value = '';
    currentRating = 0;
    updateStarDisplay();
    
    alert('Thank you for your review!');
  }