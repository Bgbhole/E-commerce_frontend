let seller =
JSON.parse(localStorage.getItem("currentSeller"));

async function sendOTP() {

let response = await fetch(`${API_BASE_URL}/api/sellers/send-edit-otp/${seller.sellerId}`,
    {
        method: "POST"
    }
);

let message = await response.text();

alert(message);


}

async function changePassword() {


let otp =
    document.getElementById("otp").value;

let newPassword =
    document.getElementById("newPassword").value;

let confirmPassword =
    document.getElementById("confirmPassword").value;

if (newPassword !== confirmPassword) {

    alert("Passwords do not match");
    return;
}

let response = await fetch(
    `${API_BASE_URL}/api/sellers/change-password`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sellerId: seller.sellerId,
            otp: otp,
            newPassword: newPassword
        })
    }
);

let result = await response.text();

alert(result);

if (result === "Password Changed Successfully") {

    localStorage.removeItem("currentSeller");

    window.location.href = "loginpage.html";
}


}
