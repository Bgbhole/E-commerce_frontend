let products = [];
let filteredProducts = [];
let bannerProducts = [];
let bannerIndex = 0;
let searchInput;
let suggestions;


// ================= PAGE LOAD =================

window.onload = async function () {

    updateNavbar();

    await loadProducts();

    await loadWishlistCount();

    await loadCartCount();

    startBanner();

    startFlashTimer();

};

// ================= LOAD PRODUCTS =================

async function loadProducts() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/products/all`);

        products = await response.json();

        console.log(products);

products.forEach(p => {
    console.log("Product:", p.productName, "| Category:", p.category);
});

        filteredProducts = [...products];
        bannerProducts = [...products];

        displayProducts(filteredProducts);

        loadFlashSale();
        loadTrending();
        loadBestSeller();
        loadRecommended();

        // LAST
        await loadWishlistHearts();

    } catch (error) {

        console.log(error);
        alert("Unable to load products");

    }

}

// ================= DISPLAY PRODUCTS =================

function displayProducts(productList) {

    const box = document.getElementById("products");

    box.innerHTML = "";

    if (productList.length === 0) {

        box.innerHTML = "<h2>No Products Found</h2>";

        return;

    }

    productList.forEach(product => {

        let discount = 0;

        if (product.sellingPrice > 0) {

            discount = Math.round(

                ((product.sellingPrice - product.finalPrice)

                / product.sellingPrice) * 100

            );

        }

        box.innerHTML += `

<div class="product">

   <button
class="wishlist-btn"
onclick="addToWishlist(${product.productId})">

<span
class="wishlist-heart"
data-product-id="${product.productId}">

♡

</span>

</button>

    <span class="discount-badge">

        ${discount}% OFF

    </span>

    <img

        class="product-img"

        src="${API_BASE_URL}/api/products/image/${product.productId}"

        alt="${product.productName}">

    <h3>

        ${product.productName}

    </h3>

    <p class="desc">

        ${product.description || ""}

    </p>

    <div class="product-rating">
    <span class="rating-badge">
        ${product.averageRating || "0.0"} ★
    </span>

    <span class="rating-count">
        (${product.totalReviews || 0})
    </span>
</div>

    <h2 class="price">

        ₹${product.finalPrice}

    </h2>

    <p class="old-price">

        ₹${product.sellingPrice}

    </p>

    <p class="delivery">

        Free Delivery

    </p>

    <button

        class="view-btn"

        onclick="viewProduct(${product.productId})">

        View Details

    </button>

    <button

        class="cart-btn"

        onclick="addToCart(${product.productId})">

        Add To Cart

    </button>

</div>

`;

    });

}

// ================= HERO BANNER =================

function startBanner() {

    if (bannerProducts.length === 0) return;

    changeBanner();

    setInterval(changeBanner, 4000);

}

function changeBanner() {

    let product = bannerProducts[bannerIndex];

    document.getElementById("banner").src =
    `${API_BASE_URL}/api/products/image/${product.productId}`;

    document.getElementById("bannerName").innerHTML =
        product.productName;

    document.getElementById("bannerPrice").innerHTML =
        "₹" + product.finalPrice;

    let discount = 0;

    if (product.sellingPrice > 0) {

       discount = Math.round(
    ((product.sellingPrice - product.finalPrice) /
     product.sellingPrice) * 100
);

    }

    document.getElementById("bannerDiscount").innerHTML =
        discount + "% OFF";

    document.getElementById("bannerBtn").onclick = function () {

        viewProduct(product.productId);

    };

    bannerIndex++;

    if (bannerIndex >= bannerProducts.length) {
        bannerIndex = 0;
    }
}

// OUTSIDE changeBanner()
function logout() {

    localStorage.removeItem("currentUser");
    localStorage.removeItem("deliveryAddressId");
    localStorage.removeItem("billingAddressId");
    localStorage.removeItem("orderRequest");

    window.location.href = "loginpage.html";
}
// ================= SEARCH =================

function searchProducts(){

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    if(keyword===""){

        displayProducts(products);

        return;

    }

    const result = products.filter(product=>

        (product.productName || "").toLowerCase().includes(keyword) ||

        (product.brand || "").toLowerCase().includes(keyword) ||

        (product.category || "").toLowerCase().includes(keyword) ||

        (product.description || "").toLowerCase().includes(keyword)

    );

    displayProducts(result);

}

// ================= CATEGORY =================

function showCategory(category) {

    const filtered = products.filter(product =>

        (product.category || "")
            .trim()
            .toLowerCase() ===
        category.trim().toLowerCase()

    );

    console.log("Category:", category);
    console.log(filtered);

    displayProducts(filtered);

}

function showAll() {

    displayProducts(products);

}

// ================= TRENDING =================

function loadTrending() {

    const box =
        document.getElementById("trendingProducts");

    if (!box) return;

    box.innerHTML = "";

    const list = [...products]
        .slice(0, 4);

    list.forEach(product => {

        box.innerHTML += createProductCard(product);

    });

}

// ================= BEST SELLER =================

function loadBestSeller() {

    const box =
        document.getElementById("bestSellerProducts");

    if (!box) return;

    box.innerHTML = "";

    const list = [...products]
        .slice(4, 8);

    list.forEach(product => {

        box.innerHTML += createProductCard(product);

    });

}

// ================= RECOMMENDED =================

function loadRecommended() {

    const box =
        document.getElementById("recommendedProducts");

    if (!box) return;

    box.innerHTML = "";

    const list = [...products]
        .slice(0, 8);

    list.forEach(product => {

        box.innerHTML += createProductCard(product);

    });

}

// ================= FLASH SALE =================

function loadFlashSale() {

    const box =
        document.getElementById("flashProducts");

    if (!box) return;

    box.innerHTML = "";

    const list = [...products]
        .slice(0, 4);

    list.forEach(product => {

        box.innerHTML += createProductCard(product);

    });

}

// ================= REUSABLE CARD =================

function createProductCard(product) {

    let discount = 0;

    if (product.sellingPrice > 0) {

        discount = Math.round(

            ((product.sellingPrice - product.finalPrice)

            / product.sellingPrice) * 100

        );

    }

    let stockButton = "";

if (product.quantity > 0) {

    stockButton = `
        <button onclick="viewProduct(${product.productId})">
            View Details
        </button>
    `;

} else {

    stockButton = `
        <button class="out-stock-btn" disabled>
            OUT OF STOCK
        </button>
    `;

}

    return `

