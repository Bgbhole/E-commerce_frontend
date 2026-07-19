document.addEventListener("DOMContentLoaded", loadCart);

const user = JSON.parse(localStorage.getItem("currentUser"));

async function loadCart() {

    if (!user) {

        alert("Please Login");

        window.location.href = "Login.html";

        return;

    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/user/${user.id}`
        );

        if (!response.ok) {

            throw new Error("Unable to load cart");

        }

        const cart = await response.json();

        const box = document.getElementById("cartItems");

        box.innerHTML = "";

        let total = 0;

        let totalItems = cart.length;

        let totalQuantity = 0;

        if (cart.length === 0) {

            box.innerHTML = `
                <h2 style="text-align:center;margin-top:50px;">
                    Your Cart is Empty
                </h2>
            `;

            document.getElementById("itemsCount").innerHTML = 0;

            document.getElementById("totalQuantity").innerHTML = 0;

            document.getElementById("total").innerHTML = 0;

            return;

        }

        cart.forEach(item => {

    const originalPrice =
        item.product.sellerPrice || item.product.sellingPrice;

    const finalPrice =
        item.product.finalSellingPrice || item.product.finalPrice;

    const price =
    item.product.finalSellingPrice || item.product.finalPrice;

const itemTotal = price * item.quantity;

    total += itemTotal;

    totalQuantity += item.quantity;

    box.innerHTML += `

    <div class="item">

        <img src="${API_BASE_URL}/api/products/image/${item.product.productId}" width="150">

        <div class="details">

            <h2>${item.product.productName}</h2>

            <p>${item.product.description || ""}</p>

            ${
                originalPrice > finalPrice
                ? `
                    <h3>
                        <span style="text-decoration:line-through;color:#888;">
                            ₹${originalPrice.toFixed(2)}
                        </span>

                        <span style="color:green;font-weight:bold;margin-left:10px;">
                            ₹${finalPrice.toFixed(2)}
                        </span>
                    </h3>
                  `
                : `
                    <h3>₹${finalPrice.toFixed(2)}</h3>
                  `
            }

            <div class="quantity-box">

                <button onclick="decreaseQuantity(${item.cartId}, ${item.quantity})">-</button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${item.cartId}, ${item.quantity})">+</button>

            </div>

            <h3>Total : ₹${itemTotal.toFixed(2)}</h3>

            <button class="remove-btn"
                onclick="removeItem(${item.cartId})">

                Remove

            </button>

        </div>

    </div>

    `;

});

        document.getElementById("itemsCount").innerHTML = totalItems;

        document.getElementById("totalQuantity").innerHTML = totalQuantity;

        document.getElementById("total").innerHTML = total;

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function increaseQuantity(cartId, quantity) {

    await updateQuantity(cartId, quantity + 1);

}

async function decreaseQuantity(cartId, quantity) {

    if (quantity <= 1) return;

    await updateQuantity(cartId, quantity - 1);

}

async function updateQuantity(cartId, quantity) {

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/cart/quantity/${cartId}?quantity=${quantity}`,

            {

                method: "PUT"

            }

        );

        if (!response.ok) {

            throw new Error("Unable to update quantity");

        }

        loadCart();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

async function removeItem(cartId) {

    if (!confirm("Remove this item from cart?")) {

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/cart/${cartId}`,

            {

                method: "DELETE"

            }

        );

        if (!response.ok) {

            throw new Error("Unable to remove item");

        }

        loadCart();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

function goCheckout() {

    // Clear Buy Now product
    localStorage.removeItem("buyNowProduct");

    window.location.href = "checkout.html";

}
