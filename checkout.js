let user = JSON.parse(localStorage.getItem("currentUser"));

window.onload=function(){

    loadAddresses();
    loadPrice();

}

async function loadAddresses() {

    let response = await fetch(`${API_BASE_URL}/api/address/${user.id}`);
    let addresses = await response.json();

    let deliveryHTML = "";
    let billingHTML = "";

    let savedDelivery = localStorage.getItem("deliveryAddressId");
    let savedBilling = localStorage.getItem("billingAddressId");

    addresses.forEach((address, index) => {

        // Select previously selected address or first address by default
        let deliveryChecked =
            (savedDelivery && savedDelivery == address.addressId) ||
            (!savedDelivery && index == 0);

        let billingChecked =
            (savedBilling && savedBilling == address.addressId) ||
            (!savedBilling && index == 0);

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
}



function loadPrice() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let productPrice = 0;

    cart.forEach(item => {

        if (item != null) {

            productPrice += Number(item.finalPrice || 0);

        }

    });

    let deliveryCharge = 0;

    // Free delivery for orders above ₹250
    if (productPrice <= 250) {

        deliveryCharge = 40;

    }

    let totalAmount = productPrice + deliveryCharge;

    document.getElementById("itemsCount").innerHTML = cart.length;

    document.getElementById("productPrice").innerHTML =
        productPrice.toFixed(2);

    document.getElementById("deliveryCharge").innerHTML =
        deliveryCharge == 0 ? "FREE" : "₹" + deliveryCharge;

    document.getElementById("totalAmount").innerHTML =
        totalAmount.toFixed(2);

    // Save for payment page
    localStorage.setItem("orderAmount", totalAmount);

}
    
function goPayment() {

    let delivery = document.querySelector(
        'input[name="delivery"]:checked');

    let billing = document.querySelector(
        'input[name="billing"]:checked');

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