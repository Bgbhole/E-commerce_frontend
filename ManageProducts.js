let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {
    alert("Please login first");
    window.location.href = "loginpage.html";
}

console.log(seller);

let sellerId = seller.sellerId;

loadProducts();

async function loadProducts() {

    try {

        let response = await fetch(
            "http://localhost:8080/api/products/seller/" + sellerId
        );

        let products = await response.json();

        console.log(products);

        let data = "";

        products.forEach(product => {

         data += `
<div class="card">

    <h2>${product.productName}</h2>

    <label>Product Name</label>
    <input type="text"
    id="name${product.productId}"
    value="${product.productName}">

    <label>Brand</label>
    <input type="text"
    id="brand${product.productId}"
    value="${product.brand}">

    <label>Category</label>
    <input type="text"
    id="category${product.productId}"
    value="${product.category}">

    <label>Description</label>
    <textarea id="desc${product.productId}">
${product.description}
    </textarea>

    <label>Purchase Price</label>
    <input type="number"
    id="purchase${product.productId}"
    value="${product.purchasePrice}">

    <label>Selling Price</label>
    <input type="number"
    id="price${product.productId}"
    value="${product.sellingPrice}">

    <label>GST %</label>
    <input type="number"
    id="gst${product.productId}"
    value="${product.gstPercentage}">

    <label>Quantity</label>
    <input type="number"
    id="qty${product.productId}"
    value="${product.quantity}">

    <button class="update"
    onclick="updateProduct(${product.productId})">
    Update
    </button>

    <button class="delete"
    onclick="deleteProduct(${product.productId})">
    Delete
    </button>

</div>
`;
        });

        document.getElementById("productContainer").innerHTML = data;

    } catch (err) {

        console.log(err);

    }

}
async function updateProduct(id){

let product = {

productName: document.getElementById("name"+id).value,

brand: document.getElementById("brand"+id).value,

category: document.getElementById("category"+id).value,

description: document.getElementById("desc"+id).value,

purchasePrice: document.getElementById("purchase"+id).value,

sellingPrice: document.getElementById("price"+id).value,

gstPercentage: document.getElementById("gst"+id).value,

quantity: document.getElementById("qty"+id).value

};

await fetch(
"http://localhost:8080/api/products/update/"+id,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(product)
});

alert("Updated Successfully");

loadProducts();
}
async function deleteProduct(id){

await fetch(
"http://localhost:8080/api/products/delete/"+id,
{
method:"DELETE"
});

alert("Deleted Successfully");

loadProducts();

}