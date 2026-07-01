let user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    alert("Please login first");
    window.location.href = "loginpage.html";
}

window.onload = loadWishlist;


// =========================
// Load Wishlist
// =========================
async function loadWishlist() {

    try {

        let response = await fetch(
            `${API_BASE_URL}/api/wishlist/user/${user.id}`
        );

        if (!response.ok) {
            throw new Error("Unable to load wishlist");
        }

        let wishlist = await response.json();

        let html = "";

        wishlist.forEach(item => {

            let product = item.product;

            html += `

            <div class="card">

                <img src="${API_BASE_URL}/uploads/${product.image}" width="150">

                <h3>${product.productName}</h3>

                <h2>₹${product.finalPrice}</h2>

                <button onclick="removeWishlist(${item.wishlistId})">
                    Remove
                </button>

                <button onclick="addToCart(${product.productId})">
                    Add To Cart
                </button>

            </div>

            `;

        });

        document.getElementById("wishlistProducts").innerHTML = html;

    }
    catch(error){

        console.log(error);

    }

}


// =========================
// Remove Wishlist
// =========================
async function removeWishlist(wishlistId){

    if(!confirm("Remove from Wishlist?")){
        return;
    }

    try{

        let response = await fetch(

            `${API_BASE_URL}/api/wishlist/${wishlistId}`,

            {
                method:"DELETE"
            }

        );

        if(response.ok){

            alert("Removed Successfully");

            loadWishlist();

        }
        else{

            alert("Unable to remove");

        }

    }
    catch(error){

        console.log(error);

    }

}
