    // ================= API =================

    const seller = JSON.parse(localStorage.getItem("currentSeller"));

    // ================= CATEGORY =================

    function changeCategory() {

        const category = document.getElementById("category").value;

        const sections = document.querySelectorAll(".category-box");

        sections.forEach(section => {

            section.style.display = "none";

        });

        switch(category){

            case "Mobile":
                document.getElementById("mobileFields").style.display="block";
            break;

            case "Electronics":
                document.getElementById("electronicsFields").style.display="block";
            break;

            case "Fashion":
                document.getElementById("fashionFields").style.display="block";
            break;

            case "Furniture":
                document.getElementById("furnitureFields").style.display="block";
            break;

            case "Home & Kitchen":
                document.getElementById("homeFields").style.display="block";
            break;

            case "Books":
                document.getElementById("bookFields").style.display="block";
            break;

            case "Beauty":
                document.getElementById("beautyFields").style.display="block";
            break;

            case "Sports":
                document.getElementById("sportsFields").style.display="block";
            break;

            case "Grocery":
                document.getElementById("groceryFields").style.display="block";
            break;

            case "Toys":
                document.getElementById("toyFields").style.display="block";
            break;

        }

    }



    // ================= PRICE =================

    function calculateValues(){

    let purchasePrice =
    parseFloat(document.getElementById("purchasePrice").value) || 0;

    let sellingPrice =
    parseFloat(document.getElementById("sellingPrice").value) || 0;

    let gst =
    parseFloat(document.getElementById("gst").value) || 0;

    // Profit
    let profit = sellingPrice - purchasePrice;

    // Platform Fee %
    let platformFee = 2;

    // Platform Fee Amount
    let platformFeeAmount =
    (sellingPrice * platformFee) / 100;

    // Seller Net Profit
    let sellerNetProfit =
    profit - platformFeeAmount;

    // GST
    let gstAmount =
    (sellingPrice * gst) / 100;

    // Final Price
    let finalPrice =
    sellingPrice + gstAmount;

    document.getElementById("profit").value =
    profit.toFixed(2);

    document.getElementById("platformFee").value =
    platformFee;

    document.getElementById("platformFeeAmount").value =
    platformFeeAmount.toFixed(2);

    document.getElementById("sellerNetProfit").value =
    sellerNetProfit.toFixed(2);

    document.getElementById("gstAmount").value =
    gstAmount.toFixed(2);

    document.getElementById("finalPrice").value =
    finalPrice.toFixed(2);

}



    // ================= ADD PRODUCT =================

    async function addProduct() {

        if (!seller) {

            alert("Seller Not Logged In");

            return;

        }

        const category =
            document.getElementById("category").value;

        let formData = new FormData();

        // ================= BASIC DETAILS =================

        formData.append("productName",
            document.getElementById("productName").value);

        formData.append("brand",
            document.getElementById("brand").value);

        formData.append("category", category);

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

        formData.append("sellerId",
            seller.sellerId);

        // Main Image
    if(document.getElementById("image").files.length>0){

        formData.append(
            "image",
            document.getElementById("image").files[0]
        );

    }

    // Image 2
    if(document.getElementById("image2").files.length>0){

        formData.append(
            "image2",
            document.getElementById("image2").files[0]
        );

    }

    // Image 3
    if(document.getElementById("image3").files.length>0){

        formData.append(
            "image3",
            document.getElementById("image3").files[0]
        );

    }

    // Image 4
    if(document.getElementById("image4").files.length>0){

        formData.append(
            "image4",
            document.getElementById("image4").files[0]
        );



        }

        // ================= CATEGORY =================

        switch(category){

            case "Mobile":

                formData.append("model",
                    document.getElementById("model").value);

                formData.append("color",
                    document.getElementById("color").value);

                formData.append("weight",
                    document.getElementById("weight").value);

                formData.append("warranty",
                    document.getElementById("warranty").value);

                formData.append("ram",
                    document.getElementById("ram").value);

                formData.append("storage",
                    document.getElementById("storage").value);

                formData.append("processor",
                    document.getElementById("processor").value);

                formData.append("battery",
                    document.getElementById("battery").value);

                formData.append("camera",
                    document.getElementById("camera").value);

                formData.append("display",
                    document.getElementById("display").value);

                formData.append("operatingSystem",
                    document.getElementById("operatingSystem").value);

                formData.append("network",
                    document.getElementById("network").value);

            break;

                    case "Electronics":

                formData.append("model",
                    document.getElementById("eModel").value);

                formData.append("color",
                    document.getElementById("eColor").value);

                formData.append("weight",
                    document.getElementById("eWeight").value);

                formData.append("warranty",
                    document.getElementById("eWarranty").value);

                formData.append("voltage",
                    document.getElementById("voltage").value);

                formData.append("power",
                    document.getElementById("power").value);

                formData.append("connectivity",
                    document.getElementById("connectivity").value);

            break;



            case "Fashion":

                formData.append("size",
                    document.getElementById("size").value);

                formData.append("color",
                    document.getElementById("fashionColor").value);

                formData.append("material",
                    document.getElementById("fashionMaterial").value);

                formData.append("warranty",
                    document.getElementById("fashionWarranty").value);

                formData.append("fabric",
                    document.getElementById("fabric").value);

                formData.append("gender",
                    document.getElementById("gender").value);

                formData.append("fit",
                    document.getElementById("fit").value);

                formData.append("pattern",
                    document.getElementById("pattern").value);

                formData.append("sleeve",
                    document.getElementById("sleeve").value);

                formData.append("washCare",
                    document.getElementById("washCare").value);

            break;



            case "Furniture":

    formData.append("material",
        document.getElementById("furnitureMaterial").value);

    formData.append("color",
        document.getElementById("fColor").value);

    formData.append("weight",
        document.getElementById("fWeight").value);

    formData.append("warranty",
        document.getElementById("fWarranty").value);

    formData.append("dimensions",
        document.getElementById("dimensions").value);

    formData.append("finish",
        document.getElementById("finish").value);

    formData.append("assembly",
        document.getElementById("assembly").value);

    formData.append("roomType",
        document.getElementById("roomType").value);

break;


                    case "Home & Kitchen":

                formData.append("material",
                    document.getElementById("hMaterial").value);

                formData.append("color",
                    document.getElementById("hColor").value);

                formData.append("weight",
                    document.getElementById("hWeight").value);

                formData.append("warranty",
                    document.getElementById("hWarranty").value);

                formData.append("capacity",
                    document.getElementById("capacity").value);

                formData.append("usage",
                    document.getElementById("usage").value);

                formData.append("dishwasher",
                    document.getElementById("dishwasher").value);

                formData.append("microwave",
                    document.getElementById("microwave").value);

            break;



            case "Books":

                formData.append("author",
                    document.getElementById("author").value);

                formData.append("publisher",
                    document.getElementById("publisher").value);

                formData.append("language",
                    document.getElementById("language").value);

                formData.append("pages",
                    document.getElementById("pages").value);

                formData.append("isbn",
                    document.getElementById("isbn").value);

                formData.append("edition",
                    document.getElementById("edition").value);

                formData.append("binding",
                    document.getElementById("binding").value);

                formData.append("publicationYear",
                    document.getElementById("publicationYear").value);

            break;



            case "Grocery":

                formData.append("weight",
                    document.getElementById("gWeight").value);

                formData.append("brand",
                    document.getElementById("gBrand").value);

                formData.append("manufacturer",
                    document.getElementById("manufacturer").value);

                formData.append("country",
                    document.getElementById("country").value);

                formData.append("expiryDate",
                    document.getElementById("expiryDate").value);

                formData.append("storageInstruction",
                    document.getElementById("storageInstruction").value);

                formData.append("veg",
                    document.getElementById("veg").value);

                formData.append("organic",
                    document.getElementById("organic").value);

            break;
                    case "Beauty":

                formData.append("skinType",
                    document.getElementById("skinType").value);

                formData.append("hairType",
                    document.getElementById("hairType").value);

                formData.append("ingredients",
                    document.getElementById("ingredients").value);

                formData.append("benefits",
                    document.getElementById("benefits").value);

                formData.append("netQuantity",
                    document.getElementById("netQuantity").value);

                formData.append("expiryDate",
                    document.getElementById("beautyExpiry").value);

                formData.append("country",
                    document.getElementById("beautyCountry").value);

                formData.append("warranty",
                    document.getElementById("beautyWarranty").value);

            break;



            case "Sports":

                formData.append("sportType",
                    document.getElementById("sportType").value);

                formData.append("material",
                    document.getElementById("sportMaterial").value);

                formData.append("weight",
                    document.getElementById("sportWeight").value);

                formData.append("color",
                    document.getElementById("sportColor").value);

                formData.append("ageGroup",
                    document.getElementById("ageGroup").value);

                formData.append("warranty",
                    document.getElementById("sportWarranty").value);

            break;



            case "Toys":

                formData.append("toyAge",
                    document.getElementById("toyAge").value);

                formData.append("material",
                    document.getElementById("toyMaterial").value);

                formData.append("batteryRequired",
                    document.getElementById("batteryRequired").value);

                formData.append("educational",
                    document.getElementById("educational").value);

                formData.append("safety",
                    document.getElementById("safety").value);

                formData.append("warranty",
                    document.getElementById("toyWarranty").value);

            break;

        }

        console.log("===== FormData =====");

        for (let pair of formData.entries()) {

            console.log(pair[0] + " : " + pair[1]);

        }

        try {

            const response = await fetch(

                `${API_BASE_URL}/api/products/AddProduct`,

                {

                    method: "POST",

                    body: formData

                }

            );

           if (!response.ok) {

    const error = await response.text();

    console.error(error);

    alert(error);

    return;
}

            const product = await response.json();

            console.log(product);

            alert("Product Added Successfully");

            clearAllFields();

            changeCategory();

        }

        catch(error){

            console.log(error);

            alert("Server Error");

        }

    }



    // ================= CLEAR =================

    function clearAllFields(){

        document.querySelectorAll("input").forEach(input=>{

            if(input.type!=="file"){

                input.value="";

            }

        });

        document.querySelectorAll("textarea").forEach(area=>{

            area.value="";

        });

        document.querySelectorAll("select").forEach(select=>{

            select.selectedIndex=0;

        });

    }



    // ================= PAGE LOAD =================

    window.onload=function(){

        calculateValues();

        changeCategory();

    };



    // ================= CLEAR =================

    function clearAllFields(){

        document.querySelectorAll("input").forEach(input=>{

            if(input.type!="file"){

                input.value="";

            }

        });

        document.querySelectorAll("textarea").forEach(area=>{

            area.value="";

        });

        document.querySelectorAll("select").forEach(select=>{

            select.selectedIndex=0;

        });

    }



    // ================= PAGE LOAD =================

    window.onload=function(){

        calculateValues();

        changeCategory();

    };