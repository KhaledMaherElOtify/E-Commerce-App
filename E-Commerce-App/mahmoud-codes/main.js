// Main JavaScript file for common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Tab functionality for admin panel
    if (document.querySelector('.admin-tabs')) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Modal functionality
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

// Function to open modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Function to close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count in all navigation elements
    document.querySelectorAll('.cart-link').forEach(link => {
        link.textContent = `Cart (${cartCount})`;
    });
}
//********************************************************************************
// mahmoud's part */

let categorie01 = document.querySelector('.categorie01')
let categorie02 = document.querySelector('.categorie02')
let categorie03 = document.querySelector('.categorie03')
let categorie04 = document.querySelector('.categorie04')

async function loadData(){
    let response = await fetch('js/items.json')
    let products = await response.json();
    
    let mobileCategorie = await filterData(products,'Mobile')
    await showData(mobileCategorie,categorie01)

    let electronicsCategory = await filterData(products,'Electronics')
    await showData(electronicsCategory,categorie02)

    let tvCategory = await filterData(products,'TV')
    await showData(tvCategory,categorie03)

    let WatchCategory = await filterData(products,'Watches')
    await showData(WatchCategory,categorie04)


    
}   
loadData()

function filterData(data,identifier){
    let filter = data.filter( element => element.categorie == identifier) 
    return filter   
}

function showData(data,location){
    data.forEach( element => {

        if(element.old_price == undefined){
            element.old_price = 2000;
        }
        
        location.innerHTML += `<div class="product swiper-slide col-lg-3 d-flex flex-wrap flex-column bg-white text-center">
                                <span class="salePrecent">${element.stock_quantity} in store</span>
                                 <span class = 'productId'>${element.id}</span>
                                <div class="icons d-flex flex-column gap-5">
                                    <i class="fa-solid fa-cart-plus"></i>
                                    <i class="fa-solid fa-heart"></i>
                                </div>
                                <div class="imgProduct d-flex">
                                    <a href=""><img src="${element.img}" alt="" class="imgOrg w-100 mt-2"></a>
                                    <a href=""><img src="${element.img_hover}" alt="" class="imgHover w-100 mt-2"></a>
                                </div>
                                <div class="productName">
                                    <h6>${element.name}</h6>
                                </div>
                                <div class="stars">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                </div>
                                <div class="price d-flex justify-content-center gap-3">
                                    <p class="price">$${element.price}</p>
                                    <p class="oldPrice">$${element.old_price}</p>
                                </div>
                            </div>`
    })
}