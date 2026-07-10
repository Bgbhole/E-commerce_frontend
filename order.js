let orders = JSON.parse(localStorage.getItem("orders")) || [];

displayOrders();


// Prevent going back to Payment/Checkout
history.pushState(null, null, location.href);

window.addEventListener("popstate", function () {

    window.location.replace("index.html");

});


function displayOrders() {

    let box = document.getElementById("orders");

    box.innerHTML = "";

    orders.forEach((item, index) => {

        box.innerHTML += `
        <div class="order">

            <img src="${item.image}">

            <div class="details">

                <h2>${item.name}</h2>

                <h3>₹${item.price}</h3>

                <p>Order Date : ${new Date().toLocaleDateString()}</p>

                <h4 class="status">
                    Status : Pending
                </h4>

                <button onclick="cancelOrder(${index})">
                    Cancel Order
                </button>

            </div>

        </div>
        `;

    });

}


function cancelOrder(index) {

    orders.splice(index, 1);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    displayOrders();

    alert("Order Cancelled");

}