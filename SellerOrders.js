let seller = JSON.parse(localStorage.getItem(""));

window.onload = loadOrders;

async function loadOrders() {

    let response = await fetch(
        `${API_BASE_URL}/api/orders/seller/${seller.sellerId}`
    );

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
}

function changeStatus(orderId){

    alert("Next step: Update status API");

}