<div class="product">

<button
class="wishlist-btn"
onclick="addToWishlist(${product.productId})">

<span
class="wishlist-heart"
data-product-id="${product.productId}">

♡

</span>

</button>

<span class="discount-badge">

${discount}% OFF

</span>

<img

class="product-img"

src="${API_BASE_URL}/api/products/image/${product.productId}"

alt="${product.productName}">

<h3>

${product.productName}

</h3>

<p class="desc">

${product.description || ""}

</p>

<div class="rating">

<span class="rating-badge">

${product.averageRating ? product.averageRating.toFixed(1) : "0.0"}

<i class="fa-solid fa-star"></i>

</span>

<span class="rating-total">

(${product.totalReviews || 0})

</span>

</div>

<h2 class="price">

₹${product.finalPrice}

</h2>

<p class="old-price">

₹${product.sellingPrice}

</p>

<p class="delivery">

Free Delivery

</p>

<button

class="view-btn"

onclick="viewProduct(${product.productId})">

View Details

</button>

<button

class="cart-btn"

onclick="addToCart(${product.productId})">

Add To Cart

</button>

</div>

`;

}

// ================= FLASH TIMER =================

function startFlashTimer() {

    let totalSeconds = 3 * 60 * 60;

    setInterval(() => {

        const hrs =
            Math.floor(totalSeconds / 3600);

        const mins =
            Math.floor((totalSeconds % 3600) / 60);

        const secs =
            totalSeconds % 60;

        document.getElementById("hours").innerHTML =
            String(hrs).padStart(2, "0");

        document.getElementById("minutes").innerHTML =
            String(mins).padStart(2, "0");

        document.getElementById("seconds").innerHTML =
            String(secs).padStart(2, "0");

        if (totalSeconds > 0)
            totalSeconds--;

    }, 1000);

}
// ================= VIEW PRODUCT =================

function viewProduct(productId) {

    window.location.href =
        `ProductDetails.html?id=${productId}`;

}

// ================= WISHLIST =================

async function addToWishlist(productId) {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please Login First");
        return;
    }

    const userId = user.id || user.userId;

    const hearts = document.querySelectorAll(
        `.wishlist-heart[data-product-id="${productId}"]`
    );

    const isAdded =
        hearts.length > 0 &&
        hearts[0].classList.contains("active");

    try {

        if (!isAdded) {

            const response = await fetch(
                `${API_BASE_URL}/api/wishlist/add?userId=${userId}&productId=${productId}`,
                {
                    method: "POST"
                }
            );

            if (response.ok) {

                updateAllHearts(productId, true);

                loadWishlistCount();

            }

        } else {

            const response = await fetch(
                `${API_BASE_URL}/api/wishlist/remove?userId=${userId}&productId=${productId}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {

                updateAllHearts(productId, false);

                loadWishlistCount();

            }

        }

    } catch (e) {

        console.log(e);

    }

}

