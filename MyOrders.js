// Remove previous history entry
history.pushState(null, null, location.href);

window.addEventListener("popstate", function () {

    window.location.replace("index.html");

});

window.onload = function () {

    filterOrders("ALL");

};

async function filterOrders(status) {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {

        alert("Please Login");

        window.location.href = "loginpage.html";

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/orders/user/${user.id}`
        );

        if (!response.ok) {

            throw new Error("Unable to fetch orders");

        }

        const orders = await response.json();

        let html = "";

        orders.forEach(order => {

            if (status !== "ALL" && order.status !== status) {
                return;
            }

            let productsHtml = "";

            order.orderItems.forEach(item => {

                let image = item.product
    ? `${API_BASE_URL}/api/products/image/${item.product.productId}`
    : "images/no-image.png";

                let productName = item.productName || "Product Not Available";

                let brand = item.brand || "-";

                productsHtml += `

                <div class="ordered-product">

                    <img src="${image}" width="100">

                    <div>

                        <h3>${productName}</h3>

                        <p><b>Brand :</b> ${brand}</p>

                        <p><b>Quantity :</b> ${item.quantity}</p>

                        <p><b>Price :</b> ₹${item.price}</p>

                    </div>

                </div>

                <hr>

                `;

            });

            html += `

            <div class="order-card">

                <div class="details">

                    <h2>Order #${order.orderId}</h2>

                    <p>

                        <b>Order Date :</b>

                        ${new Date(order.orderDate).toLocaleString()}

                    </p>

                    <p>

                        <b>Payment :</b>

                        ${order.paymentStatus}

                    </p>

                    <p>

                        <b>Order Status :</b>

                        ${order.status}

                    </p>

                    <p>

                        <b>Total Amount :</b>

                        ₹${order.totalAmount}

                    </p>

                    <p>

                        <b>Tracking No :</b>

                        ${order.trackingNumber}

                    </p>

                </div>

                ${productsHtml}

                <div class="actions">

                    <button class="track"
                        onclick="window.location.href='TrackOrder.html?orderId=${order.orderId}'">

                        Track Order

                    </button>

                    <button class="invoice"
                        onclick="window.location.href='Invoice.html?orderId=${order.orderId}'">

                        Download Invoice

                    </button>

                    ${order.status !== "CANCELLED" &&
                      order.status !== "DELIVERED"

                    ?

                    `

                    <button class="cancel"
                        onclick="cancelOrder(${order.orderId})">

                        Cancel Order

                    </button>

                    `

                    :

                    ""

                    }

                </div>

            </div>

            `;

        });

        if (html === "") {

            html = `

            <h2 style="text-align:center;margin-top:50px;">

                No Orders Found

            </h2>

            `;

        }

        document.getElementById("orderList").innerHTML = html;

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

async function cancelOrder(orderId) {

    if (!confirm("Cancel this order?")) {

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/orders/cancel/${orderId}`,

            {

                method: "PUT"

            }

        );

        if (!response.ok) {

            throw new Error("Unable to cancel order");

        }

        alert("Order Cancelled Successfully");

        filterOrders("ALL");

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

document.getElementById("searchBox")
.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    document.querySelectorAll(".order-card")
        .forEach(card => {

            card.style.display =
                card.innerText.toLowerCase().includes(value)
                ? "block"
                : "none";

        });

});
