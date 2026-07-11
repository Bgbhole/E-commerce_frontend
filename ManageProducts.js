let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {
    alert("Please login first");
    window.location.href = "loginpage.html";
}

let sellerId = seller.sellerId;

window.onload = function () {
    loadProducts();
};

// ================= CALCULATE VALUES =================

function calculateValues(id) {

    let purchasePrice =
        parseFloat(document.getElementById("purchase" + id).value) || 0;

    let sellingPrice =
        parseFloat(document.getElementById("price" + id).value) || 0;

    let gst =
        parseFloat(document.getElementById("gst" + id).value) || 0;

    let profit = sellingPrice - purchasePrice;

    let gstAmount = (sellingPrice * gst) / 100;

    let finalPrice = sellingPrice + gstAmount;

    document.getElementById("profit" + id).value =
        profit.toFixed(2);

    document.getElementById("gstAmount" + id).value =
        gstAmount.toFixed(2);

    document.getElementById("finalPrice" + id).value =
        finalPrice.toFixed(2);
}

// ================= LOAD PRODUCTS =================

async function loadProducts() {

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/products/seller/${sellerId}`
        );

        let products = await response.json();

        let html = "";

        products.forEach(product => {

            html += `

<div class="card">

<h2>${product.productName}</h2>

<label>Product Name</label>
<input type="text"
id="name${product.productId}"
value="${product.productName}">

<label>Brand</label>
<input type="text"
id="brand${product.productId}"
value="${product.brand}">

<label>Category</label>
<input type="text"
id="category${product.productId}"
value="${product.category}">

<label>Description</label>
<textarea
id="desc${product.productId}">${product.description}</textarea>

<label>Purchase Price</label>
<input type="number"
id="purchase${product.productId}"
value="${product.purchasePrice}"
oninput="calculateValues(${product.productId})">

<label>Selling Price</label>
<input type="number"
id="price${product.productId}"
value="${product.sellingPrice}"
oninput="calculateValues(${product.productId})">

<label>GST %</label>
<input type="number"
id="gst${product.productId}"
value="${product.gstPercentage}"
oninput="calculateValues(${product.productId})">

<label>Profit</label>
<input type="number"
id="profit${product.productId}"
value="${product.profit}"
readonly>

<label>GST Amount</label>
<input type="number"
id="gstAmount${product.productId}"
value="${product.gstAmount}"
readonly>

<label>Final Price</label>
<input type="number"
id="finalPrice${product.productId}"
value="${product.finalPrice}"
readonly>

<label>Quantity</label>
<input type="number"
id="qty${product.productId}"
value="${product.quantity}">

<button class="update"
onclick="updateProduct(${product.productId})">
Update
</button>

<button class="delete"
onclick="deleteProduct(${product.productId})">
Delete
</button>

</div>

`;

        });

        document.getElementById("productContainer").innerHTML = html;

    } catch (error) {

        console.log(error);
        alert("Unable to load products.");

    }

}
// ================= UPDATE PRODUCT =================

async function updateProduct(id) {

    // Recalculate values before saving
    calculateValues(id);

    let product = {

        productName: document.getElementById("name" + id).value,

        brand: document.getElementById("brand" + id).value,

        category: document.getElementById("category" + id).value,

        description: document.getElementById("desc" + id).value,

        purchasePrice: parseFloat(document.getElementById("purchase" + id).value),

        sellingPrice: parseFloat(document.getElementById("price" + id).value),

        gstPercentage: parseFloat(document.getElementById("gst" + id).value),

        profit: parseFloat(document.getElementById("profit" + id).value),

        gstAmount: parseFloat(document.getElementById("gstAmount" + id).value),

        finalPrice: parseFloat(document.getElementById("finalPrice" + id).value),

        quantity: parseInt(document.getElementById("qty" + id).value)

    };

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/products/update/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }
        );

        if (!response.ok) {
            alert("Update Failed");
            return;
        }

        alert("Product Updated Successfully");

        loadProducts();

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}

// ================= DELETE PRODUCT =================

async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/products/delete/${id}`,
            {
                method: "DELETE"
            }
        );

        const message = await response.text();

        alert(message);

        loadProducts();

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }

}