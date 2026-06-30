
const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProduct() {

    try {

        let response =
            await fetch(`${API_BASE_URL}/api/products/${id}`);

        let product = await response.json();

        document.getElementById("image").src =
            `${API_BASE_URL}/images/${product.image}`;

        document.getElementById("name").innerHTML =
            product.productName;

        document.getElementById("price").innerHTML =
            "₹" + product.finalPrice;

        document.getElementById("description").innerHTML =
            product.description;

        document.getElementById("brand").innerHTML =
            product.brand;

        document.getElementById("category").innerHTML =
            product.category;

        document.getElementById("color").innerHTML =
            product.color || "Not Available";

        document.getElementById("weight").innerHTML =
            product.weight || "Not Available";

        document.getElementById("material").innerHTML =
            product.material || "Not Available";

        document.getElementById("warranty").innerHTML =
            product.warranty || "Not Available";

        document.getElementById("stock").innerHTML =
            product.quantity;

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

            customerId:customer.customerId,

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

        window.location.href = "payment.html";

    }

    catch (error) {

        console.log(error);

        alert("Unable to proceed");

    }

}


