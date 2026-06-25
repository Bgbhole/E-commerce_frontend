let seller =
JSON.parse(localStorage.getItem("currentUser"));

window.onload = loadOrders;

async function loadOrders() {

    let response =
    await fetch(`http://localhost:8080/api/orders/seller/${seller.sellerId}`);

    let orders = await response.json();

    let html = "";

    orders.forEach(order => {

        html += `
        <tr>
            <td>${order.orderId}</td>
            <td>${order.customer.firstName}</td>
            <td>${order.product.productName}</td>
            <td>${order.quantity}</td>
            <td>${order.totalPrice}</td>
            <td>${order.status}</td>

            <td>
                <button onclick="acceptOrder(${order.orderId})">
                    Accept
                </button>
            </td>

        </tr>`;
    });

    document.getElementById("tbody").innerHTML = html;
}