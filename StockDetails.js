let seller =
JSON.parse(localStorage.getItem("currentUser"));

window.onload = loadProducts;

async function loadProducts(){

    let response =
    await fetch(`http://localhost:8080/api/products/seller/${seller.sellerId}`);

    let products = await response.json();

    let html = "";

    products.forEach(product=>{

        html += `
        <tr>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.quantity}</td>
        </tr>
        `;

    });

    document.getElementById("tbody").innerHTML = html;

}