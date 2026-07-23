const seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {

    alert("Please Login as Seller");

    window.location.href = "loginpage.html";

}

let allOrders = [];

/*=========================================
            PAGE LOAD
==========================================*/

window.onload = () => {

    loadOrders();

    document
        .getElementById("searchOrder")
        .addEventListener("keyup", filterOrders);

    document
        .getElementById("statusFilter")
        .addEventListener("change", filterOrders);

    document
        .getElementById("paymentFilter")
        .addEventListener("change", filterOrders);

};

/*=========================================
            LOAD ORDERS
==========================================*/

async function loadOrders(){

    try{

        const response = await fetch(

            `${API_BASE_URL}/api/orders/seller/${seller.sellerId}`

        );

        if(!response.ok){

            throw new Error("Unable to load orders");

        }

        allOrders = await response.json();

        loadDashboard(allOrders);

        displayOrders(allOrders);

    }

    catch(error){

        console.error(error);

        alert("Unable to load Seller Orders");

    }

}

/*=========================================
            DASHBOARD
==========================================*/

function loadDashboard(orders){

    let total = 0;

    let pending = 0;

    let shipped = 0;

    let delivered = 0;

    let revenue = 0;

    total = orders.length;

    orders.forEach(order=>{

        revenue += Number(

            order.customerPaidAmount ||

            order.totalAmount ||

            0

        );

        switch(order.status){

            case "ORDER_CONFIRMED":

                pending++;

                break;

            case "SHIPPED":

                shipped++;

                break;

            case "DELIVERED":

                delivered++;

                break;

        }

    });

    document.getElementById("totalOrders").innerText = total;

    document.getElementById("pendingOrders").innerText = pending;

    document.getElementById("shippedOrders").innerText = shipped;

    document.getElementById("deliveredOrders").innerText = delivered;

    document.getElementById("totalRevenue").innerText =
        "₹" + revenue.toFixed(2);

}

/*=========================================
            DISPLAY ORDERS
==========================================*/

function displayOrders(orders){

    let html = "";

    orders.forEach(order=>{

        if(!order.orderItems || order.orderItems.length===0){

            html += `

            <tr>

                <td>-</td>

                <td>${order.orderId}</td>

                <td>${formatDate(order.orderDate)}</td>

                <td>-</td>

                <td>${order.user?.firstName || "-"}</td>

                <td>-</td>

                <td>

                    ₹${Number(order.customerPaidAmount || order.totalAmount || 0).toFixed(2)}

                </td>

                <td>

                    ₹${Number(order.shopkartContribution || 0).toFixed(2)}

                </td>

                <td>${order.paymentMethod || "-"}</td>

                <td>

                    <span class="payment ${getPaymentClass(order.paymentStatus)}">

                        ${order.paymentStatus || "-"}

                    </span>

                </td>

                <td>

                    <span class="status ${getStatusClass(order.status)}">

                        ${formatStatus(order.status)}

                    </span>

                </td>

                <td>

                    ${order.trackingNumber || "-"}

                </td>

                <td>

                    <div class="action-buttons">

                        <button

                            class="statusBtn"

                            onclick="changeStatus(${order.orderId})">

                            Update

                        </button>

                    </div>

                </td>

            </tr>

            `;

            return;

        }

        order.orderItems.forEach(item=>{

            html += `

            <tr>

                <td>

                    <img

                    src="${API_BASE_URL}/api/products/image/${item.product.productId}"

                    class="product-image"

                    onerror="this.src='images/no-image.png'">

                </td>

                <td>${order.orderId}</td>

                <td>${formatDate(order.orderDate)}</td>

                <td>${item.productName}</td>

                <td>${order.user?.firstName || "-"}</td>

                <td>${item.quantity}</td>

                <td>

                    ₹${Number(order.customerPaidAmount || order.totalAmount || 0).toFixed(2)}

                </td>

                <td>

                    ₹${Number(order.shopkartContribution || 0).toFixed(2)}

                </td>

                <td>

                    ${order.paymentMethod || "-"}

                </td>

                <td>

                    <span class="payment ${getPaymentClass(order.paymentStatus)}">

                        ${order.paymentStatus || "-"}

                    </span>

                </td>

                <td>

                    <span class="status ${getStatusClass(order.status)}">

                        ${formatStatus(order.status)}

                    </span>

                </td>

                <td>

                    ${order.trackingNumber || "-"}

                </td>

                <td>

                    <div class="action-buttons">

                        <button

                            class="viewBtn"

                            onclick="viewOrder(${order.orderId})">

                            View

                        </button>

                     ${
order.status === "ORDER_CONFIRMED"

?

`<button
    class="statusBtn"
    onclick="changeStatus(${order.orderId})">
    Mark Packed
</button>`

:

`<button
    class="statusBtn"
    disabled>

    ${formatStatus(order.status)}

</button>`

}

                    </div>

                </td>

            </tr>

            `;

        });

    });

    document.getElementById("tbody").innerHTML = html;

}

/*=========================================
            SEARCH & FILTER
==========================================*/

function filterOrders(){

    const search = document
        .getElementById("searchOrder")
        .value
        .toLowerCase();

    const status = document
        .getElementById("statusFilter")
        .value;

    const payment = document
        .getElementById("paymentFilter")
        .value;

    const filtered = allOrders.filter(order=>{

        let customer = "";

        if(order.user){

            customer =
                (order.user.firstName || "")
                .toLowerCase();

        }

        let product = "";

        if(order.orderItems && order.orderItems.length>0){

            product = order.orderItems

                .map(item=>item.productName)

                .join(" ")

                .toLowerCase();

        }

        const searchMatch =

            order.orderId
                .toString()
                .includes(search)

            ||

            customer.includes(search)

            ||

            product.includes(search);

        const statusMatch =

            status==="" ||

            order.status===status;

        const paymentMatch =

            payment==="" ||

            order.paymentStatus===payment;

        return searchMatch &&

               statusMatch &&

               paymentMatch;

    });

    displayOrders(filtered);

}

