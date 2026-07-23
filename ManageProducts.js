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

            let specificationHtml = "";

            console.log(product.productName, product.category);

            // ================= BOOK =================

            if (product.category === "Books") {

                specificationHtml = `

                <div class="section-title">
                    Book Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Author</label>
                        <input type="text" value="${product.author || ''}" readonly>
                    </div>

                    <div>
                        <label>Publisher</label>
                        <input type="text" value="${product.publisher || ''}" readonly>
                    </div>

                    <div>
                        <label>Language</label>
                        <input type="text" value="${product.language || ''}" readonly>
                    </div>

                    <div>
                        <label>Edition</label>
                        <input type="text" value="${product.edition || ''}" readonly>
                    </div>

                    <div>
                        <label>ISBN</label>
                        <input type="text" value="${product.isbn || ''}" readonly>
                    </div>

                    <div>
                        <label>Pages</label>
                        <input type="text" value="${product.pages || ''}" readonly>
                    </div>

                    <div>
                        <label>Binding</label>
                        <input type="text" value="${product.binding || ''}" readonly>
                    </div>

                    <div>
                        <label>Publication Year</label>
                        <input type="text" value="${product.publicationYear || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= MOBILE =================

            if (product.category === "Mobile") {

                specificationHtml = `

                <div class="section-title">
                    Mobile Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>RAM</label>
                        <input type="text" value="${product.ram || ''}" readonly>
                    </div>

                    <div>
                        <label>Storage</label>
                        <input type="text" value="${product.storage || ''}" readonly>
                    </div>

                    <div>
                        <label>Processor</label>
                        <input type="text" value="${product.processor || ''}" readonly>
                    </div>

                    <div>
                        <label>Battery</label>
                        <input type="text" value="${product.battery || ''}" readonly>
                    </div>

                    <div>
                        <label>Camera</label>
                        <input type="text" value="${product.camera || ''}" readonly>
                    </div>

                    <div>
                        <label>Display</label>
                        <input type="text" value="${product.display || ''}" readonly>
                    </div>

                    <div>
                        <label>Operating System</label>
                        <input type="text" value="${product.operatingSystem || ''}" readonly>
                    </div>

                    <div>
                        <label>Network</label>
                        <input type="text" value="${product.network || ''}" readonly>
                    </div>

                </div>

                `;

            }

                        // ================= ELECTRONICS =================

            if (product.category === "Electronics") {

                specificationHtml = `

                <div class="section-title">
                    Electronics Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Voltage</label>
                        <input type="text" value="${product.voltage || ''}" readonly>
                    </div>

                    <div>
                        <label>Power</label>
                        <input type="text" value="${product.power || ''}" readonly>
                    </div>

                    <div>
                        <label>Connectivity</label>
                        <input type="text" value="${product.connectivity || ''}" readonly>
                    </div>

                    <div>
                        <label>Warranty</label>
                        <input type="text" value="${product.warranty || ''}" readonly>
                    </div>

                    <div>
                        <label>Model</label>
                        <input type="text" value="${product.model || ''}" readonly>
                    </div>

                    <div>
                        <label>Weight</label>
                        <input type="text" value="${product.weight || ''}" readonly>
                    </div>

                    <div>
                        <label>Color</label>
                        <input type="text" value="${product.color || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= FASHION =================

            if (product.category === "Fashion") {

                specificationHtml = `

                <div class="section-title">
                    Fashion Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Size</label>
                        <input type="text" value="${product.size || ''}" readonly>
                    </div>

                    <div>
                        <label>Material</label>
                        <input type="text" value="${product.material || ''}" readonly>
                    </div>

                    <div>
                        <label>Fabric</label>
                        <input type="text" value="${product.fabric || ''}" readonly>
                    </div>

                    <div>
                        <label>Gender</label>
                        <input type="text" value="${product.gender || ''}" readonly>
                    </div>

                    <div>
                        <label>Fit</label>
                        <input type="text" value="${product.fit || ''}" readonly>
                    </div>

                    <div>
                        <label>Pattern</label>
                        <input type="text" value="${product.pattern || ''}" readonly>
                    </div>

                    <div>
                        <label>Sleeve</label>
                        <input type="text" value="${product.sleeve || ''}" readonly>
                    </div>

                    <div>
                        <label>Wash Care</label>
                        <input type="text" value="${product.washCare || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= FURNITURE =================

            if (product.category === "Furniture") {

                specificationHtml = `

                <div class="section-title">
                    Furniture Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Dimensions</label>
                        <input type="text" value="${product.dimensions || ''}" readonly>
                    </div>

                    <div>
                        <label>Finish</label>
                        <input type="text" value="${product.finish || ''}" readonly>
                    </div>

                    <div>
                        <label>Assembly</label>
                        <input type="text" value="${product.assembly || ''}" readonly>
                    </div>

                    <div>
                        <label>Room Type</label>
                        <input type="text" value="${product.roomType || ''}" readonly>
                    </div>

                    <div>
                        <label>Material</label>
                        <input type="text" value="${product.material || ''}" readonly>
                    </div>

                </div>

                `;

            }

                        // ================= GROCERY =================

            if (product.category === "Grocery") {

                specificationHtml = `

                <div class="section-title">
                    Grocery Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Manufacturer</label>
                        <input type="text" value="${product.manufacturer || ''}" readonly>
                    </div>

                    <div>
                        <label>Country</label>
                        <input type="text" value="${product.country || ''}" readonly>
                    </div>

                    <div>
                        <label>Expiry Date</label>
                        <input type="text" value="${product.expiryDate || ''}" readonly>
                    </div>

                    <div>
                        <label>Storage Instruction</label>
                        <input type="text" value="${product.storageInstruction || ''}" readonly>
                    </div>

                    <div>
                        <label>Organic</label>
                        <input type="text" value="${product.organic || ''}" readonly>
                    </div>

                    <div>
                        <label>Veg</label>
                        <input type="text" value="${product.veg || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= HOME & KITCHEN =================

if (product.category === "Home & Kitchen") {

    specificationHtml = `

    <div class="section-title">
        Home & Kitchen Specifications
    </div>

    <div class="details-grid">

        <div>
            <label>Material</label>
            <input type="text" value="${product.material || ''}" readonly>
        </div>

        <div>
            <label>Color</label>
            <input type="text" value="${product.color || ''}" readonly>
        </div>

        <div>
            <label>Weight</label>
            <input type="text" value="${product.weight || ''}" readonly>
        </div>

        <div>
            <label>Warranty</label>
            <input type="text" value="${product.warranty || ''}" readonly>
        </div>

        <div>
            <label>Capacity</label>
            <input type="text" value="${product.capacity || ''}" readonly>
        </div>

        <div>
            <label>Usage</label>
            <input type="text" value="${product.usage || ''}" readonly>
        </div>

        <div>
            <label>Dishwasher Safe</label>
            <input type="text" value="${product.dishwasher || ''}" readonly>
        </div>

        <div>
            <label>Microwave Safe</label>
            <input type="text" value="${product.microwave || ''}" readonly>
        </div>

    </div>

    `;

}
            // ================= BEAUTY =================

            if (product.category === "Beauty") {

                specificationHtml = `

                <div class="section-title">
                    Beauty Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Skin Type</label>
                        <input type="text" value="${product.skinType || ''}" readonly>
                    </div>

                    <div>
                        <label>Hair Type</label>
                        <input type="text" value="${product.hairType || ''}" readonly>
                    </div>

                    <div>
                        <label>Ingredients</label>
                        <input type="text" value="${product.ingredients || ''}" readonly>
                    </div>

                    <div>
                        <label>Benefits</label>
                        <input type="text" value="${product.benefits || ''}" readonly>
                    </div>

                    <div>
                        <label>Net Quantity</label>
                        <input type="text" value="${product.netQuantity || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= SPORTS =================

            if (product.category === "Sports") {

                specificationHtml = `

                <div class="section-title">
                    Sports Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Sport Type</label>
                        <input type="text" value="${product.sportType || ''}" readonly>
                    </div>

                    <div>
                        <label>Age Group</label>
                        <input type="text" value="${product.ageGroup || ''}" readonly>
                    </div>

                </div>

                `;

            }

            // ================= TOYS =================

            if (product.category === "Toys") {

                specificationHtml = `

                <div class="section-title">
                    Toy Specifications
                </div>

                <div class="details-grid">

                    <div>
                        <label>Toy Age</label>
                        <input type="text" value="${product.toyAge || ''}" readonly>
                    </div>

                    <div>
                        <label>Battery Required</label>
                        <input type="text" value="${product.batteryRequired || ''}" readonly>
                    </div>

                    <div>
                        <label>Educational</label>
                        <input type="text" value="${product.educational || ''}" readonly>
                    </div>

                    <div>
                        <label>Safety</label>
                        <input type="text" value="${product.safety || ''}" readonly>
                    </div>

                </div>

                `;

            }

                        html += `

<div class="product-card">

    <div class="product-top">

        <div class="product-image">

            <img src="${API_BASE_URL}/api/products/image/${product.productId}"
                 onerror="this.src='Images/no-image.png'">

        </div>

        <div class="product-info">

            <div class="status active">

                <i class="fa-solid fa-circle-check"></i>

                ${product.status}

            </div>

            <h2>${product.productName}</h2>

            <p class="brand">${product.brand}</p>

            <span class="category">${product.category}</span>

        </div>

    </div>

    <div class="section-title">
        Product Details
    </div>

    <div class="details-grid">

        <div>
            <label>Product Name</label>
            <input type="text" value="${product.productName}" readonly>
        </div>

        <div>
            <label>Brand</label>
            <input type="text" value="${product.brand}" readonly>
        </div>

        <div>
            <label>Category</label>
            <input type="text" value="${product.category}" readonly>
        </div>

        <div>
            <label>Purchase Price</label>
            <input type="number" value="${product.purchasePrice}" readonly>
        </div>

        <div>
            <label>Selling Price</label>
            <input type="number"
                   id="price${product.productId}"
                   value="${product.sellingPrice}">
        </div>

        <div>
            <label>Quantity</label>
            <input type="number"
                   id="qty${product.productId}"
                   value="${product.quantity}">
        </div>

        <div>
            <label>GST (%)</label>
            <input type="number"
                   value="${product.gstPercentage}"
                   readonly>
        </div>

        <div>
            <label>Profit</label>
            <input type="number"
                   value="${product.profit}"
                   readonly>
        </div>

        <div>
            <label>GST Amount</label>
            <input type="number"
                   value="${product.gstAmount}"
                   readonly>
        </div>

        <div>
            <label>Final Price</label>
            <input type="number"
                   value="${product.finalPrice}"
                   readonly>
        </div>

    </div>

    <div class="section-title">
        Pricing Details
    </div>

    <div class="details-grid">

        <div>
            <label>Admin Discount (%)</label>
            <input type="number"
                   value="${product.adminDiscount ?? 0}"
                   readonly>
        </div>

        <div>
            <label>Discount Amount</label>
            <input type="number"
                   value="${product.discountAmount ?? 0}"
                   readonly>
        </div>

        <div>
            <label>Customer Final Price</label>
            <input type="number"
                   value="${product.finalSellingPrice ?? 0}"
                   readonly>
        </div>

        <div>
            <label>Platform Fee (%)</label>
            <input type="number"
                   value="${product.platformFeePercentage ?? 0}"
                   readonly>
        </div>

        <div>
            <label>Platform Fee Amount</label>
            <input type="number"
                   value="${product.platformFeeAmount ?? 0}"
                   readonly>
        </div>

        <div>
            <label>Seller Net Profit</label>
            <input type="number"
                   value="${product.sellerNetProfit ?? 0}"
                   readonly>
        </div>

    </div>

    ${specificationHtml}

                    <div class="button-group">

                    <button
                        class="update-btn"
                        onclick="updateProduct(${product.productId})">

                        <i class="fa-solid fa-floppy-disk"></i>

                        Update Product

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.productId})">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </div>

            </div>

            `;

        });

        document.getElementById("productContainer").innerHTML = html;

    } catch (error) {

        console.error(error);
        alert("Unable to load products.");

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