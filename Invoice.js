const orderId = new URLSearchParams(window.location.search).get("orderId");

if (!orderId) {
    alert("Order ID not found.");
    window.history.back();
}

async function loadInvoice() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);

        if (!response.ok) {
            throw new Error("Unable to load invoice.");
        }

        const order = await response.json();

        fillOrderDetails(order);

        fillProductTable(order.orderItems);

    } catch (e) {

        console.error(e);

        alert("Unable to load invoice.");

    }

}

function fillOrderDetails(order) {

    // =========================
    // Invoice Details
    // =========================

    document.getElementById("invoiceNumber").innerText =
        "INV-" + order.orderId;

    document.getElementById("invoiceDate").innerText =
        new Date().toLocaleDateString();

    // =========================
    // Order Details
    // =========================

    document.getElementById("orderId").innerText =
        order.orderId;

    document.getElementById("trackingNumber").innerText =
        order.trackingNumber;

    document.getElementById("transactionId").innerText =
        order.sellerTransactionId || "-";

    document.getElementById("orderDate").innerText =
        new Date(order.orderDate).toLocaleString();

    document.getElementById("paymentMethod").innerText =
        order.paymentMethod;

    document.getElementById("paymentStatus").innerText =
        order.paymentStatus;

    // =========================
    // Customer
    // =========================

    document.getElementById("customerName").innerText =
        order.deliveryName;

    document.getElementById("customerMobile").innerText =
        order.deliveryMobile;

    document.getElementById("deliveryAddress").innerHTML =

        order.deliveryAddress + "<br>" +

        order.deliveryCity + ", " +

        order.deliveryState + "<br>" +

        order.deliveryPincode;

    // =========================
    // Seller
    // =========================

    document.getElementById("sellerName").innerText =
        order.sellerName;

    document.getElementById("shopName").innerText =
        order.shopName;

    document.getElementById("sellerEmail").innerText =
        order.sellerEmail;

    document.getElementById("sellerMobile").innerText =
        order.sellerMobile;

    // =========================
    // Payment Summary
    // =========================
// =========================
// Payment Summary
// =========================

let orderValue = 0;
let totalGST = 0;
let discount = 0;

order.orderItems.forEach(item=>{

    orderValue += item.sellingPrice * item.quantity;

    totalGST += item.gstAmount * item.quantity;

    discount +=
        (item.sellingPrice - item.finalPrice)
        * item.quantity;

});

document.getElementById("itemsTotal").innerText =
formatMoney(orderValue);

document.getElementById("discountAmount").innerText =
"- " + formatMoney(discount);

document.getElementById("gstPercentage").innerText =
order.orderItems.length
? order.orderItems[0].gstPercentage
: 0;

document.getElementById("gstAmount").innerText =
formatMoney(totalGST);

document.getElementById("grandTotal").innerText =
formatMoney(order.customerPaidAmount);

document.getElementById("paymentMethodSummary").innerText =
order.paymentMethod;

document.getElementById("paymentStatusSummary").innerText =
order.paymentStatus;

}

function fillProductTable(items){

    const tbody =
    document.getElementById("productTable");

    tbody.innerHTML="";

    items.forEach(item=>{

        tbody.innerHTML+=`

        <tr>

        <td>

        <img src="${API_BASE_URL}/uploads/${item.image}">

        </td>

        <td>${item.productName}</td>

        <td>${item.brand}</td>

        <td>${item.quantity}</td>

        <td>${formatMoney(item.finalPrice)}</td>

        <td>${item.gstPercentage}%</td>

        <td>
    ${formatMoney(item.gstAmount)}
    <br>
    <small class="included-gst">(Included)</small>
</td>
        <td>${formatMoney(item.finalPrice*item.quantity)}</td>

        </tr>

        `;

    });

}

function formatMoney(value){

    return "₹" + Number(value || 0).toLocaleString("en-IN",{

        minimumFractionDigits:2,

        maximumFractionDigits:2

    });

}

function downloadPDF(){

    window.print();

}

window.onload = loadInvoice;