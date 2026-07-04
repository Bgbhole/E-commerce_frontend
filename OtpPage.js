async function verifyOtp() {

    const otp = document.getElementById("otp").value.trim();

    if (otp !== "123456") {

        alert("Wrong OTP");
        window.location.href = "PaymentFailed.html";
        return;

    }

    const order = JSON.parse(localStorage.getItem("orderRequest"));

    console.log("Order Request =", order);

    if (!order) {

        alert("Order data not found");
        return;

    }

    try {

        const response = await fetch(`${API_BASE_URL}/api/orders/place`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(order)

        });

        if (!response.ok) {

            const error = await response.text();

            console.log(error);

            alert("Order could not be placed");

            return;

        }

        localStorage.removeItem("orderRequest");

        alert("OTP Verified");

        window.location.href = "PaymentSuccessful.html";

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}