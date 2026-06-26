window.onload = function () {
    showDashboard();
};

function loadDashboard() {

    let seller =
        JSON.parse(localStorage.getItem("currentSeller"));

    // Seller Products
    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    let sellerProducts =
        products.filter(p => p.sellerId == seller.id);

    document.getElementById("products").innerHTML =
        sellerProducts.length;


    // Orders
    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let sellerOrders = orders.filter(order =>
        order.sellerId == seller.id);

    document.getElementById("orders").innerHTML =
        sellerOrders.length;


    // Revenue
    let revenue = 0;

    sellerOrders.forEach(order => {

        if (order.paymentStatus == "SUCCESS") {

            revenue += Number(order.price);

        }

    });

    document.getElementById("revenue").innerHTML =
        "₹" + revenue;


    // Profit
    let profit = 0;

    sellerOrders.forEach(order => {

        if (order.paymentStatus == "SUCCESS") {

            profit += Number(order.price) * 0.20;

        }

    });

    document.getElementById("profit").innerHTML =
        "₹" + profit;

}
function showDashboard() {

    document.getElementById("mainContent").innerHTML = `

    <h1>Dashboard</h1>

    <div class="cards">

        <div class="card">
            <h3>Total Products</h3>
            <h1>0</h1>
        </div>

        <div class="card">
            <h3>Total Orders</h3>
            <h1>0</h1>
        </div>

        <div class="card">
            <h3>Revenue</h3>
            <h1>₹0</h1>
        </div>

        <div class="card">
            <h3>Profit</h3>
            <h1>₹0</h1>
        </div>

    </div>

    `;
}


function showAddProduct() {

    document.getElementById("mainContent").innerHTML = `

    <h1>Add Product</h1>

    <input type="text" id="productName" placeholder="Product Name"><br><br>

    <input type="text" id="brand" placeholder="Brand"><br><br>

    <input type="text" id="category" placeholder="Category"><br><br>

    <textarea id="description" placeholder="Description"></textarea><br><br>

    <input type="number" id="purchasePrice" placeholder="Purchase Price"><br><br>

    <input type="number" id="sellingPrice" placeholder="Selling Price"><br><br>

    <input type="number" id="gstPercentage" placeholder="GST %"><br><br>

    <input type="number" id="quantity" placeholder="Quantity"><br><br>

    <input type="file" id="image"><br><br>

    <button onclick="saveProduct()">Save Product</button>

    `;
}

async function saveProduct() {

    let formData = new FormData();

    formData.append("productName", document.getElementById("productName").value);
    formData.append("brand", document.getElementById("brand").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("purchasePrice", document.getElementById("purchasePrice").value);
    formData.append("sellingPrice", document.getElementById("sellingPrice").value);
    formData.append("gstPercentage", document.getElementById("gstPercentage").value);
    formData.append("quantity", document.getElementById("quantity").value);
    formData.append("image", document.getElementById("image").files[0]);

    try {

        console.log("productName =", document.getElementById("productName").value);

for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
}

let response = await fetch(
    `${API_BASE_URL}/api/products/add`,
    {
        method: "POST",
        body: formData
    }
);

console.log(await response.text());
        

        if (response.ok) {

            alert("Product Added Successfully");
            showProducts();

        } else {

            alert("Error Adding Product");

        }

    } catch (e) {

        console.log(e);

    }

}

async function showProducts() {

    let response = await fetch(`${API_BASE_URL}/api/products/all`);

    let products = await response.json();

    let html = "<h1>Manage Products</h1>";

    products.forEach(product => {

        html += `

        <div class="product-card">

            <h3>${product.productName}</h3>

            <p>Brand : ${product.brand}</p>

            <p>Category : ${product.category}</p>

            <p>Purchase Price : ₹${product.purchasePrice}</p>

            <p>Selling Price : ₹${product.sellingPrice}</p>

            <p>Profit : ₹${product.profit}</p>

            <p>Stock : ${product.quantity}</p>

        </div>

        <hr>
        `;

    });

    document.getElementById("mainContent").innerHTML = html;

}

function logout() {

    let confirmLogout =
        confirm("Are you sure you want to logout?");

    if(confirmLogout){

        localStorage.removeItem("currentUser");

        window.location.href = "loginpage.html";

    }

}