let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

let html = "";

wishlist.forEach(product=>{

html += `

<div class="card">

<img src="http://localhost:8080/images/${product.image}" width="150">

<h3>${product.name}</h3>

<h2>₹${product.price}</h2>

<button onclick="removeWishlist(${product.id})">
Remove
</button>

<button onclick="addToCart(${product.id})">
Add To Cart
</button>

</div>

`;

});

document.getElementById("wishlistProducts").innerHTML = html;

function removeWishlist(id){

wishlist = wishlist.filter(
p=>p.id != id
);

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

location.reload();

}