
async function registerSeller() {

    if (!document.getElementById("terms").checked) {
        alert("Please accept Terms & Conditions");
        return;
    }

    let seller = {

        // Personal Information
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        alternateMobile: document.getElementById("alternateMobile").value,
        password: document.getElementById("password").value,

        // Shop Information
        shopName: document.getElementById("shopName").value,
        shopAddress: document.getElementById("shopAddress").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,

        // Business Details
        
        category: document.getElementById("category").value,
        productType: document.getElementById("productType").value,


        nomineeName:
document.getElementById("nomineeName").value,

nomineeMobile:
document.getElementById("nomineeMobile").value,


        // Tax Details
        gstNumber: document.getElementById("gstNumber").value,
        panNumber: document.getElementById("panNumber").value,
        aadharNumber: document.getElementById("aadharNumber").value,
        businessLicense: document.getElementById("businessLicense").value,

        // Bank Details
        accountHolderName: document.getElementById("accountHolderName").value,
        bankName: document.getElementById("bankName").value,
        accountNumber: document.getElementById("accountNumber").value,
        ifscCode: document.getElementById("ifscCode").value,
        upiId: document.getElementById("upiId").value,

        // Address Details
        pickupAddress: document.getElementById("pickupAddress").value

    };

    try {

        let response = await fetch(
           `${API_BASE_URL}/api/sellers/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(seller)
            });

        if (response.ok) {

            alert("Seller Registration Successful");
            window.location.href = "SellerLogin.html";

        } else {

            let error = await response.text();
            alert("Registration Failed\n" + error);

        }

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}
