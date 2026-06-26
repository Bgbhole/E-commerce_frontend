let cart = JSON.parse(localStorage.getItem("cart")) || [];

loadCart();

function loadCart() {

    let box = document.getElementById("cartItems");

    let total = 0;

    box.innerHTML = "";

    cart.forEach((p, index) => {

        if (p == null) return;

        total += p.finalPrice;

        box.innerHTML += `

        <div class="item">

            <img src="${API_BASE_URL}/images/${p.image}">

            <div class="details">

                <h2>${p.productName}</h2>

                <p>${p.description || ""}</p>

                <h3 class="price">
                    ₹${p.finalPrice}
                </h3>

                <button class="remove-btn"
                        onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        </div>

        `;
    });

    document.getElementById("total").innerHTML = total;
}

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
}

function goCheckout() {

    window.location.href = "checkout.html";

}