/*=========================================
            DATE FORMAT
==========================================*/

function formatDate(date){

    if(!date){

        return "-";

    }

    return new Date(date)

        .toLocaleDateString(

            "en-IN",

            {

                day:"2-digit",

                month:"short",

                year:"numeric"

            }

        );

}

/*=========================================
            STATUS FORMAT
==========================================*/

function formatStatus(status){

    if(!status){

        return "-";

    }

    return status.replaceAll("_"," ");

}

/*=========================================
            PAYMENT CLASS
==========================================*/

function getPaymentClass(status){

    if(!status){

        return "";

    }

    return status.toLowerCase();

}

/*=========================================
            STATUS CLASS
==========================================*/

function getStatusClass(status){

    if(!status){

        return "";

    }

    return status.toLowerCase();

}

/*=========================================
            VIEW ORDER
==========================================*/

function viewOrder(orderId){

    const order = allOrders.find(

        o=>o.orderId===orderId

    );

    if(!order){

        return;

    }

    const item =

        order.orderItems &&

        order.orderItems.length>0

        ?

        order.orderItems[0]

        :

        null;

    // Product

    document.getElementById("modalProductImage").src =

        item

        ?

`${API_BASE_URL}/api/products/image/${item.product.productId}`

        :

"images/no-image.png";

    document.getElementById("modalProductName").innerText =

        item

        ?

        item.productName

        :

        "-";

    document.getElementById("modalBrand").innerText =

        item

        ?

        item.brand

        :

        "-";

    document.getElementById("modalQuantity").innerText =

        item

        ?

        item.quantity

        :

        "-";

    // Customer

    document.getElementById("modalCustomer").innerText =

        order.user?.firstName || "-";

    document.getElementById("modalMobile").innerText =

        order.deliveryMobile || "-";

    document.getElementById("modalAddress").innerText =

        order.deliveryAddress || "-";

    // Order

    document.getElementById("modalOrderId").innerText =

        order.orderId;

    document.getElementById("modalOrderDate").innerText =

        formatDate(order.orderDate);

    document.getElementById("modalStatus").innerText =

        formatStatus(order.status);

    document.getElementById("modalTracking").innerText =

        order.trackingNumber || "-";

    // Payment

    document.getElementById("modalPaymentMethod").innerText =

        order.paymentMethod || "-";

    document.getElementById("modalPaymentStatus").innerText =

        order.paymentStatus || "-";

    document.getElementById("modalCustomerPaid").innerText =

        Number(

            order.customerPaidAmount ||

            order.totalAmount ||

            0

        ).toFixed(2);

    document.getElementById("modalShopkartPaid").innerText =

        Number(

            order.shopkartContribution ||

            0

        ).toFixed(2);

    document.getElementById("modalSellerPrice").innerText =

        Number(

            order.sellerPrice ||

            0

        ).toFixed(2);

    document.getElementById("modalPlatformFee").innerText =

        Number(

            order.platformFeeAmount ||

            0

        ).toFixed(2);

    document.getElementById("modalSellerProfit").innerText =

        Number(

            order.sellerNetProfit ||

            0

        ).toFixed(2);

    document
        .getElementById("viewOrderModal")
        .style.display = "block";

}

/*=========================================
            CLOSE VIEW MODAL
==========================================*/

function closeViewModal(){

    document
        .getElementById("viewOrderModal")
        .style.display = "none";

}

/*=========================================
        OPEN STATUS MODAL
==========================================*/

function changeStatus(orderId) {

    const order = allOrders.find(o => o.orderId === orderId);

    if (!order) return;

    document.getElementById("statusOrderId").value =
        order.orderId;

    document.getElementById("packedOrderId").value =
        order.orderId;

    document.getElementById("currentStatus").value =
        formatStatus(order.status);

    document.getElementById("trackingNumber").value =
        order.trackingNumber;

    document.getElementById("statusModal").style.display =
        "block";

}

/*=========================================
        CLOSE STATUS MODAL
==========================================*/

function closeStatusModal(){

    document.getElementById("statusModal").style.display =
        "none";

}

/*=========================================
        UPDATE ORDER STATUS
==========================================*/

async function updateOrderStatus() {

    const orderId = document.getElementById("statusOrderId").value;

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/orders/seller/${orderId}/packed`,

            {
                method: "PUT"
            }

        );

        if (!response.ok) {

            throw new Error("Unable to mark order as packed.");

        }

        alert("Order marked as Packed successfully.");

        closeStatusModal();

        loadOrders();

    } catch (error) {

        console.error(error);

        alert("Failed to update order.");

    }

}   

/*=========================================
      CLOSE MODALS ON OUTSIDE CLICK
==========================================*/

window.onclick = function(event){

    const viewModal =

        document.getElementById("viewOrderModal");

    const statusModal =

        document.getElementById("statusModal");

    if(event.target === viewModal){

        closeViewModal();

    }

    if(event.target === statusModal){

        closeStatusModal();

    }

}

async function markAsPacked() {

    const orderId =
        document.getElementById("statusOrderId").value;

    if (!confirm("Are you sure this order has been packed?")) {

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/orders/seller/${orderId}/packed`,

            {
                method: "PUT"
            }

        );

        if (!response.ok) {

            throw new Error();

        }

        alert("Order marked as Packed successfully.");

        closeStatusModal();

        loadOrders();

    }
    catch (error) {

        console.error(error);

        alert("Unable to mark order as packed.");

    }

}