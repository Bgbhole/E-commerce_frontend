if(localStorage.getItem("admin")!=="true"){
    window.location="admin-login.html";
}

let products = JSON.parse(GET /api/products/all) || [];

let users = JSON.parse(GET /api/users) || [];

let orders = JSON.parse(GET /api/orders) || [];

document.getElementById("totalProducts").innerHTML = products.length;

document.getElementById("totalUsers").innerHTML = users.length;

document.getElementById("totalOrders").innerHTML = orders.length;

function logout(){

localStorage.removeItem("admin");

window.location="admin-login.html";

}