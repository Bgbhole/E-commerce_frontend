

/* ==========================================
   DISPLAY PRODUCT
========================================== */

function displayProduct() {

    document.getElementById("productName").innerText =
        product.productName;

    document.getElementById("brand").innerText =
        product.brand || "";

    document.getElementById("brand2").innerText =
        product.brand || "-";

    document.getElementById("category").innerText =
        product.category || "-";

    document.getElementById("description").innerText =
        product.description || "";

    document.getElementById("quantity").innerText =
        product.quantity || 0;

    document.getElementById("color").innerText =
        product.color || "-";

    document.getElementById("warranty").innerText =
        product.warranty || "-";

   const sellerPrice =
    product.sellerPrice ??
    product.sellingPrice ??
    product.finalPrice ??
    0;

document.getElementById("sellerPrice").innerText =
    "₹" + sellerPrice;

document.getElementById("sellerPriceInput").value =
    sellerPrice;

    document.getElementById("statusBadge").innerText =
        product.status;

    document.getElementById("statusBadge").className =
        "status " + product.status.toLowerCase();

    document.getElementById("productImage").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb1").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb2").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb3").src =
        `${API}/api/products/image/${product.productId}`;

    /* Seller */

    if (product.seller) {

        document.getElementById("sellerName").innerText =
            product.seller.name || "";

        document.getElementById("shopName").innerText =
            product.seller.shopName || "";

        document.getElementById("sellerEmail").innerText =
            product.seller.email || "";

        document.getElementById("sellerMobile").innerText =
            product.seller.mobile || "";

        document.getElementById("gst").innerText =
            product.seller.gstNumber || "";

        document.getElementById("businessType").innerText =
            product.seller.businessType || "";

    }

    calculatePrice();

}

/* ==========================================
   PRICE CALCULATION
========================================== */

document
.getElementById("discountPercent")
.addEventListener("input", calculatePrice);

function calculatePrice() {
const sellerPrice = Number(
    product.sellerPrice ??
    product.sellingPrice ??
    product.finalPrice ??
    0
);

    const discount =
        Number(
            document.getElementById("discountPercent").value
        ) || 0;

    const discountAmount =
        sellerPrice * discount / 100;

    const finalPrice =
        sellerPrice - discountAmount;

    document.getElementById("discountAmount").value =
        discountAmount.toFixed(2);

    document.getElementById("finalPrice").value =
        finalPrice.toFixed(2);

    document.getElementById("sellerProfit").value =
        sellerPrice.toFixed(2);

    document.getElementById("adminContribution").value =
        discountAmount.toFixed(2);

}
/* ==========================================
   VERIFY PRODUCT
========================================== */

const API = API_BASE_URL;

const productId =
    new URLSearchParams(window.location.search)
    .get("id");

let product = null;

/* ==========================================
   PAGE LOAD
========================================== */

window.onload = () => {

    if (!productId) {

        alert("Invalid Product.");

        history.back();

        return;

    }

    loadProduct();

};

/* ==========================================
   LOAD PRODUCT
========================================== */

async function loadProduct() {

    try {

        const response = await fetch(

            `${API}/api/products/${productId}`

        );

        if (!response.ok) {

            throw new Error("Unable to load product.");

        }

        product = await response.json();

        displayProduct();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================
   DISPLAY PRODUCT
========================================== */

function displayProduct() {

    document.getElementById("productName").innerText =
        product.productName;

    document.getElementById("brand").innerText =
        product.brand || "";

    document.getElementById("brand2").innerText =
        product.brand || "-";

    document.getElementById("category").innerText =
        product.category || "-";

    document.getElementById("description").innerText =
        product.description || "";

    document.getElementById("quantity").innerText =
        product.quantity || 0;

    document.getElementById("color").innerText =
        product.color || "-";

    document.getElementById("warranty").innerText =
        product.warranty || "-";

   const sellerPrice =
    product.sellerPrice ??
    product.sellingPrice ??
    product.finalPrice ??
    0;

document.getElementById("sellerPrice").innerText =
    "₹" + sellerPrice;

document.getElementById("sellerPriceInput").value =
    sellerPrice;

    document.getElementById("statusBadge").innerText =
        product.status;

    document.getElementById("statusBadge").className =
        "status " + product.status.toLowerCase();

    document.getElementById("productImage").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb1").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb2").src =
        `${API}/api/products/image/${product.productId}`;

    document.getElementById("thumb3").src =
        `${API}/api/products/image/${product.productId}`;

    /* Seller */

    if (product.seller) {

        document.getElementById("sellerName").innerText =
            product.seller.name || "";

        document.getElementById("shopName").innerText =
            product.seller.shopName || "";

        document.getElementById("sellerEmail").innerText =
            product.seller.email || "";

        document.getElementById("sellerMobile").innerText =
            product.seller.mobile || "";

        document.getElementById("gst").innerText =
            product.seller.gstNumber || "";

        document.getElementById("businessType").innerText =
            product.seller.businessType || "";

    }

    calculatePrice();

}

/* ==========================================
   PRICE CALCULATION
========================================== */

document
.getElementById("discountPercent")
.addEventListener("input", calculatePrice);

function calculatePrice() {

    const sellerPrice = Number(
    product.sellerPrice ??
    product.sellingPrice ??
    product.finalPrice ??
    0
);

    const discount =
        Number(
            document.getElementById("discountPercent").value
        ) || 0;

    const discountAmount =
        sellerPrice * discount / 100;

    const finalPrice =
        sellerPrice - discountAmount;

    document.getElementById("discountAmount").value =
        discountAmount.toFixed(2);

    document.getElementById("finalPrice").value =
        finalPrice.toFixed(2);

    document.getElementById("sellerProfit").value =
        sellerPrice.toFixed(2);

    document.getElementById("adminContribution").value =
        discountAmount.toFixed(2);

}

async function approveProduct() {

    try {

        const request = {

            adminDiscount: Number(
                document.getElementById("discountPercent").value
            ) || 0,

            adminRemark:
                document.getElementById("remarks").value,

            sellerProfit: Number(
                document.getElementById("sellerProfit").value
            ) || 0

        };

        const response = await fetch(

            `${API_BASE_URL}/api/admin/approve-product/${productId}`,

            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(request)

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message);

        window.location.href = "AdminDashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function rejectProduct() {

    try {

        const request = {

            adminRemark:
                document.getElementById("remarks").value

        };

        const response = await fetch(

            `${API_BASE_URL}/api/admin/reject-product/${productId}`,

            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(request)

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message);

        window.location.href = "AdminDashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}