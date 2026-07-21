async function registerSeller() {

    if (!document.getElementById("terms").checked) {
        alert("Please accept Terms & Conditions");
        return;
    }

    const formData = new FormData();

    // Personal Information
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("mobile", document.getElementById("mobile").value);
    formData.append("alternateMobile", document.getElementById("alternateMobile").value);
    formData.append("password", document.getElementById("password").value);

    // Business Information
    formData.append("businessName", document.getElementById("businessName").value);

    // Your controller requires businessType.
    // If you don't have a businessType field in HTML,
    // send category as the business type for now.
    formData.append("businessType", document.getElementById("businessType").value);

    // Shop Information
    formData.append("shopName", document.getElementById("shopName").value);
    formData.append("shopAddress", document.getElementById("shopAddress").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("state", document.getElementById("state").value);
    formData.append("pincode", document.getElementById("pincode").value);

    // Category
    formData.append("category", document.getElementById("category").value);
    formData.append("productType", document.getElementById("productType").value);

    // Documents
    formData.append("gstNumber", document.getElementById("gstNumber").value);
    formData.append("panNumber", document.getElementById("panNumber").value);
    formData.append("aadharNumber", document.getElementById("aadharNumber").value);
    formData.append("businessLicense", document.getElementById("businessLicense").value);

    // Bank Details
    formData.append("accountHolderName", document.getElementById("accountHolderName").value);
    formData.append("bankName", document.getElementById("bankName").value);
    formData.append("accountNumber", document.getElementById("accountNumber").value);
    formData.append("ifscCode", document.getElementById("ifscCode").value);
    formData.append("upiId", document.getElementById("upiId").value);

    // Pickup Address
    formData.append("pickupAddress", document.getElementById("pickupAddress").value);

    // Nominee
    formData.append("nomineeName", document.getElementById("nomineeName").value);
    formData.append("nomineeMobile", document.getElementById("nomineeMobile").value);

    // Images
    formData.append(
        "shopLogo",
        document.getElementById("shopLogo").files[0]
    );

    formData.append(
        "shopFrontPhoto",
        document.getElementById("shopFrontPhoto").files[0]
    );

    formData.append(
        "shopInsidePhoto",
        document.getElementById("shopInsidePhoto").files[0]
    );

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/sellers/register`,
            {
                method: "POST",
                body: formData
            }
        );

        if (response.ok) {

            alert("Seller Registration Successful");
            window.location.href = "loginpage.html";

        } else {

            const error = await response.text();
            alert(error);

        }

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }

}