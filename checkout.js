let user = JSON.parse(localStorage.getItem("currentUser"));

window.onload = function () {

    loadAddresses();
    loadPrice();

};

// =====================
// Load Addresses
// =====================

async function loadAddresses() {

    try {

        let response = await fetch(`${API_BASE_URL}/api/address/${user.id}`);

        let addresses = await response.json();

        let deliveryHTML = "";
        let billingHTML = "";

        let savedDelivery = localStorage.getItem("deliveryAddressId");
        let savedBilling = localStorage.getItem("billingAddressId");

        addresses.forEach((address, index) => {

            let deliveryChecked =
                (savedDelivery && savedDelivery == address.addressId) ||
                (!savedDelivery && index === 0);

            let billingChecked =
                (savedBilling && savedBilling == address.addressId) ||
                (!savedBilling && index === 0);

            deliveryHTML += `
                <div class="address-card">

                    <input type="radio"
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

                    <input type="radio"
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

    } catch (error) {

        console.error(error);

    }

}

// =====================
// Load Cart Price
// =====================

async function loadPrice() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/user/${user.id}`
        );

        if (!response.ok) {
            throw new Error("Unable to load cart.");
        }

        const cart = await response.json();

        let productPrice = 0;
        let totalItems = 0;

        cart.forEach(item => {

            productPrice += item.product.finalPrice * item.quantity;
            totalItems += item.quantity;

        });

        let deliveryCharge = productPrice > 250 ? 0 : 40;

        let totalAmount = productPrice + deliveryCharge;

        document.getElementById("itemsCount").innerHTML = totalItems;

        document.getElementById("productPrice").innerHTML =
            productPrice.toFixed(2);

        document.getElementById("deliveryCharge").innerHTML =
            deliveryCharge === 0 ? "FREE" : "₹" + deliveryCharge;

        document.getElementById("totalAmount").innerHTML =
            totalAmount.toFixed(2);

        localStorage.setItem("orderAmount", totalAmount);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}


// =====================
// Proceed to Payment
// =====================

function goPayment() {

    let delivery = document.querySelector(
        'input[name="delivery"]:checked'
    );

    let billing = document.querySelector(
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

    localStorage.setItem("deliveryAddressId", delivery.value);

    localStorage.setItem("billingAddressId", billing.value);

    window.location.href = "Payments.html";

}