async function addProduct(){

    let product = {

        productName: document.getElementById("productName").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        imageUrl: document.getElementById("imageUrl").value

    };

    let response = await fetch(`${API_BASE_URL}/api/products/add`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(product)

    });

    if(response.ok){

        alert("Product Added Successfully");

    }
}