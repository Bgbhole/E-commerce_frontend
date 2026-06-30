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

        let item = order.orderItems[0];


// ======================
// Delivery Address
// ======================

document.getElementById("deliveryName").innerHTML =
    order.deliveryName || "-";

document.getElementById("deliveryAddress").innerHTML =
    order.deliveryAddress || "-";

document.getElementById("deliveryCity").innerHTML =
    `${order.deliveryCity || ""}, ${order.deliveryState || ""} - ${order.deliveryPincode || ""}`;

document.getElementById("deliveryMobile").innerHTML =
    "Phone : " + (order.deliveryMobile || "-");

        // Order Details

        document.getElementById("orderNo").innerHTML =
            "Order #" + order.orderId;

        document.getElementById("orderDate").innerHTML =
            new Date(order.orderDate).toLocaleString();

        let productsHTML = "";

order.orderItems.forEach(item => {

    productsHTML += `

    <div class="product-section">

        <img src="${API_BASE_URL}/images/${item.product.image}">

        <div class="product-info">

            <h2>${item.product.productName}</h2>

            <p>${item.product.description}</p>

            <div class="price-row">

                <h3>₹${item.price}</h3>

                <span>Qty : ${item.quantity}</span>

            </div>

        </div>

    </div>

    <hr>

    `;

});

document.querySelector(".order-card")
.insertAdjacentHTML(
    "beforeend",
    productsHTML
);       

       let estimated =
new Date(order.orderDate);

estimated.setDate(
estimated.getDate()+5
);

document.getElementById("estimatedDate").innerHTML =
estimated.toLocaleDateString();

        updateTimeline(order.status);

    }

    catch(error){

        console.error(error);

      alert(
"Unable to load tracking information."
);
    }

}

function updateTimeline(status){

    const map = {

        ORDER_CONFIRMED : "confirmed",

        PACKED : "packed",

        SHIPPED : "shipped",

        AT_DELIVERY_HUB : "hub",

        OUT_FOR_DELIVERY : "out_for_delivery",

        DELIVERED : "delivered"

    };

    const currentStatus = map[status];

    const statusOrder = [

        "confirmed",

        "packed",

        "shipped",

        "hub",

        "out_for_delivery",

        "delivered"

    ];

    const currentIndex =
        statusOrder.indexOf(currentStatus);

    const timelineItems =
        document.querySelectorAll(".timeline-item");

    timelineItems.forEach(item=>{

        item.classList.remove("completed");

        item.classList.remove("active");

    });

    timelineItems.forEach((item,index)=>{

        if(index<currentIndex){

            item.classList.add("completed");

        }

        else if(index===currentIndex){

            item.classList.add("active");

        }

    });

}

function downloadInvoice(){

    const params =
    new URLSearchParams(
        window.location.search
    );

    let orderId =
    params.get("orderId");

    window.location.href =
    `Invoice.html?orderId=${orderId}`;

}