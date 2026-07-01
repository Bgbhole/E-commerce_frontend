let bannerProducts = [];

let bannerIndex = 0;

let products = [];


// =====================
// Page Load
// =====================
window.onload = async function () {

    updateNavbar();

    await loadProducts();

  await loadWishlistCount();

    await loadCartCount();

};

// =====================
// Load Products
// =====================
async function loadProducts() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/products/all`);
        products = await response.json();
        bannerProducts = products;

startBanner();

        const box = document.getElementById("products");
        box.innerHTML = "";

        products.forEach(product => {

            box.innerHTML += `

            <div class="product">

                <button class="wishlist-btn"
                        onclick="addToWishlist(${product.productId})">
                    ❤️
                </button>

               <img class="product-img"
     src="${API_BASE_URL}/uploads/${product.image}"
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

    } catch (error) {

        console.error(error);

    }
}

// =====================
// View Product
// =====================
function viewProduct(productId) {
    window.location.href = `ProductDetails.html?id=${productId}`;
}

// =====================
// Wishlist
// =====================
async function addToWishlist(productId) {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    if(!user){

        alert("Please Login First");

        window.location.href="loginpage.html";

        return;
    }

    try{

        let response = await fetch(

            `${API_BASE_URL}/api/wishlist/add?userId=${user.id}&productId=${productId}`,

            {
                method:"POST"
            }

        );

        if(response.ok){

    alert("Added to Wishlist");

    await loadWishlistCount();

}
        else{

            let msg = await response.text();

            alert(msg);

        }

    }
    catch(error){

        console.log(error);

        alert("Server Error");

    }

}

async function loadWishlistCount() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {

        document.getElementById("wishCount").innerHTML = 0;
        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/wishlist/user/${user.id}`
        );

        if (!response.ok) {

            throw new Error("Unable to load wishlist");

        }

        const wishlist = await response.json();

        document.getElementById("wishCount").innerHTML =
            wishlist.length;

    }
    catch (error) {

        console.error(error);

        document.getElementById("wishCount").innerHTML = 0;

    }

}

// =====================
// Add To Cart
// =====================
async function addToCart(productId) {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {

        alert("Please Login First");

        window.location.href = "loginpage.html";

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    userId: user.id,
                    productId: productId,
                    quantity: 1

                })
            }
        );

        if (!response.ok) {

            throw new Error("Unable to add product");

        }

        alert("Product Added Successfully");

        // Refresh cart count immediately
        await loadCartCount();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================
// Cart Count
// =====================
async function loadCartCount() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {

        document.getElementById("count").innerHTML = 0;

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/user/${user.id}`
        );

        if (!response.ok) {

            throw new Error();

        }

        const cart = await response.json();

        let totalQuantity = 0;

        cart.forEach(item => {

            totalQuantity += item.quantity;

        });

        document.getElementById("count").innerHTML = totalQuantity;

    } catch (error) {

        console.error(error);

        document.getElementById("count").innerHTML = 0;

    }

}

// =====================
// Navigation
// =====================
function openProfile() {

    window.location.href = "profile.html";

}

function openWishlist() {

    window.location.href = "wishlist.html";

}

function openCart() {

    window.location.href = "cart.html";

}


function updateNavbar() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const loginBtn = document.getElementById("loginBtn");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {

        loginBtn.style.display = "none";
        profileBtn.style.display = "inline";
        logoutBtn.style.display = "inline";

    } else {

        loginBtn.style.display = "inline";
        profileBtn.style.display = "none";
        logoutBtn.style.display = "none";

    }

}

function goLogin() {

    window.location.href = "loginpage.html";

}

function logout() {

    localStorage.removeItem("currentUser");

    alert("Logged Out Successfully");

    window.location.href = "index.html";

}



// =====================
// Banner Slider
// =====================

function startBanner() {

    if (bannerProducts.length === 0) {

        return;

    }

    changeBanner();

    setInterval(changeBanner, 3000);

}

function changeBanner() {

    let product = bannerProducts[bannerIndex];

    document.getElementById("banner").src =
        `${API_BASE_URL}/uploads/${product.image}`;

    document.getElementById("bannerName").innerHTML =
        product.productName;

    document.getElementById("bannerPrice").innerHTML =
        "₹" + product.finalPrice;

    let discount = 0;

    if (product.sellingPrice > 0) {

        discount = Math.round(
            ((product.sellingPrice - product.finalPrice)
                / product.sellingPrice) * 100
        );

    }

    document.getElementById("bannerDiscount").innerHTML =
        discount + "% OFF";

    document.getElementById("bannerBtn").onclick = function () {

        window.location.href =
            "ProductDetails.html?id=" + product.productId;

    };

    bannerIndex++;

    if (bannerIndex >= bannerProducts.length) {

        bannerIndex = 0;

    }

}