async function loadWishlistCount() {

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {

        document.getElementById("wishCount").innerHTML = 0;

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/wishlist/user/${user.id}`

        );

        const wishlist = await response.json();

        document.getElementById("wishCount").innerHTML =
            wishlist.length;

    } catch {

        document.getElementById("wishCount").innerHTML = 0;

    }

}
async function loadWishlistHearts() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) return;

    const userId = user.id || user.userId;

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/wishlist/user/${userId}`
        );

        const wishlist = await response.json();

        wishlist.forEach(item => {

            const productId =
                item.product?.productId || item.productId;

            updateAllHearts(productId, true);

        });

    } catch (e) {

        console.log(e);

    }

}

function updateAllHearts(productId, active) {

    const hearts = document.querySelectorAll(
        `.wishlist-heart[data-product-id="${productId}"]`
    );

    hearts.forEach(heart => {

        if (active) {

            heart.innerHTML = "♥";
            heart.classList.add("active");

        } else {

            heart.innerHTML = "♡";
            heart.classList.remove("active");

        }

    });

}

// ================= CART =================

async function addToCart(productId) {

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

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

                    "Content-Type":"application/json"

                },

                body: JSON.stringify({

                    userId:user.id,

                    productId:productId,

                    quantity:1

                })

            }

        );

        if(response.ok){

            loadCartCount();

            alert("Product Added");

        }

    }

    catch(error){

        console.log(error);

    }

}

async function loadCartCount(){

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

    if(!user){

        document.getElementById("count").innerHTML=0;

        return;

    }

    try{

        const response =
            await fetch(

                `${API_BASE_URL}/api/cart/user/${user.id}`

            );

        const cart =
            await response.json();

        let total=0;

        cart.forEach(item=>{

            total += item.quantity;

        });

        document.getElementById("count").innerHTML=total;

    }

    catch{

        document.getElementById("count").innerHTML=0;

    }

}

// ================= NAVIGATION =================

function openWishlist(){

    window.location.href="wishlist.html";

}

function openCart(){

    window.location.href="cart.html";

}

function openProfile(){

    window.location.href="profile.html";

}

function goLogin(){

    window.location.href="loginpage.html";

}
// ================= NAVBAR =================

function updateNavbar() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const loginBtn = document.getElementById("loginBtn");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminLink = document.getElementById("adminLink");

    if (user) {

        loginBtn.style.display = "none";
        profileBtn.style.display = "inline-block";
        logoutBtn.style.display = "inline-block";
        adminLink.style.display = "none";

    } else {

        loginBtn.style.display = "inline-block";
        profileBtn.style.display = "none";
        logoutBtn.style.display = "none";
        adminLink.style.display = "inline-block";

    }
}

// ================= PRODUCT IMAGE ERROR =================



// ================= SMOOTH SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ================= WINDOW LOAD =================

window.addEventListener("load", () => {

    console.log("ShopKart Loaded Successfully");

});

// ================= FLIPKART LIVE SEARCH =================

window.addEventListener("load", () => {

    searchInput = document.getElementById("search");
    suggestions = document.getElementById("searchSuggestions");

    console.log(searchInput);
    console.log(suggestions);

    searchInput.addEventListener("input", function () {
        console.log("Typing...");
        showSuggestions();
    });

    searchInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            searchProducts();

            suggestions.style.display = "none";

        }

    });

});

function showSuggestions(){

    const keyword = searchInput.value.trim().toLowerCase();

    suggestions.innerHTML = "";

    if(keyword===""){

        suggestions.style.display="none";

        return;

    }

    const result = products.filter(product =>

        (product.productName || "").toLowerCase().includes(keyword) ||

        (product.brand || "").toLowerCase().includes(keyword) ||

        (product.category || "").toLowerCase().includes(keyword) ||

        (product.description || "").toLowerCase().includes(keyword)

    );

    console.log(result);   // ✅ Correct position

    if(result.length===0){

        suggestions.innerHTML = `
            <div class="no-result">
                No Products Found
            </div>
        `;

        suggestions.style.display = "block";
        console.log(suggestions.innerHTML);

        return;

    }

    result.slice(0,8).forEach(product=>{

        suggestions.innerHTML += `
<div class="search-item" onclick="openSuggestion(${product.productId})">

<img src="${API_BASE_URL}/api/products/image/${product.productId}">

<div class="search-info">
<h4>${product.productName}</h4>
<p>${product.brand || ""} | ${product.category || ""}</p>
</div>

<div class="search-price">
₹${product.finalPrice}
</div>

</div>`;
    });

    suggestions.style.display = "block";

}

function openSuggestion(productId){

    window.location.href=
    `ProductDetails.html?id=${productId}`;

}

// ================= END =================