let products = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

async function loadProducts() {

    let response = await fetch(`${API_BASE_URL}/api/products/all`);

    products = await response.json();

    let box = document.getElementById("products");

    box.innerHTML = "";

    products.forEach(product => {

        box.innerHTML += `

        

    <div class="product">

        <button class="wishlist-btn"
                onclick="addToWishlist(${product.productId})">
            ❤️
        </button>

        <img class="product-img"
             src="${API_BASE_URL}/images/${product.image}"
             alt="${product.productName}">

        <h3>${product.productName}</h3>

        <p class="desc">${product.description || ""}</p>

        <h2 class="price">
            ₹${product.finalPrice}
        </h2>

        <span class="offer">20% OFF</span>

        <div class="rating">
            ⭐ 4.4
        </div>

        <button class="view-btn"
                onclick="viewProduct(${product.productId})">
            View Details
        </button>

        <button class="cart-btn"
                onclick="addToCart(${product.productId})">
            Add To Cart
        </button>

    </div>
    `;
});
}

function viewProduct(productId) {

    window.location.href =
        `ProductDetails.html?id=${productId}`;

}

function addToWishlist(id){

    let product = products.find(p => p.productId == id);

    let exists = wishlist.find(p => p.productId == id);

    if(!exists){

        wishlist.push(product);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        updateWishCount();

        alert("Added to Wishlist");
    }
}



function updateWishCount() {

    document.getElementById("wishCount").innerHTML =
        wishlist.length;

}

loadProducts();
updateWishCount();

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id) {

    let product = products.find(
        p => p.productId == id
    );

    if (!product) {
        alert("Product not found");
        return;
    }

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert("Added To Cart");
}

function updateCartCount() {

    document.getElementById("count").innerHTML =
        cart.length;
}

updateCartCount();