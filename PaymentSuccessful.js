window.onload = async function () {

    try {

        const user = JSON.parse(localStorage.getItem("currentUser"));

        if (!user) {
            alert("Please login first.");
            window.location.href = "Login.html";
            return;
        }

        const deliveryAddressId = localStorage.getItem("deliveryAddressId");
        const billingAddressId = localStorage.getItem("billingAddressId");

        if (!deliveryAddressId || !billingAddressId) {
            alert("Please select delivery and billing address.");
            window.location.href = "Checkout.html";
            return;
        }

        const request = {

            userId: user.id,
            deliveryAddressId: Number(deliveryAddressId),
            billingAddressId: Number(billingAddressId),
            paymentMethod: "ONLINE"

        };

        const response = await fetch(`${API_BASE_URL}/api/orders/place`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(request)

        });

        if (!response.ok) {
            throw new Error("Unable to place order.");
        }

        const order = await response.json();

        console.log("Order Created :", order);

        // Clear cart after successful order creation
        localStorage.removeItem("cart");

        // Remove selected addresses
        localStorage.removeItem("deliveryAddressId");
        localStorage.removeItem("billingAddressId");
        localStorage.removeItem("orderAmount");

        // Save latest order if required
        localStorage.setItem("latestOrder", JSON.stringify(order));

    } catch (error) {

        console.error(error);

        alert("Order placement failed.");

    }

};