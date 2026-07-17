const API = API_BASE_URL;

const params = new URLSearchParams(window.location.search);

const productId = params.get("productId");

let allReviews = [];

let currentFilter = 0;

//===========================

window.onload = function(){

    loadProduct();

    loadReviews();

}

//===========================

async function loadProduct(){

    try{

        const response = await fetch(
            `${API}/api/products/${productId}`
        );

        const product = await response.json();

        document.getElementById("productName").innerHTML =
            product.productName;

        document.getElementById("productPrice").innerHTML =
            "₹" + product.finalPrice;

        document.getElementById("productImage").src =
            `${API}/api/products/image/${product.productId}`;

        document.getElementById("avgRating").innerHTML =
            `${product.averageRating ?? 0} ★`;

        document.getElementById("reviewCount").innerHTML =
            `${product.totalReviews ?? 0} Ratings & Reviews`;

    }

    catch(error){

        console.log(error);

    }

}

//===========================

async function loadReviews(){

    try{

        const response = await fetch(
            `${API}/api/reviews/product/${productId}`
        );

        allReviews = await response.json();

        allReviews.sort((a,b)=>

            new Date(b.reviewDate)-new Date(a.reviewDate)

        );

        calculateRating();

        displayReviews(allReviews);

    }

    catch(error){

        console.log(error);

    }

}

//===========================

function calculateRating(){

    let five=0;
    let four=0;
    let three=0;
    let two=0;
    let one=0;

    allReviews.forEach(r=>{

        switch(r.rating){

            case 5:

                five++;

                break;

            case 4:

                four++;

                break;

            case 3:

                three++;

                break;

            case 2:

                two++;

                break;

            case 1:

                one++;

                break;

        }

    });

    document.getElementById("fiveCount").innerHTML=five;
    document.getElementById("fourCount").innerHTML=four;
    document.getElementById("threeCount").innerHTML=three;
    document.getElementById("twoCount").innerHTML=two;
    document.getElementById("oneCount").innerHTML=one;

    let total=allReviews.length;

    if(total==0)return;

    document.getElementById("fiveBar").style.width=(five/total)*100+"%";

    document.getElementById("fourBar").style.width=(four/total)*100+"%";

    document.getElementById("threeBar").style.width=(three/total)*100+"%";

    document.getElementById("twoBar").style.width=(two/total)*100+"%";

    document.getElementById("oneBar").style.width=(one/total)*100+"%";

}

//===========================

function displayReviews(reviews){

    const container=document.getElementById("reviewContainer");

    container.innerHTML="";

    if(reviews.length==0){

        document.getElementById("noReview").style.display="block";

        return;

    }

    document.getElementById("noReview").style.display="none";

    reviews.forEach(review=>{

        container.innerHTML +=`

<div class="review-card">

<div class="review-top">

<span class="review-rating">

${review.rating} ★

</span>

<span class="review-user">

${review.user.firstName}

</span>

<span class="review-date">

${formatDate(review.reviewDate)}

</span>

</div>

<div class="review-text">

${review.review}

</div>

<div class="verified">

✔ Verified Purchase

</div>

<div class="helpful">

<button>

👍 Helpful

</button>

<button>

👎 Not Helpful

</button>

</div>

</div>

`;

    });

}

//===========================

function formatDate(date){

    let d=new Date(date);

    return d.toLocaleDateString("en-IN",{

        day:"numeric",

        month:"short",

        year:"numeric"

    });

}

//===========================
// Search Reviews
//===========================

document.getElementById("searchReview").addEventListener("keyup", function () {

    const text = this.value.toLowerCase();

    const filtered = allReviews.filter(review => {

        return (
            review.review.toLowerCase().includes(text) ||
            review.user.firstName.toLowerCase().includes(text)
        );

    });

    displayReviews(filtered);

});

//===========================
// Sort Reviews
//===========================

document.getElementById("sortReview").addEventListener("change", function () {

    let reviews = [...allReviews];

    switch (this.value) {

        case "highest":

            reviews.sort((a, b) => b.rating - a.rating);

            break;

        case "lowest":

            reviews.sort((a, b) => a.rating - b.rating);

            break;

        case "oldest":

            reviews.sort((a, b) =>
                new Date(a.reviewDate) - new Date(b.reviewDate));

            break;

        default:

            reviews.sort((a, b) =>
                new Date(b.reviewDate) - new Date(a.reviewDate));

    }

    if (currentFilter > 0) {

        reviews = reviews.filter(r => r.rating == currentFilter);

    }

    displayReviews(reviews);

});

//===========================
// Filter by Rating
//===========================

function filterRating(rating) {

    currentFilter = rating;

    if (rating == 0) {

        displayReviews(allReviews);

        return;

    }

    const filtered = allReviews.filter(review =>
        review.rating == rating
    );

    displayReviews(filtered);

}

//===========================
// Refresh Reviews
//===========================

async function refreshReviews() {

    await loadReviews();

}

//===========================
// Scroll to Top
//===========================

window.addEventListener("scroll", function () {

    if (window.scrollY > 500) {

        if (!document.getElementById("topBtn")) {

            const btn = document.createElement("button");

            btn.id = "topBtn";

            btn.innerHTML = "⬆";

            btn.style.position = "fixed";
            btn.style.bottom = "30px";
            btn.style.right = "30px";
            btn.style.width = "50px";
            btn.style.height = "50px";
            btn.style.border = "none";
            btn.style.borderRadius = "50%";
            btn.style.background = "#2874f0";
            btn.style.color = "#fff";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "22px";
            btn.style.boxShadow = "0 0 10px rgba(0,0,0,.3)";

            btn.onclick = () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            };

            document.body.appendChild(btn);

        }

    } else {

        const btn = document.getElementById("topBtn");

        if (btn) {

            btn.remove();

        }

    }

});