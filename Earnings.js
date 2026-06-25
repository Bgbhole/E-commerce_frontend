let seller =
JSON.parse(localStorage.getItem("currentUser"));

window.onload = loadEarnings;

async function loadEarnings(){

    let response =
    await fetch(`http://localhost:8080/api/orders/seller/${seller.sellerId}`);

    let orders = await response.json();

    let total = 0;

    orders.forEach(order=>{

        if(order.status=="DELIVERED"){
            total += order.totalAmount;
        }

    });

    document.getElementById("today").innerHTML =
        "₹" + total;

    document.getElementById("monthly").innerHTML =
        "₹" + total;

    document.getElementById("total").innerHTML =
        "₹" + total;

    document.getElementById("profit").innerHTML =
        "₹" + (total * 0.20);

}