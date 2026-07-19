let user = JSON.parse(localStorage.getItem("currentUser"));

window.onload = function () {

    if (!user) {
        alert("Please login first.");
        window.location.href = "Login.html";
        return;
    }

    loadAddresses();
    loadPrice();
};

// =====================
// Load Addresses
// =====================

async function loadAddresses() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/address/${user.id}`);

        if (!response.ok) {
            throw new Error("Unable to load addresses");
        }

        const addresses = await response.json();

        let deliveryHTML = "";
        let billingHTML = "";

        let savedDelivery = localStorage.getItem("deliveryAddressId");
        let savedBilling = localStorage.getItem("billingAddressId");

        addresses.forEach((address, index) => {

            const deliveryChecked =
                (savedDelivery == address.addressId) ||
                (!savedDelivery && index === 0);

            const billingChecked =
                (savedBilling == address.addressId) ||
                (!savedBilling && index === 0);

            deliveryHTML += `
                <div class="address-card">

                    <input
                        type="radio"
                        name="delivery"
                        value="${address.addressId}"
                        ${deliveryChecked ? "checked" : ""}>

                    <h4>${address.fullName}</h4>

                    <p>${address.fullAddress}</p>

                    <p>${address.city}, ${address.state} - ${address.pincode}</p>

                    <p>Mobile : ${address.mobile}</p>

                </div>
            `;

            billingHTML += `
                <div class="address-card">

                    <input
                        type="radio"
                        name="billing"
                        value="${address.addressId}"
                        ${billingChecked ? "checked" : ""}>

                    <h4>${address.fullName}</h4>

                    <p>${address.fullAddress}</p>

                    <p>${address.city}, ${address.state} - ${address.pincode}</p>

                    <p>Mobile : ${address.mobile}</p>

                </div>
            `;

        });

        document.getElementById("deliveryAddressList").innerHTML = deliveryHTML;
        document.getElementById("billingAddressList").innerHTML = billingHTML;

    }
    catch (error) {

        console.error(error);

    }

}

// =====================
// Load Price
// =====================

async function loadPrice() {

    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

    // =========================
    // BUY NOW
    // =========================

    if (buyNowProduct != null) {

        const price =
            Number(
                buyNowProduct.finalSellingPrice ??
                buyNowProduct.finalPrice ??
                buyNowProduct.sellingPrice ??
                0
            );

        const totalItems = 1;

        const deliveryCharge = price >= 250 ? 0 : 40;

        const totalAmount = price + deliveryCharge;

        document.getElementById("itemsCount").innerHTML = totalItems;
        document.getElementById("productPrice").innerHTML = price.toFixed(2);
        document.getElementById("deliveryCharge").innerHTML =
            deliveryCharge === 0 ? "FREE" : "₹" + deliveryCharge;
        document.getElementById("totalAmount").innerHTML =
            totalAmount.toFixed(2);

        localStorage.setItem("orderAmount", totalAmount);

        return;

    }

    // =========================
    // CART
    // =========================

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/user/${user.id}`
        );

        if (!response.ok) {

            throw new Error("Unable to load cart.");

        }

        const cart = await response.json();

        let totalItems = 0;
        let productPrice = 0;

        cart.forEach(item => {

            const quantity = Number(item.quantity || 0);

            const price = Number(
                item.product?.finalSellingPrice ??
                item.product?.finalPrice ??
                item.product?.sellingPrice ??
                0
            );

            totalItems += quantity;

            productPrice += price * quantity;

        });

        const deliveryCharge =
            productPrice >= 250 ? 0 : 40;

        const totalAmount =
            productPrice + deliveryCharge;

        document.getElementById("itemsCount").innerHTML =
            totalItems;

        document.getElementById("productPrice").innerHTML =
            productPrice.toFixed(2);

        document.getElementById("deliveryCharge").innerHTML =
            deliveryCharge === 0 ? "FREE" : "₹" + deliveryCharge;

        document.getElementById("totalAmount").innerHTML =
            totalAmount.toFixed(2);

        localStorage.setItem("orderAmount", totalAmount);

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================
// Payment
// =====================

function goPayment() {

    const delivery = document.querySelector(
        'input[name="delivery"]:checked'
    );

    const billing = document.querySelector(
        'input[name="billing"]:checked'
    );

    if (!delivery) {

        alert("Please select delivery address");

        return;

    }

    if (!billing) {

        alert("Please select billing address");

        return;

    }

    localStorage.setItem(
        "deliveryAddressId",
        delivery.value
    );

    localStorage.setItem(
        "billingAddressId",
        billing.value
    );

    window.location.href = "Payments.html";

}