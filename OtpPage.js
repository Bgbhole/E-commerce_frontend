function verifyOtp() {

    let otp = document.getElementById("otp").value.trim();

    console.log("OTP =", otp);

    if (otp === "123456") {

        alert("OTP Verified");

        window.location.href = "PaymentSuccessful.html";

    }
    else {

        alert("Wrong OTP");

        window.location.href = "PaymentFailed.html";

    }

}