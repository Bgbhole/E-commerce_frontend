if(localStorage.getItem("admin")!=="true"){
    window.location="admin-login.html";
}

let products = JSON.parse(localStorage.getItem("products")) || [];

let users = JSON.parse(localStorage.getItem("users")) || [];

let orders = JSON.parse(localStorage.getItem("orders")) || [];

document.getElementById("totalProducts").innerHTML = products.length;

document.getElementById("totalUsers").innerHTML = users.length;

document.getElementById("totalOrders").innerHTML = orders.length;

function logout(){

localStorage.removeItem("admin");

window.location="admin-login.html";

}