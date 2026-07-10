let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {
    alert("Please login as seller");
    window.location.href = "loginpage.html";
}

window.onload = loadOrders;

async function loadOrders() {

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/orders/seller/${seller.sellerId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load orders");
        }

        let orders = await response.json();

        let html = "";

        orders.forEach(order => {

            html += `
            <tr>

                <td>${order.orderId}</td>

                <td>${order.user.firstName}</td>

                <td>₹${order.totalAmount}</td>

                <td>${order.paymentStatus}</td>

                <td>${order.status}</td>

                <td>
                    <button onclick="changeStatus(${order.orderId})">
                        Update
                    </button>
                </td>

            </tr>
            `;
        });

        document.getElementById("tbody").innerHTML = html;

    } catch (error) {

        console.log(error);
        alert("Unable to load seller orders");

    }
}

function changeStatus(orderId) {

    alert("Next step: Update status API");

}
