
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
<tr><td>Material</td><td>${product.material || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Dimensions</td><td>${product.dimensions || "-"}</td></tr>
<tr><td>Finish</td><td>${product.finish || "-"}</td></tr>
<tr><td>Assembly</td><td>${product.assembly || "-"}</td></tr>
<tr><td>Room Type</td><td>${product.roomType || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
`;
break;

        case "Books":

html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Category</td><td>${product.category || "-"}</td></tr>
<tr><td>Author</td><td>${product.author || "-"}</td></tr>
<tr><td>Publisher</td><td>${product.publisher || "-"}</td></tr>
<tr><td>Language</td><td>${product.language || "-"}</td></tr>
<tr><td>Edition</td><td>${product.edition || "-"}</td></tr>
<tr><td>Pages</td><td>${product.pages || "-"}</td></tr>
<tr><td>ISBN</td><td>${product.isbn || "-"}</td></tr>
`;

break;

case "Mobile":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Model</td><td>${product.model || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
<tr><td>RAM</td><td>${product.ram || "-"}</td></tr>
<tr><td>Storage</td><td>${product.storage || "-"}</td></tr>
<tr><td>Processor</td><td>${product.processor || "-"}</td></tr>
<tr><td>Battery</td><td>${product.battery || "-"}</td></tr>
<tr><td>Camera</td><td>${product.camera || "-"}</td></tr>
<tr><td>Display</td><td>${product.display || "-"}</td></tr>
<tr><td>Operating System</td><td>${product.operatingSystem || "-"}</td></tr>
<tr><td>Network</td><td>${product.network || "-"}</td></tr>
`;
break;

case "Electronics":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Model</td><td>${product.model || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
<tr><td>Voltage</td><td>${product.voltage || "-"}</td></tr>
<tr><td>Power</td><td>${product.power || "-"}</td></tr>
<tr><td>Connectivity</td><td>${product.connectivity || "-"}</td></tr>
`;
break;

case "Fashion":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Size</td><td>${product.size || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Material</td><td>${product.material || "-"}</td></tr>
<tr><td>Fabric</td><td>${product.fabric || "-"}</td></tr>
<tr><td>Gender</td><td>${product.gender || "-"}</td></tr>
<tr><td>Fit</td><td>${product.fit || "-"}</td></tr>
<tr><td>Pattern</td><td>${product.pattern || "-"}</td></tr>
<tr><td>Sleeve</td><td>${product.sleeve || "-"}</td></tr>
<tr><td>Wash Care</td><td>${product.washCare || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
`;
break;

case "Home & Kitchen":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Material</td><td>${product.material || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
<tr><td>Capacity</td><td>${product.capacity || "-"}</td></tr>
<tr><td>Usage</td><td>${product.usage || "-"}</td></tr>
<tr><td>Dishwasher Safe</td><td>${product.dishwasher || "-"}</td></tr>
<tr><td>Microwave Safe</td><td>${product.microwave || "-"}</td></tr>
`;
break;

case "Books":
html = `
<tr><td>Author</td><td>${product.author || "-"}</td></tr>
<tr><td>Publisher</td><td>${product.publisher || "-"}</td></tr>
<tr><td>Language</td><td>${product.language || "-"}</td></tr>
<tr><td>Pages</td><td>${product.pages || "-"}</td></tr>
<tr><td>ISBN</td><td>${product.isbn || "-"}</td></tr>
<tr><td>Edition</td><td>${product.edition || "-"}</td></tr>
<tr><td>Binding</td><td>${product.binding || "-"}</td></tr>
<tr><td>Publication Year</td><td>${product.publicationYear || "-"}</td></tr>
`;
break;

case "Grocery":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Manufacturer</td><td>${product.manufacturer || "-"}</td></tr>
<tr><td>Country</td><td>${product.country || "-"}</td></tr>
<tr><td>Expiry Date</td><td>${product.expiryDate || "-"}</td></tr>
<tr><td>Storage Instruction</td><td>${product.storageInstruction || "-"}</td></tr>
<tr><td>Vegetarian</td><td>${product.veg || "-"}</td></tr>
<tr><td>Organic</td><td>${product.organic || "-"}</td></tr>
`;
break;

case "Beauty":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Skin Type</td><td>${product.skinType || "-"}</td></tr>
<tr><td>Hair Type</td><td>${product.hairType || "-"}</td></tr>
<tr><td>Ingredients</td><td>${product.ingredients || "-"}</td></tr>
<tr><td>Benefits</td><td>${product.benefits || "-"}</td></tr>
<tr><td>Net Quantity</td><td>${product.netQuantity || "-"}</td></tr>
<tr><td>Expiry Date</td><td>${product.expiryDate || "-"}</td></tr>
<tr><td>Country</td><td>${product.country || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
`;
break;

case "Sports":
html = `
<tr><td>Brand</td><td>${product.brand || "-"}</td></tr>
<tr><td>Sport Type</td><td>${product.sportType || "-"}</td></tr>
<tr><td>Material</td><td>${product.material || "-"}</td></tr>
<tr><td>Weight</td><td>${product.weight || "-"}</td></tr>
<tr><td>Color</td><td>${product.color || "-"}</td></tr>
<tr><td>Age Group</td><td>${product.ageGroup || "-"}</td></tr>
<tr><td>Warranty</td><td>${product.warranty || "-"}</td></tr>
`;
break;   

case "Toys":
html = `
<tr><td>Material</td><td>${product.material || "-"}</td></tr>
<tr><td>Toy Age</td><td>${product.toyAge || "-"}</td></tr>
<tr><td>Battery Required</td><td>${product.batteryRequired || "-"}</td></tr>
<tr><td>Educational</td><td>${product.educational || "-"}</td></tr>
<tr><td>Safety</td><td>${product.safety || "-"}</td></tr>
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

