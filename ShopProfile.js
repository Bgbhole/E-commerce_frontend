let seller = JSON.parse(localStorage.getItem("currentSeller"));

if (!seller) {
alert("Please login first");
window.location.href = "loginpage.html";
}

window.onload = loadProfile;

async function loadProfile() {

try {

    let response = await fetch(
        `http://localhost:8080/api/sellers/${seller.sellerId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load seller profile");
    }

    let data = await response.json();

    document.getElementById("ownerName").value =
        data.name || "";

    document.getElementById("shopName1").value =
        data.shopName || "";

    document.getElementById("shopAddress").value =
        data.shopAddress || "";

    document.getElementById("email").value =
        data.email || "";

    document.getElementById("mobile").value =
        data.mobile || "";

    document.getElementById("alternateMobile").value =
        data.alternateMobile || "";

    document.getElementById("category").value =
        data.category || "";

    document.getElementById("productType").value =
        data.productType || "";

    document.getElementById("gst").value =
        data.gstNumber || "";

    document.getElementById("pan").value =
        data.panNumber || "";

    document.getElementById("aadhar").value =
        data.aadharNumber || "";

    document.getElementById("license").value =
        data.businessLicense || "";

    document.getElementById("bankName").value =
        data.bankName || "";

    document.getElementById("accountHolder").value =
        data.accountHolderName || "";

    document.getElementById("accountNumber").value =
        data.accountNumber || "";

    document.getElementById("ifsc").value =
        data.ifscCode || "";

    document.getElementById("upi").value =
        data.upiId || "";

    document.getElementById("pickupAddress").value =
        data.pickupAddress || "";

    document.getElementById("city").value =
        data.city || "";

    document.getElementById("state").value =
        data.state || "";

    document.getElementById("pincode").value =
        data.pincode || "";

    document.getElementById("nomineeName").value =
        data.nomineeName || "";

    document.getElementById("nomineeMobile").value =
        data.nomineeMobile || "";

} catch (error) {

    console.error(error);
    alert("Unable to load seller profile");

}


}

function enableEdit() {


let fields =
    document.querySelectorAll("input");

fields.forEach(field => {
    field.disabled = false;
});

document.getElementById("editBtn").style.display = "none";
document.getElementById("saveBtn").style.display = "inline-block";


}

async function saveProfile() {


try {

    let updatedSeller = {

        sellerId: seller.sellerId,

        name:
            document.getElementById("ownerName").value,

        email:
            document.getElementById("email").value,

        mobile:
            document.getElementById("mobile").value,

        alternateMobile:
            document.getElementById("alternateMobile").value,

        shopName:
            document.getElementById("shopName1").value,

            shopAddress:
            document.getElementById("shopAddress").value,

        category:
            document.getElementById("category").value,

        productType:
            document.getElementById("productType").value,

        gstNumber:
            document.getElementById("gst").value,

        panNumber:
            document.getElementById("pan").value,

        aadharNumber:
            document.getElementById("aadhar").value,

        businessLicense:
            document.getElementById("license").value,

        bankName:
            document.getElementById("bankName").value,

        accountHolderName:
            document.getElementById("accountHolder").value,

        accountNumber:
            document.getElementById("accountNumber").value,

        ifscCode:
            document.getElementById("ifsc").value,

        upiId:
            document.getElementById("upi").value,

        pickupAddress:
            document.getElementById("pickupAddress").value,

        city:
            document.getElementById("city").value,

        state:
            document.getElementById("state").value,

        pincode:
            document.getElementById("pincode").value,

        nomineeName:
            document.getElementById("nomineeName").value,

        nomineeMobile:
            document.getElementById("nomineeMobile").value
    };

    let response = await fetch(
        "http://localhost:8080/api/sellers/update",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedSeller)
        }
    );

    if (response.ok) {

        let updatedData = await response.json();

        localStorage.setItem(
            "currentSeller",
            JSON.stringify(updatedData)
        );

        alert("Profile Updated Successfully");

        location.reload();

    } else {

        alert("Failed to update profile");

    }

} catch (error) {

    console.error(error);
    alert("Error updating profile");

}


}

async function sendOTP() {

try {

    let response = await fetch(
        `http://localhost:8080/api/sellers/send-edit-otp/${seller.sellerId}`,
        {
            method: "POST"
        }
    );

    let message = await response.text();

    alert(message);

    document.getElementById("otpSection").style.display = "block";

}
catch(error){

    console.error(error);
    alert("Failed to send OTP");

}


}

async function verifyOTP() {


let otp =
    document.getElementById("otp").value;

if(!otp){

    alert("Please enter OTP");
    return;

}

let response = await fetch(
    "http://localhost:8080/api/sellers/verify-edit-otp",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: seller.sellerId,
            otp: otp
        })
    }
);

let result = await response.text();

if(result === "OTP Verified"){

    enableEdit();

    document.getElementById("otpSection").style.display = "none";

    alert("OTP Verified Successfully");

}
else{

    alert("Invalid OTP");

}


}


async function verifyOTP() {

    let otp =
        document.getElementById("otp").value;

    let response = await fetch(
        "http://localhost:8080/api/sellers/verify-edit-otp",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: seller.sellerId,
                otp: otp
            })
        }
    );

    let result = await response.text();

    if(result === "OTP Verified") {

        enableEdit();

        document.getElementById("otpSection").style.display = "none";

    } else {

        alert("Invalid OTP");

    }
}
