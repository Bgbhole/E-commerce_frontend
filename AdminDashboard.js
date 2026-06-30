   
   const admin = JSON.parse(localStorage.getItem("currentAdmin"));

if (!admin) {

    alert("Please login as Admin.");

    window.location.href = "AdminLogin.html";

}
   
   window.onload = function () {
        loadDashboard();
    };

    function showPage(page) {

        document.getElementById("pageTitle").innerHTML =
            page.charAt(0).toUpperCase() + page.slice(1);

        switch(page){

            case "users":
                loadUsers();
                break;

            case "sellers":
                loadSellers();
                break;

            case "confirmation":
                document.getElementById("tableArea").innerHTML =
                "<h2>Seller Confirmation</h2>";
                break;

           case "products":
    loadPendingProducts();
    break;

            case "orders":
                document.getElementById("tableArea").innerHTML =
                "<h2>Orders</h2>";
                break;

            case "transactions":
                document.getElementById("tableArea").innerHTML =
                "<h2>Transactions</h2>";
                break;

            case "complaints":
                document.getElementById("tableArea").innerHTML =
                "<h2>Complaints</h2>";
                break;

            default:
                loadDashboard();

        }

    }
    function openTab(event, tabName) {

        let tabContent =
        document.getElementsByClassName("tab-content");

        for(let i = 0; i < tabContent.length; i++){

            tabContent[i].style.display = "none";

        }

        let tabButtons =
        document.getElementsByClassName("tab-btn");

        for(let i = 0; i < tabButtons.length; i++){

            tabButtons[i].classList.remove("active");

        }

        document.getElementById(tabName).style.display = "block";

        event.currentTarget.classList.add("active");

    }

    function closeSellerModal(){

        document.getElementById("editSellerModal").style.display="none";

    }

