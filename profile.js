let user = JSON.parse(localStorage.getItem("currentUser"));
let isVerified = false;

if (user) {
   document.getElementById("username").innerHTML =
    user.firstName;

document.getElementById("firstName").value =
    user.firstName || "";

document.getElementById("lastName").value =
    user.lastName || "";

document.getElementById("email").value =
    user.email || "";

document.getElementById("mobile").value =
    user.mobile || "";

document.getElementById("address").value =
    user.address || "";
}

// Disable fields initially
document.querySelectorAll("input,textarea").forEach(x => {
    if (x.id !== "emailOtp") {
        x.disabled = true;
    }
});

// Edit Profile
function enableEdit() {

    document.getElementById("otpDiv").style.display = "block";

    sendEmailOtp();
}

// Send OTP
async function sendEmailOtp() {

    try {

        let response = await fetch("http://localhost:8080/api/users/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                email: user.email
            })
        });

        if (response.ok) {
            alert("OTP sent successfully");
        } else {
            alert("Failed to send OTP");
        }

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}


// Verify OTP
async function verifyEmailOtp() {

    let otp = document.getElementById("emailOtp").value;

    try {

        let response = await fetch("http://localhost:8080/api/users/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                otp: otp
            })
        });

        if (response.ok) {

            isVerified = true;

            alert("OTP Verified Successfully");

            document.querySelectorAll("input,textarea")
                .forEach(x => x.disabled = false);

            document.getElementById("editBtn").style.display = "none";
            document.getElementById("updateBtn").style.display = "inline-block";

            document.getElementById("otpDiv").style.display = "none";

        } else {

            alert("Invalid OTP");

        }

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}


// Update Profile
async function updateProfile() {

    if (!isVerified) {

        alert("Please verify OTP first");
        return;

    }

    let data = {

    id: user.id,

    firstName:
        document.getElementById("firstName").value,

    lastName:
        document.getElementById("lastName").value,

    gender:
        document.querySelector(
            'input[name="gender"]:checked'
        )?.value,

    address:
        document.getElementById("address").value,

    email:
        document.getElementById("email").value,

    mobile:
        document.getElementById("mobile").value

};

    try {

        let response = await fetch("http://localhost:8080/api/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {

            let updatedUser = await response.json();

            localStorage.setItem("currentUser",
                JSON.stringify(updatedUser));

            user = updatedUser;

            alert("Profile Updated Successfully");

            document.querySelectorAll("input,textarea")
                .forEach(x => x.disabled = true);

            document.getElementById("editBtn").style.display = "inline-block";
            document.getElementById("updateBtn").style.display = "none";

            isVerified = false;

        } else {

            let msg = await response.text();
            alert("Update Failed : " + msg);

        }

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "loginpage.html";

}

function changePassword(){

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

   let data = {

    userId: user.id,

    oldPassword:
        document.getElementById("oldPassword").value,

    newPassword:
        document.getElementById("newPassword").value

};

fetch("http://localhost:8080/api/users/change-password", {

    method: "PUT",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(data)

});

    let confirmPassword=
        document.getElementById("confirmPassword").value;

    if(data.newPassword!=confirmPassword){

        alert("Passwords do not match");

        return;
    }

    fetch("http://localhost:8080/api/users/change-password",{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    })
    .then(response=>response.text())
    .then(message=>{

        alert(message);

    });

}