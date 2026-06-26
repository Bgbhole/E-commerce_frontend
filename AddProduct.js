function calculateValues() {

    let purchasePrice =
        parseFloat(document.getElementById("purchasePrice").value) || 0;

    let sellingPrice =
        parseFloat(document.getElementById("sellingPrice").value) || 0;

    let gst =
        parseFloat(document.getElementById("gst").value) || 0;

    let profit = sellingPrice - purchasePrice;
    document.getElementById("profit").value = profit.toFixed(2);

    let gstAmount = (sellingPrice * gst) / 100;
    document.getElementById("gstAmount").value = gstAmount.toFixed(2);

    let finalPrice = sellingPrice + gstAmount;
    document.getElementById("finalPrice").value = finalPrice.toFixed(2);
}


async function addProduct() {

    let formData = new FormData();

    formData.append("productName",
        document.getElementById("productName").value);

    formData.append("brand",
        document.getElementById("brand").value);

    formData.append("category",
        document.getElementById("category").value);

    formData.append("description",
        document.getElementById("description").value);

    formData.append("purchasePrice",
        document.getElementById("purchasePrice").value);

    formData.append("sellingPrice",
        document.getElementById("sellingPrice").value);

    formData.append("gstPercentage",
        document.getElementById("gst").value);

    formData.append("quantity",
        document.getElementById("quantity").value);

    // send calculated values
    formData.append("profit",
        document.getElementById("profit").value);

    formData.append("gstAmount",
        document.getElementById("gstAmount").value);

    formData.append("finalPrice",
        document.getElementById("finalPrice").value);


    let imageFile = document.getElementById("image").files[0];

    if (imageFile != null) {
        formData.append("image", imageFile);
    }

    const seller =
        JSON.parse(localStorage.getItem("currentSeller"));

    if (!seller) {
        alert("Seller not logged in");
        return;
    }

    formData.append("sellerId", seller.sellerId);

    try {

        let response = await fetch(
    `${API_BASE_URL}/api/products/AddProduct`,
            {
                method: "POST",
                body: formData
            }
        );
        

        if (!response.ok) {

            let error = await response.text();
            console.log(error);
            alert("Failed to save product");
            return;

        }

        let data = await response.json();

        console.log(data);

        alert("Product added successfully");

    } catch (error) {

        console.error(error);
        alert("Server error");

    }
}