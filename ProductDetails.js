
const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProduct() {

    try {

        let response = await fetch(`${API_BASE_URL}/api/products/${id}`);

        let product = await response.json();

        console.log(product);
        console.log(product.productId);
        console.log(`${API_BASE_URL}/api/products/image/${product.productId}`);

        // Show image
        document.getElementById("productImage").src =
`${API_BASE_URL}/api/products/image/${product.productId}`;

        // Show product info
        document.getElementById("name").innerHTML = product.productName;
        document.getElementById("price").innerHTML = "₹" + product.finalPrice;
        document.getElementById("description").innerHTML = product.description;

        // Show specifications
        loadSpecifications(product);

    } catch (error) {

        console.log(error);

    }

}

loadProduct();


function addToCart(){

    let customer =
        JSON.parse(localStorage.getItem("currentUser"));

    if(!customer){
        alert("Please Login First");

        window.location.href = "loginpage.html";

        return;   
    }

    fetch(`${API_BASE_URL}/api/cart/add`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            customerId:user.id,

            productId:id,

            quantity:1

        })

    })

    .then(response=>response.text())

    .then(data=>{

        alert("Product Added To Cart");

    });

}




async function buyNow() {

    let customer =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!customer) {

        alert("Please Login First");

        window.location.href = "loginpage.html";

        return;
    }

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/products/${id}`);

        let product = await response.json();

        localStorage.setItem(
            "buyNowProduct",
            JSON.stringify(product)
        );

        window.location.href = "checkout.html";

    }

    catch (error) {

        console.log(error);

        alert("Unable to proceed");

    }

}

function loadSpecifications(product) {

    let html = "";

    switch (product.category) {

        case "Mobile":

            html = `
            <tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
            <tr><td>Category</td><td>${product.category}</td></tr>
            <tr><td>Model</td><td>${product.model || "-"}</td></tr>
            <tr><td>Color</td><td>${product.color || "-"}</td></tr>
            <tr><td>RAM</td><td>${product.ram || "-"}</td></tr>
            <tr><td>Storage</td><td>${product.storage || "-"}</td></tr>
            <tr><td>Processor</td><td>${product.processor || "-"}</td></tr>
            <tr><td>Battery</td><td>${product.battery || "-"}</td></tr>
            <tr><td>Camera</td><td>${product.camera || "-"}</td></tr>
            <tr><td>Display</td><td>${product.display || "-"}</td></tr>
            <tr><td>Operating System</td><td>${product.operatingSystem || "-"}</td></tr>
            <tr><td>Network</td><td>${product.network || "-"}</td></tr>
            <tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
            <tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
            `;
        break;

        case "Furniture":

            html = `
            <tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
            <tr><td>Category</td><td>${product.category}</td></tr>
            <tr><td>Material</td><td>${product.material || "-"}</td></tr>
            <tr><td>Dimensions</td><td>${product.dimensions || "-"}</td></tr>
            <tr><td>Color</td><td>${product.color || "-"}</td></tr>
            <tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
            <tr><td>Finish</td><td>${product.finish || "-"}</td></tr>
            <tr><td>Assembly</td><td>${product.assembly || "-"}</td></tr>
            <tr><td>Room Type</td><td>${product.roomType || "-"}</td></tr>
            <tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
            `;
        break;

        // Add Electronics, Fashion, Books,
        // Grocery, Beauty, Sports,
        // Toys, Home & Kitchen here...

        default:

            html = `
            <tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
            <tr><td>Category</td><td>${product.category || "-"}</td></tr>
            `;
    }

    document.getElementById("specificationTable").innerHTML = html;
}

