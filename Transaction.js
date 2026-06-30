let seller =
JSON.parse(localStorage.getItem("currentUser"));

window.onload = loadTransactions;

async function loadTransactions(){

    let response =
    await fetch(`${API_BASE_URL}/api/orders/seller/${seller.sellerId}`);

    let orders = await response.json();

    let html = "";

    orders.forEach(order=>{

        html += `
        <tr>

            <td>${order.orderId}</td>
            <td>${order.orderDate}</td>
            <td>${order.paymentMethod}</td>
            <td>₹${order.totalAmount}</td>
            <td>${order.status}</td>

        </tr>
        `;

    });

    document.getElementById("tbody").innerHTML = html;

}