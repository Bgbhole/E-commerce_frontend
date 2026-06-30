
const currentAdmin =
JSON.parse(localStorage.getItem("currentAdmin"));

if (!currentAdmin) {

    window.location.href = "AdminLogin.html";

}let orders = JSON.parse(localStorage.getItem("orders")) || [];



displayOrders();

function displayOrders(){

    let box = document.getElementById("orders");

    box.innerHTML = "";

    orders.forEach((order,index)=>{

        box.innerHTML += `
        <div class="order">

            <h2>${order.name}</h2>

            <h3>₹${order.price}</h3>

            <p>Payment : ${order.payment}</p>

            <p>Date : ${order.date}</p>

            <select onchange="changeStatus(${index},this.value)">

                <option>Pending</option>

                <option>Shipped</option>

                <option>Delivered</option>

            </select>

        </div>
        `;
    });

}

function changeStatus(index,status){

    orders[index].status = status;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    alert("Status Updated");

}