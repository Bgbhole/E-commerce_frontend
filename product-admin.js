
const currentAdmin =
JSON.parse(localStorage.getItem("currentAdmin"));

if (!currentAdmin) {

    window.location.href = "AdminLogin.html";

}

let products = JSON.parse(localStorage.getItem("products")) || [];

let editIndex = -1;

displayProducts();

function addProduct(){

    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;
    let image = document.getElementById("image").value;

    if(name=="" || price=="" || category=="" || image==""){
        alert("Fill all fields");
        return;
    }

    let product = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image
    };

    if(editIndex==-1){

        products.push(product);

    }else{

        products[editIndex]=product;

        editIndex=-1;
    }

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    clearForm();

    displayProducts();
}

function displayProducts(){

    let box=document.getElementById("products");

    box.innerHTML="";

    products.forEach((product,index)=>{

        box.innerHTML+=`
        <div class="card">

        <img src="${product.image}">

        <h2>${product.name}</h2>

        <h3>₹${product.price}</h3>

        <p>${product.category}</p>

        <button onclick="editProduct(${index})">
        Edit
        </button>

        <button class="delete"
        onclick="deleteProduct(${index})">
        Delete
        </button>

        </div>
        `;
    });

}

function editProduct(index){

    editIndex=index;

    document.getElementById("name").value=
    products[index].name;

    document.getElementById("price").value=
    products[index].price;

    document.getElementById("category").value=
    products[index].category;

    document.getElementById("image").value=
    products[index].image;

}

function deleteProduct(index){

    products.splice(index,1);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    displayProducts();

}

function clearForm(){

    document.getElementById("name").value="";
    document.getElementById("price").value="";
    document.getElementById("category").value="";
    document.getElementById("image").value="";
}