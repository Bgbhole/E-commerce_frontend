let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {

    alert("Please Login First");
    window.location.href = "loginpage.html";

}

let allTransactions = [];

window.onload = function () {

    loadTransactions();

};

// ======================

async function loadTransactions() {

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/orders/seller/${seller.sellerId}`
        );

        allTransactions = await response.json();

        displayTransactions(allTransactions);

    }

    catch (error) {

        console.log(error);

    }

}

// ======================

function displayTransactions(orders) {

    let html = "";

    let revenue = 0;

    let success = 0;

    let pending = 0;

    let cancelled = 0;

    let count = 0;

    orders.forEach(order => {

        order.orderItems.forEach(item => {

            count++;

            // Revenue only for non-cancelled successful payments
            if (
                order.paymentStatus === "SUCCESS" &&
                order.status !== "CANCELLED"
            ) {

                revenue += item.price * item.quantity;

                success++;

            }
            else if (order.status === "CANCELLED") {

                cancelled++;

            }
            else {

                pending++;

            }

            html += `

<tr>

<td><b>TXN-${item.orderItemId}</b></td>

<td>#${order.orderId}</td>

<td>
${order.user.firstName} ${order.user.lastName}
</td>

<td>
<img
class="product-img"
src="$${API_BASE_URL}/api/products/image/${product.productId}"
onerror="this.src='images/no-image.png'">
</td>

<td>${item.product.productName}</td>

<td>${item.quantity}</td>

<td>₹${item.price}</td>

<td>₹${(item.price * item.quantity).toFixed(2)}</td>

<td>

<b>${order.paymentMethod}</b>

<br>

<span class="${order.paymentStatus === "SUCCESS" ? "success" : "pending"}">

${order.paymentStatus}

</span>

</td>

<td>

<span class="${
order.status === "CANCELLED"
? "cancelled"
: order.status === "DELIVERED"
? "success"
: "confirmed"
}">

${order.status.replaceAll("_", " ")}

</span>

</td>

<td>

${new Date(order.orderDate).toLocaleDateString()}

</td>

</tr>

`;

        });

    });

    document.getElementById("tbody").innerHTML = html;

    document.getElementById("totalTransactions").innerHTML = count;

    document.getElementById("totalRevenue").innerHTML =
        "₹" + revenue.toFixed(2);

    document.getElementById("successfulPayments").innerHTML =
        success;

    document.getElementById("pendingPayments").innerHTML =
        pending;

    // Only if you added the Cancelled Payments card
    const cancelBox = document.getElementById("cancelledPayments");

    if (cancelBox) {

        cancelBox.innerHTML = cancelled;

    }

}

// ======================

function searchTransaction() {

    let keyword =
        document.getElementById("search")
        .value
        .toLowerCase();

    let filtered = [];

    allTransactions.forEach(order => {

        let items = [];

        order.orderItems.forEach(item => {

            if (

                item.product.productName.toLowerCase().includes(keyword)

                ||

                order.user.firstName.toLowerCase().includes(keyword)

                ||

                order.user.lastName.toLowerCase().includes(keyword)

            ) {

                items.push(item);

            }

        });

        if (items.length > 0) {

            filtered.push(order);

        }

    });

    displayTransactions(filtered);

}