let seller =
JSON.parse(localStorage.getItem("currentUser"));

window.onload = loadOrders;

async function loadOrders(){

    let response =
    await fetch(`http://localhost:8080/api/orders/seller/${seller.sellerId}`);

    let orders = await response.json();

    let html = "";

    orders.forEach(order=>{

        if(order.status=="PENDING"){

            html += `
            <tr>

                <td>${order.orderId}</td>
                <td>${order.orderDate}</td>
                <td>${order.paymentMethod}</td>
                <td>₹${order.totalAmount}</td>
                <td>${order.status}</td>

                <td>
                    <button onclick="acceptOrder(${order.orderId})">
                        Accept
                    </button>
                </td>

            </tr>
            `;
        }

    });

    document.getElementById("tbody").innerHTML = html;

}

async function acceptOrder(orderId){

    await fetch(
    `http://localhost:8080/api/orders/accept/${orderId}`,
    {
        method:"PUT"
    });

    loadOrders();

}