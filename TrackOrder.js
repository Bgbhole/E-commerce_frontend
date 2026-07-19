let currentOrder = null;

window.onload = function () {

    loadOrder();

};

async function loadOrder() {

    const params = new URLSearchParams(window.location.search);

    const orderId = params.get("orderId");

   

    if (!orderId) {

        alert("Order not found");

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/orders/${orderId}`
        );

        if (!response.ok) {

            throw new Error("Unable to fetch order");

        }

       const order = await response.json();

currentOrder = order;

const firstItem = order.orderItems[0];

        const editBtn = document.getElementById("editAddressBtn");

if(order.status === "ORDER_CONFIRMED"){

    editBtn.style.display = "inline-block";

}else{

    editBtn.style.display = "none";

}

        // =========================
        // Order Header
        // =========================

        document.getElementById("orderNo").innerHTML =
            "Order #" + order.orderId;

        document.getElementById("orderDate").innerHTML =
            new Date(order.orderDate).toLocaleString();

        let estimated = new Date(order.orderDate);

        estimated.setDate(estimated.getDate() + 5);

        document.getElementById("estimatedDate").innerHTML =
            estimated.toLocaleDateString();

        // =========================
        // Delivery Address
        // =========================

        document.getElementById("deliveryName").innerHTML =
            order.deliveryName || "-";

        document.getElementById("deliveryAddress").innerHTML =
            order.deliveryAddress || "-";

        document.getElementById("deliveryCity").innerHTML =
            `${order.deliveryCity || "-"}, ${order.deliveryState || "-"} - ${order.deliveryPincode || "-"}`;

        document.getElementById("deliveryMobile").innerHTML =
            order.deliveryMobile || "-";

        // =========================
        // Seller Information
        // =========================

        document.getElementById("shopName").innerHTML =
            order.shopName || "Not Available";

        document.getElementById("sellerName").innerHTML =
            order.sellerName || "Not Available";

        document.getElementById("sellerEmail").innerHTML =
            order.sellerEmail || "-";

        document.getElementById("sellerMobile").innerHTML =
            order.sellerMobile || "-";

        // =========================
        // Payment Information
        // =========================

        let paymentMethod = order.paymentMethod;

        if (paymentMethod.startsWith("card")) {

            paymentMethod = "💳 Credit / Debit Card";

        } else if (paymentMethod.startsWith("upi")) {

            paymentMethod = "📱 UPI";

        } else {

            paymentMethod = "💵 Cash On Delivery";

        }

        document.getElementById("paymentMethod").innerHTML =
            paymentMethod;

        document.getElementById("paymentStatus").innerHTML =
            order.paymentStatus;

        document.getElementById("trackingNumber").innerHTML =
            order.trackingNumber;

        document.getElementById("totalPaid").innerHTML =
            order.totalAmount;

        // =========================
        // Order Summary
        // =========================

     document.getElementById("productTotal").innerHTML =
    "₹" + firstItem.finalPrice.toFixed(2);

document.getElementById("gstAmount").innerHTML =
    "₹" + firstItem.gstAmount.toFixed(2);

document.getElementById("grandTotal").innerHTML =
    "₹" + order.totalAmount.toFixed(2);
        // =========================
        // Product Card
        // =========================

        let productsHTML = "";

        order.orderItems.forEach(item => {

    const image =
        `${API_BASE_URL}/api/products/image/${item.product.productId}`;

    productsHTML += `

    <div class="product-section">

        <!-- LEFT -->

        <div class="left-panel">

            <img
                class="product-image"
                src="${image}"
                alt="${item.productName}"
                onerror="this.src='images/no-image.png'">

        </div>

        <!-- CENTER -->

        <div class="center-panel">

            <h2>${item.productName}</h2>

            <span class="status-badge">

                ${order.status.replaceAll("_"," ")}

            </span>

            <p>

                <b>Brand :</b>

                ${item.brand}

            </p>

            <p>

                <b>Category :</b>

                ${item.category}

            </p>

            <p>

                <b>Quantity :</b>

                ${item.quantity}

            </p>

        

            <p>

                <b>Selling Price :</b>

                ₹${item.sellingPrice}

            </p>

            <p>

                <b>GST :</b>

                ₹${item.gstAmount}

            </p>

            <p>

                <b>Final Price :</b>

                ₹${item.finalPrice}

            </p>

        </div>

        <!-- RIGHT -->

        <div class="right-panel">

            <h3>Order Details</h3>

            <p>

                <b>Order ID :</b>

                ${order.orderId}

            </p>

            <p>

                <b>Payment :</b>

                ${paymentMethod}

            </p>

            <p>

                <b>Payment Status :</b>

                ${order.paymentStatus}

            </p>

            <p>

                <b>Tracking No :</b>

                ${order.trackingNumber}

            </p>

            <p>

                <b>Total Amount :</b>

                ₹${order.totalAmount}

            </p>

            <p>

                <b>Delivery Charge :</b>

                FREE

            </p>

            <p>

                <b>Estimated Delivery :</b>

                ${estimated.toLocaleDateString()}

            </p>

        </div>

    </div>

    <hr>

    `;

});

document.getElementById("productsContainer").innerHTML =
productsHTML;

// =========================
// Timeline
// =========================

updateTimeline(order.status);

}

catch(error){

    console.error(error);

    alert("Unable to load tracking information.");

}

}


// =========================
// Timeline Function
// =========================

function updateTimeline(status){

    const statusMap={

        ORDER_CONFIRMED:"confirmed",

        PACKED:"packed",

        SHIPPED:"shipped",

        AT_DELIVERY_HUB:"hub",

        OUT_FOR_DELIVERY:"out_for_delivery",

        DELIVERED:"delivered"

    };

    const order=[

        "confirmed",

        "packed",

        "shipped",

        "hub",

        "out_for_delivery",

        "delivered"

    ];

    const current=statusMap[status];

    const currentIndex=order.indexOf(current);

    document.querySelectorAll(".timeline-item")
    .forEach(item=>{

        item.classList.remove("active");

        item.classList.remove("completed");

    });

    document.querySelectorAll(".timeline-item")
    .forEach((item,index)=>{

        if(index<currentIndex){

            item.classList.add("completed");

        }

        else if(index===currentIndex){

            item.classList.add("active");

        }

    });

}


// =========================
// Download Invoice
// =========================

function downloadInvoice(){

    const params=new URLSearchParams(window.location.search);

    const orderId=params.get("orderId");

    window.location.href=
    `Invoice.html?orderId=${orderId}`;

}

function openEditModal() {

    document.getElementById("editName").value =
        currentOrder.deliveryName || "";

    document.getElementById("editMobile").value =
        currentOrder.deliveryMobile || "";

    document.getElementById("editAddress").value =
        currentOrder.deliveryAddress || "";

    document.getElementById("editCity").value =
        currentOrder.deliveryCity || "";

    document.getElementById("editState").value =
        currentOrder.deliveryState || "";

    document.getElementById("editPincode").value =
        currentOrder.deliveryPincode || "";

    document.getElementById("editModal").style.display = "flex";

}

function closeEditModal() {

    document.getElementById("editModal").style.display = "none";

}

async function saveDeliveryAddress() {

    const orderId =
        new URLSearchParams(window.location.search)
        .get("orderId");

    const body = {

        deliveryName:
            document.getElementById("editName").value,

        deliveryMobile:
            document.getElementById("editMobile").value,

        deliveryAddress:
            document.getElementById("editAddress").value,

        deliveryCity:
            document.getElementById("editCity").value,

        deliveryState:
            document.getElementById("editState").value,

        deliveryPincode:
            document.getElementById("editPincode").value

    };

    const response = await fetch(

        `${API_BASE_URL}/api/orders/update-address/${orderId}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        }

    );

    if (response.ok) {

        alert("Delivery Address Updated Successfully");

        closeEditModal();

        loadOrder();

    } else {

        alert("Unable to update address");

    }

}