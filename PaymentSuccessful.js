window.location.href =
`PaymentSuccessful.html?deliveryId=${deliveryId}&billingId=${billingId}`;


window.onload = async function () {

    try {

        const user = JSON.parse(localStorage.getItem("currentUser"));

        if (!user) {
            window.location.href = "Login.html";
            return;
        }

        const params = new URLSearchParams(window.location.search);

        const deliveryAddressId = Number(params.get("deliveryId"));
        const billingAddressId = Number(params.get("billingId"));

        const request = {

            userId: user.id,
            deliveryAddressId: deliveryAddressId,
            billingAddressId: billingAddressId,
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

            const error = await response.text();

            throw new Error(error);

        }

        const order = await response.json();

        console.log(order);

        window.location.href =
            `OrderSuccess.html?orderId=${order.orderId}`;

    } catch (e) {

        console.log(e);

        alert(e.message);

    }

};