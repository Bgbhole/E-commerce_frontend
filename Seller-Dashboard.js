window.onload = function () {
    loadDashboard();
};

async function loadDashboard() {

  const seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {

    alert("Please login first.");

    window.location.href = "loginpage.html";

    return;
}

    try {

        // ================= PRODUCTS =================

        let productResponse = await fetch(
            `${API_BASE_URL}/api/products/seller/${seller.sellerId}`
        );

        let products = await productResponse.json();

        document.getElementById("products").innerHTML =
            products.length;

        // ================= ORDERS =================

        let orderResponse = await fetch(
            `${API_BASE_URL}/api/orders/seller/${seller.sellerId}`
        );

        let orders = await orderResponse.json();

        console.log("Orders :", orders);

        // Active Orders (Not Cancelled)

        let activeOrders = orders.filter(order =>
            order.status != "CANCELLED"
        );

        document.getElementById("orders").innerHTML =
            activeOrders.length;

        // ================= REVENUE =================

        let revenue = 0;

        activeOrders.forEach(order => {

            if (order.paymentStatus == "SUCCESS") {

                revenue += order.totalAmount;

            }

        });

        document.getElementById("revenue").innerHTML =
            "₹" + revenue.toFixed(2);

        // ================= PROFIT =================

        let profit = 0;

        activeOrders.forEach(order => {

            order.orderItems.forEach(item => {

                profit += item.product.profit * item.quantity;

            });

        });

        document.getElementById("profit").innerHTML =
            "₹" + profit.toFixed(2);

    }

    catch (error) {

        console.log(error);

    }

}

function logout() {

    // Remove seller session
    localStorage.removeItem("currentSeller");

    // Optional: remove any seller-related temporary data
    localStorage.removeItem("sellerId");
    localStorage.removeItem("sellerProducts");

    alert("Logged out successfully.");

    // Redirect to login page
    window.location.href = "loginpage.html";
}