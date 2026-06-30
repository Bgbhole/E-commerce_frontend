let seller = JSON.parse(localStorage.getItem("currentUser"));

window.onload = function () {
    loadEarnings();
};

async function loadEarnings() {

    try {

        console.log("Current User:", seller);

        if (!seller) {
            alert("Please login first.");
            return;
        }

        // Support both sellerId and id
        let sellerId = seller.sellerId || seller.id;

        if (!sellerId) {
            alert("Seller ID not found.");
            console.log("Seller Object:", seller);
            return;
        }

        let response = await fetch(`${API_BASE_URL}/api/orders/seller/${sellerId}`);

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        let orders = await response.json();

        console.log("Orders:", orders);

        if (!Array.isArray(orders)) {
            console.error("Expected an array but received:", orders);
            return;
        }

        let today = 0;
        let monthly = 0;
        let total = 0;
        let profit = 0;

        let now = new Date();

        orders.forEach(order => {

            if (order.status !== "DELIVERED") {
                return;
            }

            let amount = Number(order.totalAmount || 0);

            total += amount;

            let orderDate = new Date(order.orderDate);

            // Today's earnings
            if (
                orderDate.getDate() === now.getDate() &&
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
            ) {
                today += amount;
            }

            // Monthly earnings
            if (
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
            ) {
                monthly += amount;
            }

            // Profit (20%)
            profit += amount * 0.20;

        });

        document.getElementById("today").innerHTML = "₹" + today.toFixed(2);
        document.getElementById("monthly").innerHTML = "₹" + monthly.toFixed(2);
        document.getElementById("total").innerHTML = "₹" + total.toFixed(2);
        document.getElementById("profit").innerHTML = "₹" + profit.toFixed(2);

    } catch (error) {

        console.error("Error:", error);
        alert("Unable to load earnings.");

    }
}