async function loadDashboard() {

    document.getElementById("pageTitle").innerHTML = "Dashboard";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/dashboard`
        );

        if (!response.ok) {
            throw new Error("Unable to load dashboard");
        }

        const dashboard = await response.json();

        // Dashboard Cards
        document.getElementById("usersCount").innerHTML =
            dashboard.totalUsers;

        document.getElementById("sellerCount").innerHTML =
            dashboard.totalSellers;

        document.getElementById("orderCount").innerHTML =
            dashboard.totalOrders;

        document.getElementById("productCount").innerHTML =
            dashboard.totalProducts;

        // Welcome Table
        document.getElementById("tableArea").innerHTML = `

            <h2>Welcome Administrator</h2>

            <br>

            <table>

                <tr>
                    <th>Statistic</th>
                    <th>Count</th>
                </tr>

                <tr>
                    <td>Total Users</td>
                    <td>${dashboard.totalUsers}</td>
                </tr>

                <tr>
                    <td>Total Sellers</td>
                    <td>${dashboard.totalSellers}</td>
                </tr>

                <tr>
                    <td>Total Products</td>
                    <td>${dashboard.totalProducts}</td>
                </tr>

                <tr>
                    <td>Total Orders</td>
                    <td>${dashboard.totalOrders}</td>
                </tr>

                <tr>
                    <td>Pending Sellers</td>
                    <td>${dashboard.pendingSellers}</td>
                </tr>

                <tr>
                    <td>Pending Products</td>
                    <td>${dashboard.pendingProducts}</td>
                </tr>

            </table>

        `;

    }
    catch (error) {

        console.log(error);

        alert("Unable to load dashboard.");

    }

}

    function logout(){

        localStorage.removeItem("currentAdmin");

        window.location.href="admin-log.html";

    }

    async function loadUsers() {

        try {

            let response = await fetch(`${API_BASE_URL}/api/users`);

            if (!response.ok) {
                throw new Error("Unable to fetch users");
            }

            let users = await response.json();

            let html = `
                <h2>Users</h2>

                <table>

                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
            `;

            users.forEach(user => {

                html += `
                    <tr>

                        <td>${user.id}</td>

                        <td>${user.firstName}</td>

                        <td>${user.lastName}</td>

                        <td>${user.email}</td>

                        <td>${user.mobile}</td>

                        <td>${user.address}</td>

                        <td>

                            <button onclick="editUser(${user.id})">
                                Edit
                            </button>

                            <button onclick="deleteUser(${user.id})">
                                Delete
                            </button>

                        </td>

                    </tr>
                `;

            });

            html += `</table>`;

            document.getElementById("tableArea").innerHTML = html;

        } catch (error) {

            console.log(error);

            alert("Unable to load users.");

        }

    }
    async function loadSellers() {

        try {

            let response = await fetch(`${API_BASE_URL}/api/sellers`);

            let sellers = await response.json();

            let html = `

            <h2>Seller Management</h2>

            <table>

            <tr>

            <th>ID</th>
            <th>Shop</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Action</th>

            </tr>

            `;

            sellers.forEach(seller => {

                html += `

                <tr>

                <td>${seller.sellerId}</td>

                <td>${seller.shopName}</td>

                <td>${seller.name}</td>

                <td>${seller.email}</td>

                <td>${seller.mobile}</td>

                <td>${seller.status}</td>

                <td>

    <button class="view-btn"
    onclick="viewSeller(${seller.sellerId})">

    <i class="fa fa-eye"></i>

    </button>

    </td>

    <td>

    <button class="edit-btn"
    onclick="editSeller(${seller.sellerId})">

    <i class="fa fa-edit"></i>

    </button>

    </td>

    <td>

    <button class="approve-btn"
    onclick="approveSeller(${seller.sellerId})">

    <i class="fa fa-check"></i>

    </button>

    </td>

    <td>

    <button class="reject-btn"
    onclick="rejectSeller(${seller.sellerId})">

    <i class="fa fa-times"></i>

    </button>

    </td>

    <td>

    <button class="delete-btn"
    onclick="deleteSeller(${seller.sellerId})">

    <i class="fa fa-trash"></i>

    </button>

    </td>

                </tr>

                `;

            });

            html += "</table>";

            document.getElementById("tableArea").innerHTML = html;

        }

        catch(error){

            console.log(error);

            alert(error);

        }

    }

    async function deleteUser(id) {

        if (!confirm("Delete this user?")) {
            return;
        }

        let response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: "DELETE"
        });

        let message = await response.text();

        if (response.ok) {

            alert(message);
            loadUsers();

        } else {

            alert("Error: " + message);
            console.log(message);

        }
    }

    async function deleteSeller(id){

        if(!confirm("Delete this seller?"))
            return;

        let response = await fetch(`${API_BASE_URL}/api/sellers/${id}`,{

            method:"DELETE"

        });

        let message = await response.text();

        if(response.ok){

            alert(message);

            loadSellers();

        }else{

            alert(message);

        }

    }

    async function editUser(id) {

        let response = await fetch(`${API_BASE_URL}/api/users/${id}`);

        let user = await response.json();

        document.getElementById("editUserId").value = user.id;
        document.getElementById("editFirstName").value = user.firstName;
        document.getElementById("editLastName").value = user.lastName;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editMobile").value = user.mobile;
        document.getElementById("editGender").value = user.gender;
        document.getElementById("editDob").value = user.dateOfBirth;
        document.getElementById("editAddress").value = user.address;
        document.getElementById("editCity").value = user.city;
        document.getElementById("editState").value = user.state;
        document.getElementById("editPincode").value = user.pincode;
        document.getElementById("editCountry").value = user.country;
        document.getElementById("editStatus").value = user.status;
        document.getElementById("editPassword").value = user.password;

        document.getElementById("editUserModal").style.display = "block";
    }

    function closeUserModal() {

        document.getElementById("editUserModal").style.display = "none";

    }

    async function editSeller(id){

        let response =
        await fetch(`${API_BASE_URL}/api/sellers/${id}`);

        let seller = await response.json();

        console.log(seller);
        

        document.getElementById("sellerId").value = seller.sellerId || "";
        document.getElementById("sellerName").value = seller.name || "";
        document.getElementById("sellerEmail").value = seller.email || "";
        document.getElementById("sellerMobile").value = seller.mobile || "";
        document.getElementById("sellerAlternateMobile").value = seller.alternateMobile || "";
        document.getElementById("sellerPassword").value = seller.password || "";
        document.getElementById("sellerStatus").value = seller.status || "PENDING";

    
        document.getElementById("gstNumber").value = seller.gstNumber || "";
        document.getElementById("panNumber").value = seller.panNumber || "";
        document.getElementById("aadharNumber").value = seller.aadharNumber || "";
        document.getElementById("businessLicense").value = seller.businessLicense || "";

        document.getElementById("shopName").value = seller.shopName || "";
        document.getElementById("shopAddress").value = seller.shopAddress || "";
        document.getElementById("city").value = seller.city || "";
        document.getElementById("state").value = seller.state || "";
        document.getElementById("pincode").value = seller.pincode || "";
        document.getElementById("category").value = seller.category || "";
        document.getElementById("productType").value = seller.productType || "";
        document.getElementById("pickupAddress").value = seller.pickupAddress || "";

        document.getElementById("accountHolderName").value = seller.accountHolderName || "";
        document.getElementById("accountNumber").value = seller.accountNumber || "";
        document.getElementById("bankName").value = seller.bankName || "";
        document.getElementById("ifscCode").value = seller.ifscCode || "";
        document.getElementById("upiId").value = seller.upiId || "";

        document.getElementById("nomineeName").value = seller.nomineeName || "";
document.getElementById("nomineeMobile").value = seller.nomineeMobile || ""; 



    // Live Preview
    

    // Open Modal
    document.getElementById("editSellerModal").style.display = "block";

    document.querySelectorAll(".tab-content").forEach(tab=>{

        tab.style.display="none";

    });

    document.getElementById("personal").style.display="block";

    document.querySelectorAll(".tab-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    document.querySelector(".tab-btn").classList.add("active");

}


    async function updateSeller() {

        let seller = {

            sellerId: document.getElementById("sellerId").value,

            name: document.getElementById("sellerName").value,
            email: document.getElementById("sellerEmail").value,
            mobile: document.getElementById("sellerMobile").value,
            alternateMobile: document.getElementById("sellerAlternateMobile").value,
            password: document.getElementById("sellerPassword").value,

    
            shopName: document.getElementById("shopName").value,
            shopAddress: document.getElementById("shopAddress").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            pincode: document.getElementById("pincode").value,

            category: document.getElementById("category").value,
            productType: document.getElementById("productType").value,

            gstNumber: document.getElementById("gstNumber").value,
            panNumber: document.getElementById("panNumber").value,
            aadharNumber: document.getElementById("aadharNumber").value,
            businessLicense: document.getElementById("businessLicense").value,

            accountHolderName: document.getElementById("accountHolderName").value,
            accountNumber: document.getElementById("accountNumber").value,
            bankName: document.getElementById("bankName").value,
            ifscCode: document.getElementById("ifscCode").value,
            upiId: document.getElementById("upiId").value,

            pickupAddress: document.getElementById("pickupAddress").value,
            nomineeName: document.getElementById("nomineeName").value,
            nomineeMobile: document.getElementById("nomineeMobile").value,

        

            status: document.getElementById("sellerStatus").value

        };

        let response = await fetch(
            `${API_BASE_URL}/api/sellers/update`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(seller)
            }
        );

        if(response.ok){

            alert("Seller Updated Successfully");

            closeSellerModal();

            loadSellers();

        }else{

            alert("Unable to Update Seller");

        }

    }


    async function loadPendingSellers() {

    document.getElementById("pageTitle").innerHTML =
        "Seller Confirmation";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/pending-sellers`
        );

        if (!response.ok) {

            throw new Error("Unable to load sellers");

        }

        const sellers = await response.json();

        let html = `

        <table>

            <tr>

                <th>Seller ID</th>

                <th>Owner</th>

                <th>Email</th>

                <th>Mobile</th>

                <th>Shop Name</th>

                <th>Status</th>

                <th>Action</th>

            </tr>

        `;

        sellers.forEach(seller => {

            html += `

            <tr>

                <td>${seller.sellerId}</td>

                <td>${seller.name}</td>

                <td>${seller.email}</td>

                <td>${seller.mobile}</td>

                <td>${seller.shopName}</td>

                <td>${seller.status}</td>

                <td>

                    <button class="approve-btn"
                        onclick="approveSeller(${seller.sellerId})">

                        Approve

                    </button>

                    <button class="reject-btn"
                        onclick="rejectSeller(${seller.sellerId})">

                        Reject

                    </button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        document.getElementById("tableArea").innerHTML = html;

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


async function approveSeller(id){

    if(!confirm("Approve this seller?")){
        return;
    }

    try{

        const response = await fetch(

            `${API_BASE_URL}/api/admin/approve-seller/${id}`,

            {

                method:"PUT"

            }

        );

        if(!response.ok){

            throw new Error("Unable to approve seller");

        }

        alert("Seller Approved Successfully");

        loadPendingSellers();

        loadDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}

async function rejectSeller(id){

    if(!confirm("Reject this seller?")){
        return;
    }

    try{

        const response = await fetch(

            `${API_BASE_URL}/api/admin/reject-seller/${id}`,

            {

                method:"PUT"

            }

        );

        if(!response.ok){

            throw new Error("Unable to reject seller");

        }

        alert("Seller Rejected Successfully");

        loadPendingSellers();

        loadDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


async function loadPendingProducts() {

    document.getElementById("pageTitle").innerHTML =
        "Product Approval";

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/pending-products`
        );

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        const products = await response.json();

        let html = `

        <table>

            <tr>

                <th>Image</th>

                <th>Product</th>

                <th>Brand</th>

                <th>Category</th>

                <th>Seller</th>

                <th>Price</th>

                <th>Status</th>

                <th>Action</th>

            </tr>

        `;

        products.forEach(product => {

            html += `

            <tr>

                <td>

                    <img src="${API_BASE_URL}/images/${product.image}"
                         width="70">

                </td>

                <td>${product.productName}</td>

                <td>${product.brand}</td>

                <td>${product.category}</td>

                <td>${product.seller.shopName}</td>

                <td>₹${product.finalPrice}</td>

                <td>${product.status}</td>

                <td>

                    <button class="approve-btn"
                        onclick="approveProduct(${product.productId})">

                        Approve

                    </button>

                    <button class="reject-btn"
                        onclick="rejectProduct(${product.productId})">

                        Reject

                    </button>

                </td>

            </tr>

            `;

        });

        html += "</table>";

        document.getElementById("tableArea").innerHTML = html;

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

async function approveProduct(productId) {

    if (!confirm("Approve this product?")) {
        return;
    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/admin/approve-product/${productId}`,

            {

                method: "PUT"

            }

        );

        if (!response.ok) {
            throw new Error("Unable to approve product");
        }

        alert("Product Approved Successfully");

        loadPendingProducts();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

async function rejectProduct(productId) {

    if (!confirm("Reject this product?")) {
        return;
    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/admin/reject-product/${productId}`,

            {

                method: "PUT"

            }

        );

        if (!response.ok) {
            throw new Error("Unable to reject product");
        }

        alert("Product Rejected Successfully");

        loadPendingProducts();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}


function logout() {

    localStorage.removeItem("currentAdmin");

    window.location.href = "admin-log.html";

}