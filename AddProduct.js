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

    formData.append("profit",
        document.getElementById("profit").value);

    formData.append("gstAmount",
        document.getElementById("gstAmount").value);

    formData.append("finalPrice",
        document.getElementById("finalPrice").value);

    formData.append("color",
        document.getElementById("color").value);

    formData.append("weight",
        document.getElementById("weight").value);

    formData.append("warranty",
        document.getElementById("warranty").value);

    formData.append("model",
        document.getElementById("model").value);

    formData.append("size",
        document.getElementById("size").value);

    formData.append("material",
        document.getElementById("material").value);

    let imageFile = document.getElementById("image").files[0];

    if (imageFile) {
        formData.append("image", imageFile);
    }

    const seller = JSON.parse(localStorage.getItem("currentSeller"));

    if (!seller) {
        alert("Seller not logged in");
        return;
    }

    formData.append("sellerId", seller.sellerId);

    // ===== DEBUG =====
    console.log("===== FormData =====");

    for (let pair of formData.entries()) {
        console.log(pair[0] + " : " + pair[1]);
    }

    console.log("====================");

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

        console.log("Saved Product:", data);

        alert("Product added successfully");

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }
}

function calculateValues() {

    let purchasePrice =
        parseFloat(document.getElementById("purchasePrice").value) || 0;

    let sellingPrice =
        parseFloat(document.getElementById("sellingPrice").value) || 0;

    let gst =
        parseFloat(document.getElementById("gst").value) || 0;

    let profit = sellingPrice - purchasePrice;

    let gstAmount = (sellingPrice * gst) / 100;

    let finalPrice = sellingPrice + gstAmount;

    document.getElementById("profit").value = profit.toFixed(2);

    document.getElementById("gstAmount").value = gstAmount.toFixed(2);

    document.getElementById("finalPrice").value = finalPrice.toFixed(2);
}