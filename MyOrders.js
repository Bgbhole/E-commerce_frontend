window.onload = function () {

    filterOrders("ALL");

};

function filterOrders(status) {

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let html = "";

    orders.forEach(order => {

        // Only show logged-in user's orders
        if (order.userId == user.id &&
            (status == "ALL" || order.paymentStatus == status)) {

            html += `

            <div class="order-card">

                <div class="image-box">

                    <img src="${order.image || "${API_BASE_URL}/images/${product.image}"}"
                         width="120">

                </div>

                <div class="details">

                    <h2>${order.name}</h2>

                    <p>₹${order.price}</p>

                    <p>Quantity : ${order.quantity}</p>

                    <p>Order ID : ${order.orderId}</p>

                    <p>Date : ${order.orderDate}</p>

                    <p class="${order.paymentStatus.toLowerCase()}">

                        Payment : ${order.paymentStatus}

                    </p>

                    <p>

                        Status : ${order.orderStatus}

                    </p>

                </div>

                <div class="actions">

                    ${
                        order.paymentStatus == "SUCCESS"

                        ?

                        `
                        <button class="track">
                            Track Order
                        </button>

                        <button class="invoice">
                            Download Invoice
                        </button>

                        <button class="review">
                            Rate & Review
                        </button>
                        `

                        :

                        order.paymentStatus == "PENDING"

                        ?

                        `
                        <button class="track">
                            Track Order
                        </button>

                        <button class="cancel">
                            Cancel Order
                        </button>
                        `

                        :

                        `
                        <button class="retry">
                            Retry Payment
                        </button>
                        `
                    }

                </div>

            </div>

            `;

        }

    });

    document.getElementById("orderList").innerHTML = html;

}


document.getElementById("searchBox")
.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    let cards = document.querySelectorAll(".order-card");

    cards.forEach(card => {

        let text = card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "flex";

        }
        else {

            card.style.display = "none";

        }

    });

});