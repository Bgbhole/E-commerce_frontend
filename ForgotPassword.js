const role =
new URLSearchParams(window.location.search)
.get("role");

document.getElementById("accountType").innerText =
role === "seller"
?
"Seller Account"
:
"Customer Account";

async function sendOTP() {

    const email = document.getElementById("email").value.trim();

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    let url = "";

    if (role === "seller") {
        url = `${API_BASE_URL}/api/sellers/forgot-password?email=${encodeURIComponent(email)}`;
    } else {
        url = `${API_BASE_URL}/api/users/forgot-password?email=${encodeURIComponent(email)}`;
    }

    console.log("Request URL:", url);

    try {

        const response = await fetch(url, {
    method: "POST"
});

console.log("Status:", response.status);

const message = await response.text();

console.log("Message:", message);

if (!response.ok) {
    alert(message);
    return;
}

alert(message);
document.getElementById("otpSection").style.display = "block";

    } catch (error) {

        console.error("Fetch Error:", error);

        alert("Unable to send OTP.");
    }
}

async function resetPassword() {

    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (otp === "" || newPassword === "" || confirmPassword === "") {
        alert("Please fill all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let verifyUrl = "";
    let resetUrl = "";

    if (role === "seller") {

        verifyUrl = `${API_BASE_URL}/api/sellers/verify-forgot-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

        resetUrl = `${API_BASE_URL}/api/sellers/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`;

    } else {

        verifyUrl = `${API_BASE_URL}/api/users/verify-forgot-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

        resetUrl = `${API_BASE_URL}/api/users/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`;

    }

    try {

        // Verify OTP
        const verifyResponse = await fetch(verifyUrl, {
            method: "POST"
        });

        const otpValid = await verifyResponse.json();

        if (!otpValid) {
            alert("Invalid or Expired OTP.");
            return;
        }

        // Reset Password
        const resetResponse = await fetch(resetUrl, {
            method: "POST"
        });

        const message = await resetResponse.text();

        alert(message);

        if (resetResponse.ok) {

            alert("Password Reset Successfully!");

            window.location.href = "loginpage.html";

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

}