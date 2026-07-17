
const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProduct() {

    try {

        let response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        let product = await response.json();

        images = [
            `${API_BASE_URL}/api/products/image/${product.productId}`,
            `${API_BASE_URL}/api/products/image2/${product.productId}`,
            `${API_BASE_URL}/api/products/image3/${product.productId}`,
            `${API_BASE_URL}/api/products/image4/${product.productId}`
        ];

        current = 0;

        document.getElementById("productImage").src = images[current];

        // Product Info
        document.getElementById("name").innerHTML = product.productName;
        document.getElementById("price").innerHTML = "₹" + product.finalPrice;
        document.getElementById("description").innerHTML = product.description;

        loadSpecifications(product);

    } catch (error) {
        console.log(error);
    }
}

loadProduct();
loadRelatedProducts();

loadReviews();

const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    document.getElementById("reviewForm").innerHTML = `
        <h3>Write a Review</h3>
        <p>Please <a href="loginpage.html">login</a> to write a review.</p>
    `;
}

document.getElementById("nextBtn").onclick = function () {

    current++;

    if (current >= images.length) {
        current = 0;
    }

    document.getElementById("productImage").src = images[current];
};



document.getElementById("prevBtn").onclick = function () {

    current--;

    if (current < 0) {
        current = images.length - 1;
    }

    document.getElementById("productImage").src = images[current];
};


async function loadReviews() {

    const response = await fetch(
        `${API_BASE_URL}/api/reviews/product/${id}`
    );

    const reviews = await response.json();
    reviews.sort(
(a,b)=>
new Date(b.reviewDate)-new Date(a.reviewDate)
);

    let html = "";

    let total = 0;

    reviews.forEach(r => {

        total += r.rating;

        html += `
            <div class="review-card">

              <div class="review-header">

    <span class="green-rating">
      ${"★".repeat(r.rating)}
${"☆".repeat(5-r.rating)}
    </span>

    <strong>${r.user.firstName} ${r.user.lastName}</strong>

</div>

<p>${r.review}</p>

<small>
${new Date(r.reviewDate).toLocaleDateString()}
</small>

            </div>
        `;
    });

    let average = 0;

if (reviews.length > 0) {
    average = (total / reviews.length).toFixed(1);
}

const rounded = Math.round(average);

const stars = "★".repeat(rounded) + "☆".repeat(5 - rounded);

document.getElementById("reviewList").innerHTML = html;

document.getElementById("averageRating").innerHTML = `
<div class="rating-summary">
    <span class="green-rating">${average} ★</span>
    <span>${reviews.length} Ratings & Reviews</span>
</div>
`;

document.getElementById("productRating").innerHTML = `
<span class="green-rating">${average} ★</span>
<span>${reviews.length} Ratings</span>
`;
}

function addToCart(){
   
    let customer =
        JSON.parse(localStorage.getItem("currentUser"));

    if(!customer){
        alert("Please Login First");

        window.location.href = "loginpage.html";

        return;   
    }

   fetch(`${API_BASE_URL}/api/cart/add`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

    userId: customer.id,
    productId: Number(id),
    quantity: 1

})

})
.then(async response => {

    const message = await response.text();

    if (!response.ok) {
        throw new Error(message);
    }

    alert("Product Added To Cart");

})
.catch(error => {

    console.error(error);

    alert(error.message);

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

async function submitReview() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first");
        return;
    }

    const review = {
        userId: user.id,
        productId: Number(id),
        rating: Number(document.getElementById("rating").value),
        review: document.getElementById("reviewText").value
    };

    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    });

    if (response.ok) {
       document.getElementById("reviewText").value="";

document.getElementById("rating").value=5;

stars.forEach(s=>s.classList.remove("active"));

for(let i=0;i<5;i++){

stars[i].classList.add("active");

}

loadReviews();

alert("Thank you for your review.");
        document.getElementById("reviewText").value = "";
        loadReviews();
    } else {
        alert("Unable to submit review");
    }
}

const stars = document.querySelectorAll(".star");

stars.forEach(star => {

    star.addEventListener("click", function () {

        const value = Number(this.dataset.value);

        document.getElementById("rating").value = value;

        stars.forEach(s => s.classList.remove("active"));

        for (let i = 0; i < value; i++) {
            stars[i].classList.add("active");
        }

    });

});

function viewAllReviews() {

    window.location.href =
        `AllReviews.html?productId=${id}`;

}

async function loadRelatedProducts() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/products/${id}/related`
        );

        const products = await response.json();

        const relatedProducts = document.getElementById("relatedProducts");

        relatedProducts.innerHTML = "";

        products.forEach(product => {

            relatedProducts.innerHTML += `

<div class="related-card"
onclick="window.location='ProductDetails.html?id=${product.productId}'">

    <img src="${API_BASE_URL}/api/products/image/${product.productId}" alt="${product.productName}">

    <div class="related-info">

        <h3>${product.productName}</h3>

        <p class="related-price">
            ₹${product.finalPrice}
        </p>

        <div class="related-rating">
            ★ ${(product.averageRating ?? 0).toFixed(1)}
        </div>

    </div>

</div>

`;

        });

    } catch (error) {

        console.error("Related Products Error:", error);

    }

}