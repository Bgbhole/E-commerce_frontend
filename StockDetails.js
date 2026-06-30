let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {
    alert("Please Login First");
    window.location.href = "loginpage.html";
}

let allProducts = [];

window.onload = function () {

    loadProducts();

};

// ===================== LOAD PRODUCTS =====================

async function loadProducts() {

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/products/seller/${seller.sellerId}`
        );

        allProducts = await response.json();

        displayProducts(allProducts);

    }

    catch (error) {

        console.log(error);

    }

}

// ===================== DISPLAY PRODUCTS =====================

function displayProducts(products) {

    let html = "";

    let totalProducts = products.length;

    let inStock = 0;
    let lowStock = 0;
    let outStock = 0;

    products.forEach(product => {

        let status = "";
        let statusClass = "";

        if (product.quantity == 0) {

            status = "Out Of Stock";
            statusClass = "out-stock";
            outStock++;

        }

        else if (product.quantity <= 5) {

            status = "Low Stock";
            statusClass = "low-stock";
            lowStock++;

        }

        else {

            status = "In Stock";
            statusClass = "in-stock";
            inStock++;

        }

        html += `

<tr>

<td>

<img
class="product-img"
src="${API_BASE_URL}/uploads/${product.image}"
onerror="this.src='images/no-image.png'">

</td>

<td>${product.productName}</td>

<td>${product.brand}</td>

<td>${product.category}</td>

<td>₹${product.purchasePrice}</td>

<td>₹${product.sellingPrice}</td>

<td style="color:green;font-weight:bold;">
₹${product.profit}
</td>

<td>${product.quantity}</td>

<td class="${statusClass}">
${status}
</td>

<td>

<button
class="edit-btn"
onclick="editProduct(${product.productId})">

Edit

</button>

</td>

</tr>

`;

    });

    document.getElementById("tbody").innerHTML = html;

    document.getElementById("totalProducts").innerHTML =
        totalProducts;

    document.getElementById("inStock").innerHTML =
        inStock;

    document.getElementById("lowStock").innerHTML =
        lowStock;

    document.getElementById("outStock").innerHTML =
        outStock;

}

// ===================== SEARCH =====================

function searchProducts() {

    let keyword =
        document.getElementById("search")
        .value
        .toLowerCase();

    let filtered = allProducts.filter(product =>

        product.productName
        .toLowerCase()
        .includes(keyword)

    );

    displayProducts(filtered);

}

// ===================== CATEGORY FILTER =====================

function filterProducts() {

    let category =
        document.getElementById("categoryFilter").value;

    if (category == "") {

        displayProducts(allProducts);

        return;

    }

    let filtered = allProducts.filter(product =>

        product.category == category

    );

    displayProducts(filtered);

}

// ===================== EDIT =====================

function editProduct(id) {

    window.location.href =
        `ManageProducts.html?id=${id}`;

}