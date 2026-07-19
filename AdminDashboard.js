// ======================================
// ADMIN DASHBOARD
// PART 1
// ======================================



const admin = JSON.parse(localStorage.getItem("currentAdmin"));

if (!admin) {
    alert("Please login as Admin.");
    window.location.href = "admin-log.html";
}

// ======================================
// GLOBAL DATA
// ======================================

let dashboardData = {};
let users = [];
let sellers = [];
let pendingSellers = [];
let pendingProducts = [];
let orders = [];



function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
    });

    const selected = document.getElementById(page);

    if (selected) {
        selected.style.display = "block";
    }

    switch (page) {
        case "dashboard":
            loadDashboard();
            break;

        case "users":
            loadUsers();
            break;

        case "sellers":
            loadSellers();
            break;

        case "pendingSellers":
            loadPendingSellers();
            break;

        case "pendingProducts":
            loadPendingProducts();
            break;
    }
}
// ======================================
// HELPERS
// ======================================

function safe(value, fallback = "-") {

    if (value === null || value === undefined || value === "")
        return fallback;

    return String(value).replace(
        /[&<>'"]/g,
        c => ({
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            "'":"&#39;",
            "\"":"&quot;"
        })[c]
    );

}

function statusBadge(status){

    status = status || "Unknown";

    return `
    <span class="status ${status.toLowerCase()}">
        ${safe(status)}
    </span>`;

}

function formatMoney(value){

    return "₹" +
    Number(value || 0)
    .toLocaleString("en-IN");

}

function showLoading(message="Loading..."){

    document.getElementById("tableArea").innerHTML=`

    <div class="loading-state">

        <i class="fa fa-spinner fa-spin"></i>

        <h3>${message}</h3>

    </div>

    `;

}

function showError(message){

    document.getElementById("tableArea").innerHTML=`

    <div class="empty-state">

        <i class="fa fa-triangle-exclamation"></i>

        <h3>Error</h3>

        <p>${safe(message)}</p>

    </div>

    `;

}

function emptyState(title,msg){

    document.getElementById("tableArea").innerHTML=`

    <div class="empty-state">

        <i class="fa fa-box-open"></i>

        <h3>${title}</h3>

        <p>${msg}</p>

    </div>

    `;

}

// ======================================
// SEARCH
// ======================================

function filterAdminTable(text){

    text=text.toLowerCase();

    document.querySelectorAll("#adminTable tbody tr")
    .forEach(row=>{

        row.style.display=
        row.innerText.toLowerCase().includes(text)
        ? ""
        : "none";

    });

}

// ======================================
// SIDEBAR
// ======================================

function toggleSidebar(){

    document
    .querySelector(".sidebar")
    .classList.toggle("open");

}

function setActivePage(page){

    document
    .querySelectorAll(".sidebar li")
    .forEach(li=>{

        li.classList.remove("active");

        if(li.dataset.page===page){

            li.classList.add("active");

        }

    });

}

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(page){

    setActivePage(page);

    const titles={

        dashboard:"Dashboard",

        users:"Customers",

        sellers:"Seller Management",

        confirmation:"Seller Approvals",

        products:"Product Approvals",

        orders:"Orders",

        transactions:"Payments"

    };

    document.getElementById("pageTitle").innerHTML=
    titles[page] || "Admin";

    switch(page){

        case "dashboard":

            loadDashboard();

            break;

        case "users":

            loadUsers();

            break;

        case "sellers":

            loadSellers();

            break;

        case "confirmation":

            loadPendingSellers();

            break;


            
      case "products":

    loadProducts();

    break;

case "pendingProducts":

    loadPendingProducts();

    break;

        case "orders":

            loadOrders();

            break;

        default:

            loadDashboard();

    }

}

// ======================================
// LOGOUT
// ======================================

function logout(){

    if(confirm("Logout?")){

        localStorage.removeItem("currentAdmin");

        location.href="admin-log.html";

    }

}

// ======================================
// STARTUP
// ======================================

window.onload=function(){

    showPage("dashboard");

};
// ======================================
// PART 2
// DASHBOARD
// ======================================

async function loadDashboard() {

    showLoading("Loading Dashboard...");

    try {

        const response =
        await fetch(`${API_BASE_URL}/api/admin/dashboard`);

        if (!response.ok) {

            throw new Error("Unable to load dashboard.");

        }

        dashboardData = await response.json();

        // Dashboard Cards

        document.getElementById("usersCount").innerHTML =
            dashboardData.totalUsers || 0;

        document.getElementById("sellerCount").innerHTML =
            dashboardData.totalSellers || 0;

        document.getElementById("orderCount").innerHTML =
            dashboardData.totalOrders || 0;

        document.getElementById("productCount").innerHTML =
            dashboardData.totalProducts || 0;

        // Notification Badges

        const sellerBadge =
            document.getElementById("sellerApprovalBadge");

        if (sellerBadge) {

            sellerBadge.innerHTML =
                dashboardData.pendingSellers || 0;

        }

        const productBadge =
            document.getElementById("productApprovalBadge");

        if (productBadge) {

            productBadge.innerHTML =
                dashboardData.pendingProducts || 0;

        }

        document.getElementById("tableArea").innerHTML = `

<div class="dashboard-grid">

<div class="panel">

<h2>Pending Verification</h2>

<p>Products and Sellers waiting for approval.</p>

<div class="review-list">

<div class="review-item">

<i class="fa fa-store"></i>

<div>

<strong>${dashboardData.pendingSellers || 0} Pending Sellers</strong>

<small>Seller registrations waiting for review.</small>

</div>

<button
class="approve-btn"
onclick="showPage('confirmation')">

Review

</button>

</div>

<div class="review-item">

<i class="fa fa-box"></i>

<div>

<strong>${dashboardData.pendingProducts || 0} Pending Products</strong>

<small>Products waiting for verification.</small>

</div>

<button
class="verify-btn"
onclick="showPage('pendingProducts')">
Verify
</button>

</div>

</div>

</div>

<div class="panel">

<h2>Marketplace Summary</h2>

<p>Overall marketplace statistics.</p>

<table>

<tr>

<td>Total Users</td>

<td>${dashboardData.totalUsers}</td>

</tr>

<tr>

<td>Total Sellers</td>

<td>${dashboardData.totalSellers}</td>

</tr>

<tr>

<td>Total Products</td>

<td>${dashboardData.totalProducts}</td>

</tr>

<tr>

<td>Total Orders</td>

<td>${dashboardData.totalOrders}</td>

</tr>

<tr>

<td>Pending Sellers</td>

<td>${dashboardData.pendingSellers}</td>

</tr>

<tr>

<td>Pending Products</td>

<td>${dashboardData.pendingProducts}</td>

</tr>

</table>

</div>

</div>

`;

    }

    catch(error){

        console.log(error);

        showError(error.message);

    }

}
// ======================================
// PART 3A
// CUSTOMER MANAGEMENT
// ======================================

async function loadUsers() {

    showLoading("Loading Customers...");

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/users`);

        if (!response.ok) {
            throw new Error("Unable to load customers.");
        }

        users = await response.json();

        if (users.length === 0) {

            emptyState(
                "No Customers",
                "No registered customers found."
            );

            return;
        }

        let html = `

<div class="panel-header">

<div>

<h2>Customer Management</h2>

<p>Total Customers : ${users.length}</p>

</div>

<div class="toolbar">

<div class="search-box">

<i class="fa fa-search"></i>

<input
type="text"
placeholder="Search customer..."
onkeyup="filterAdminTable(this.value)">

</div>

</div>

</div>

<div class="table-wrap">

<table id="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Customer</th>

<th>Email</th>

<th>Mobile</th>

<th>Address</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

`;

        users.forEach(user => {

            html += `

<tr>

<td>

${user.id}

</td>

<td>

<span class="cell-title">

${safe(user.firstName)}
${safe(user.lastName)}

</span>

</td>

<td>

${safe(user.email)}

</td>

<td>

${safe(user.mobile)}

</td>

<td>

${safe(
user.city ||
user.address ||
"-"
)}

</td>

<td>

${statusBadge("ACTIVE")}

</td>

<td>

<div class="action-group">

<button
class="edit-btn"
onclick="editUser(${user.id})">

<i class="fa fa-edit"></i>

</button>

<button
class="delete-btn"
onclick="deleteUser(${user.id})">

<i class="fa fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById("tableArea").innerHTML =
            html;

    }

    catch (error) {

        console.log(error);

        showError(error.message);

    }

}


// ======================================
// DELETE CUSTOMER
// ======================================

async function deleteUser(id) {

    if (!confirm("Delete this customer?")) {

        return;

    }

    try {

        const response =
            await fetch(

                `${API_BASE_URL}/api/users/${id}`,

                {
                    method: "DELETE"
                }

            );

        const message =
            await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message);

        loadUsers();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}
// ======================================
// PART 3B
// EDIT CUSTOMER
// ======================================

async function editUser(id) {

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/users/${id}`);

        if (!response.ok) {

            throw new Error("Unable to load customer.");

        }

        const user = await response.json();

        document.getElementById("editUserId").value =
            user.id || "";

        document.getElementById("editFirstName").value =
            user.firstName || "";

        document.getElementById("editLastName").value =
            user.lastName || "";

        document.getElementById("editEmail").value =
            user.email || "";

        document.getElementById("editMobile").value =
            user.mobile || "";

        document.getElementById("editGender").value =
            user.gender || "";

        document.getElementById("editDob").value =
            user.dateOfBirth || "";

        document.getElementById("editAddress").value =
            user.address || "";

        document.getElementById("editCity").value =
            user.city || "";

        document.getElementById("editState").value =
            user.state || "";

        document.getElementById("editPincode").value =
            user.pincode || "";

        document.getElementById("editCountry").value =
            user.country || "";

            document.getElementById("editUserModal").style.display = "flex";

        

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


// ======================================
// UPDATE CUSTOMER
// ======================================

async function updateUser() {

    try {

        const user = {

            id:
            document.getElementById("editUserId").value,

            firstName:
            document.getElementById("editFirstName").value,

            lastName:
            document.getElementById("editLastName").value,

            email:
            document.getElementById("editEmail").value,

            mobile:
            document.getElementById("editMobile").value,

            gender:
            document.getElementById("editGender").value,

            dateOfBirth:
            document.getElementById("editDob").value,

            address:
            document.getElementById("editAddress").value,

            city:
            document.getElementById("editCity").value,

            state:
            document.getElementById("editState").value,

            pincode:
            document.getElementById("editPincode").value,

            country:
            document.getElementById("editCountry").value

        };

       const response = await fetch(

    `${API_BASE_URL}/api/users/update/${user.id}`,

    {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)
    }

);

        if(!response.ok){

            throw new Error(await response.text());

        }

        alert("Customer Updated Successfully");

        closeUserModal();

        loadUsers();

        loadDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}


// ======================================
// CLOSE CUSTOMER MODAL
// ======================================

function closeUserModal(){

    document
    .getElementById("editUserModal")
    .style.display="none";

}
// ======================================
// PART 4A
// SELLER MANAGEMENT
// loadSellers()
// deleteSeller()
// ======================================

async function loadSellers() {

    showLoading("Loading Sellers...");

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/sellers`);

        if (!response.ok) {

            throw new Error("Unable to load sellers.");

        }

        sellers = await response.json();

        if (sellers.length === 0) {

            emptyState(
                "No Sellers",
                "No sellers are registered."
            );

            return;

        }

        let html = `

<div class="panel-header">

<div>

<h2>Seller Management</h2>

<p>Total Sellers : ${sellers.length}</p>

</div>

<div class="toolbar">

<div class="search-box">

<i class="fa fa-search"></i>

<input
type="text"
placeholder="Search seller..."
onkeyup="filterAdminTable(this.value)">

</div>

</div>

</div>

<div class="table-wrap">

<table id="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Shop</th>

<th>Owner</th>

<th>Email</th>

<th>Mobile</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

`;

        sellers.forEach(seller => {

            html += `

<tr>

<td>

${seller.sellerId}

</td>

<td>

<span class="cell-title">

${safe(seller.shopName)}

</span>

<span class="cell-subtitle">

${safe(seller.category)}

</span>

</td>

<td>

${safe(seller.name)}

</td>

<td>

${safe(seller.email)}

</td>

<td>

${safe(seller.mobile)}

</td>

<td>

${statusBadge(seller.status)}

</td>

<td>

<div class="action-group">

<button
class="view-btn"
title="View Seller"
onclick="editSeller(${seller.sellerId})">

<i class="fa fa-eye"></i>

</button>

<button
class="edit-btn"
title="Edit Seller"
onclick="editSeller(${seller.sellerId})">

<i class="fa fa-edit"></i>

</button>

<button
class="delete-btn"
title="Delete Seller"
onclick="deleteSeller(${seller.sellerId})">

<i class="fa fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById("tableArea").innerHTML =
            html;

    }

    catch(error){

        console.log(error);

        showError(error.message);

    }

}


// ======================================
// DELETE SELLER
// ======================================

async function deleteSeller(id){

    if(!confirm("Delete this seller?")){

        return;

    }

    try{

        const response =
        await fetch(

            `${API_BASE_URL}/api/sellers/${id}`,

            {

                method:"DELETE"

            }

        );

        const message =
        await response.text();

        if(!response.ok){

            throw new Error(message);

        }

        alert(message);

        loadSellers();

        loadDashboard();

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}
// ======================================
// PART 4B-1
// EDIT SELLER (START)
// ======================================

async function editSeller(id) {

    try {

        showLoading("Loading Seller Details...");

        const response =
            await fetch(`${API_BASE_URL}/api/sellers/${id}`);

        if (!response.ok) {

            throw new Error("Unable to load seller details.");

        }

        const seller = await response.json();

        console.log("Seller :", seller);

        // ======================================
        // HIDDEN ID
        // ======================================

        document.getElementById("sellerId").value =
            seller.sellerId || "";

        // ======================================
        // PERSONAL INFORMATION
        // ======================================

        document.getElementById("sellerName").value =
            seller.name || "";

        document.getElementById("sellerEmail").value =
            seller.email || "";

        document.getElementById("sellerMobile").value =
            seller.mobile || "";

        document.getElementById("sellerAlternateMobile").value =
            seller.alternateMobile || "";

    document.getElementById("businessName").value =
    seller.businessName || "";

document.getElementById("businessType").value =
    seller.businessType || "";

        // ======================================
        // BUSINESS INFORMATION
        // ======================================

        document.getElementById("gstNumber").value =
            seller.gstNumber || "";

        document.getElementById("panNumber").value =
            seller.panNumber || "";

        document.getElementById("aadharNumber").value =
            seller.aadharNumber || "";

        document.getElementById("businessLicense").value =
            seller.businessLicense || "";

        // ======================================
        // SHOP INFORMATION
        // ======================================

        document.getElementById("shopName").value =
            seller.shopName || "";

        document.getElementById("shopAddress").value =
            seller.shopAddress || "";

        document.getElementById("city").value =
            seller.city || "";

        document.getElementById("state").value =
            seller.state || "";

        document.getElementById("pincode").value =
            seller.pincode || "";

        document.getElementById("category").value =
            seller.category || "";

        document.getElementById("productType").value =
            seller.productType || "";

        document.getElementById("pickupAddress").value =
            seller.pickupAddress || "";
        // ======================================
        // BANK DETAILS
        // ======================================

        document.getElementById("accountHolderName").value =
            seller.accountHolderName || "";

        document.getElementById("accountNumber").value =
            seller.accountNumber || "";

        document.getElementById("bankName").value =
            seller.bankName || "";

        document.getElementById("ifscCode").value =
            seller.ifscCode || "";

        document.getElementById("upiId").value =
            seller.upiId || "";

        // ======================================
        // NOMINEE DETAILS
        // ======================================

        document.getElementById("nomineeName").value =
            seller.nomineeName || "";

        document.getElementById("nomineeMobile").value =
            seller.nomineeMobile || "";

        // ======================================
        // IMAGE PREVIEW
        // ======================================

        const imageBase =
            `${API_BASE_URL}/uploads/`;

        const logo =
            document.getElementById("shopLogoPreview");

        const front =
            document.getElementById("shopFrontPreview");

        const inside =
            document.getElementById("shopInsidePreview");

        if (logo) {

            logo.src = seller.shopLogo
                ? imageBase + seller.shopLogo
                : "";

        }

        if (front) {

            front.src = seller.shopFrontPhoto
                ? imageBase + seller.shopFrontPhoto
                : "";

        }

        if (inside) {

            inside.src = seller.shopInsidePhoto
                ? imageBase + seller.shopInsidePhoto
                : "";

        }

        // ======================================
        // OPEN MODAL
        // ======================================

        document
            .getElementById("editSellerModal")
            .style.display = "block";

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}
// ======================================
// PART 4C-1
// UPDATE SELLER
// ======================================

async function updateSeller() {

    try {

        const seller = {

            sellerId:
                document.getElementById("sellerId").value,

            // PERSONAL

            name:
                document.getElementById("sellerName").value,

            email:
                document.getElementById("sellerEmail").value,

            mobile:
                document.getElementById("sellerMobile").value,

            alternateMobile:
                document.getElementById("sellerAlternateMobile").value,

    
            // BUSINESS

            gstNumber:
                document.getElementById("gstNumber").value,

            panNumber:
                document.getElementById("panNumber").value,

            aadharNumber:
                document.getElementById("aadharNumber").value,

            businessLicense:
                document.getElementById("businessLicense").value,

            // SHOP

            shopName:
                document.getElementById("shopName").value,

            shopAddress:
                document.getElementById("shopAddress").value,

            city:
                document.getElementById("city").value,

            state:
                document.getElementById("state").value,

            pincode:
                document.getElementById("pincode").value,

            category:
                document.getElementById("category").value,

            productType:
                document.getElementById("productType").value,

            pickupAddress:
                document.getElementById("pickupAddress").value,

            // BANK

            accountHolderName:
                document.getElementById("accountHolderName").value,

            accountNumber:
                document.getElementById("accountNumber").value,

            bankName:
                document.getElementById("bankName").value,

            ifscCode:
                document.getElementById("ifscCode").value,

            upiId:
                document.getElementById("upiId").value,

            // NOMINEE

            nomineeName:
                document.getElementById("nomineeName").value,

            nomineeMobile:
                document.getElementById("nomineeMobile").value

        };

     const response = await fetch(

    `${API_BASE_URL}/api/sellers/${seller.sellerId}`,

    {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(seller)

    }

);

        if (!response.ok) {

            throw new Error(await response.text());

        }

        alert("Seller Updated Successfully");

                closeSellerModal();

        loadSellers();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}


// ======================================
// CLOSE SELLER MODAL
// ======================================

function closeSellerModal() {

    document
        .getElementById("editSellerModal")
        .style.display = "none";

}


// ======================================
// IMAGE PREVIEW
// ======================================

function previewImage(input, previewId) {

    const preview =
        document.getElementById(previewId);

    if (!preview) return;

    if (input.files && input.files[0]) {

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;

        };

        reader.readAsDataURL(input.files[0]);

    }

}


// ======================================
// IMAGE CHANGE EVENTS
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    const logo =
        document.getElementById("shopLogo");

    if (logo) {

        logo.addEventListener("change", function () {

            previewImage(this, "shopLogoPreview");

        });

    }

    const front =
        document.getElementById("shopFrontPhoto");

    if (front) {

        front.addEventListener("change", function () {

            previewImage(this, "shopFrontPreview");

        });

    }

    const inside =
        document.getElementById("shopInsidePhoto");

    if (inside) {

        inside.addEventListener("change", function () {

            previewImage(this, "shopInsidePreview");

        });

    }

});
// ======================================
// PART 5A
// PENDING SELLERS
// ======================================

async function loadPendingSellers() {

    showLoading("Loading Pending Sellers...");

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/admin/pending-sellers`);

        if (!response.ok) {

            throw new Error("Unable to load pending sellers.");

        }

        pendingSellers = await response.json();

        if (pendingSellers.length === 0) {

            emptyState(
                "No Pending Sellers",
                "All seller registrations have been reviewed."
            );

            return;

        }

        let html = `

<div class="panel-header">

<div>

<h2>Pending Seller Approvals</h2>

<p>${pendingSellers.length} seller(s) waiting for verification</p>

</div>

<div class="toolbar">

<div class="search-box">

<i class="fa fa-search"></i>

<input
type="text"
placeholder="Search seller..."
onkeyup="filterAdminTable(this.value)">

</div>

</div>

</div>

<div class="table-wrap">

<table id="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Seller</th>

<th>Business</th>

<th>Email</th>

<th>Mobile</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

`;

        pendingSellers.forEach(seller => {

            html += `

<tr>

<td>${seller.sellerId}</td>

<td>

<div class="cell-title">
${safe(seller.name)}
</div>

<div class="cell-subtitle">
${safe(seller.shopName)}
</div>

</td>

<td>

${safe(seller.businessName)}

</td>

<td>

${safe(seller.email)}

</td>

<td>

${safe(seller.mobile)}

</td>

<td>

${statusBadge(seller.status)}

</td>

<td>

<div class="action-group">

<button
class="view-btn"
onclick="editSeller(${seller.sellerId})">

<i class="fa fa-eye"></i>
View

</button>

<button
class="approve-btn"
onclick="approveSeller(${seller.sellerId})">

<i class="fa fa-check"></i>
Approve

</button>

<button
class="reject-btn"
onclick="rejectSeller(${seller.sellerId})">

<i class="fa fa-times"></i>
Reject

</button>

</div>

</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById("tableArea").innerHTML = html;

    }

    catch (error) {

        console.log(error);

        showError(error.message);

    }

}
// ======================================
// PART 5B
// APPROVE / REJECT SELLER
// ======================================

async function approveSeller(sellerId) {

    if (!confirm("Approve this seller?")) {

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/admin/approve-seller/${sellerId}`,

            {

                method: "PUT"

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message || "Seller Approved Successfully.");

        loadPendingSellers();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}



// ======================================
// REJECT SELLER
// ======================================

async function rejectSeller(sellerId) {

    const reason = prompt("Enter rejection reason:");

    if (reason === null) {

        return;

    }

    try {

        const response = await fetch(

            `${API_BASE_URL}/api/admin/reject-seller/${sellerId}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    reason: reason

                })

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message || "Seller Rejected Successfully.");

        loadPendingSellers();

        loadDashboard();

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}
// ======================================
// PART 6A
// PRODUCT VERIFICATION
// ======================================

async function loadPendingProducts() {

    showLoading("Loading Pending Products...");

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/admin/pending-products`);

        if (!response.ok) {

            throw new Error("Unable to load pending products.");

        }

        pendingProducts = await response.json();

        if (pendingProducts.length === 0) {

            emptyState(

                "No Pending Products",

                "All products have already been verified."

            );

            return;

        }

        let html = `

<div class="panel-header">

<div>

<h2>Pending Product Verification</h2>

<p>${pendingProducts.length} product(s) waiting for verification</p>

</div>

<div class="toolbar">

<div class="search-box">

<i class="fa fa-search"></i>

<input
type="text"
placeholder="Search Product..."
onkeyup="filterAdminTable(this.value)">

</div>

</div>

</div>

<div class="table-wrap">

<table id="adminTable">

<thead>

<tr>

<th>ID</th>

<th>Image</th>

<th>Product</th>

<th>Seller</th>

<th>Category</th>

<th>Seller Price</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

`;

        pendingProducts.forEach(product => {

            html += `

<tr>

<td>

${product.productId}

</td>

<td>

<img
src="${API_BASE_URL}/api/products/image/${product.productId}"
class="table-image">

</td>

<td>

<div class="cell-title">

${safe(product.productName)}

</div>

<div class="cell-subtitle">

${safe(product.brand)}

</div>

</td>

<td>

${safe(product.seller?.shopName)}

</td>

<td>

${safe(product.category)}

</td>

<td>

${formatMoney(product.sellerPrice)}

</td>

<td>

${statusBadge(product.status)}

</td>

<td>

<button
class="verify-btn"
onclick="verifyProduct(${product.productId})">

<i class="fa fa-eye"></i>

Verify

</button>

</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById("tableArea").innerHTML = html;

    }

    catch (error) {

        console.log(error);

        showError(error.message);

    }

}

// ======================================
// PART 6B
// VERIFY PRODUCT
// ======================================

function verifyProduct(productId) {

    if (!productId) {

        alert("Invalid Product.");

        return;

    }

    localStorage.setItem(
        "verifyProductId",
        productId
    );

    window.location.href =
        `VerifyProduct.html?id=${productId}`;

}



// ======================================
// GET PRODUCT ID
// (Used inside VerifyProduct.html)
// ======================================

function getVerifyProductId() {

    const params =
        new URLSearchParams(window.location.search);

    let id = params.get("id");

    if (!id) {

        id =
        localStorage.getItem("verifyProductId");

    }

    return id;

}

async function loadProducts() {

    showLoading("Loading Products...");

    try {

        const response =
            await fetch(`${API_BASE_URL}/api/products/all`);

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        const products = await response.json();

        if (products.length === 0) {

            emptyState(
                "No Products",
                "No products found."
            );

            return;
        }

        let html = `

<div class="panel-header">

<div>

<h2>All Products</h2>

<p>Total Products : ${products.length}</p>

</div>

</div>

<div class="table-wrap">

<table id="adminTable">

<thead>

<tr>

<th>ID</th>
<th>Image</th>
<th>Product</th>
<th>Seller</th>
<th>Category</th>
<th>Price</th>
<th>Status</th>

</tr>

</thead>

<tbody>

`;

        products.forEach(product => {

            html += `

<tr>

<td>${product.productId}</td>

<td>
<img
src="${API_BASE_URL}/api/products/image/${product.productId}"
class="table-image">
</td>

<td>

<div class="cell-title">
${safe(product.productName)}
</div>

<div class="cell-subtitle">
${safe(product.brand)}
</div>

</td>

<td>
${safe(product.seller?.shopName)}
</td>

<td>
${safe(product.category)}
</td>

<td>
${formatMoney(product.finalSellingPrice)}
</td>

<td>

<div class="action-group">

<button
class="edit-btn"
onclick="editProduct(${product.productId})">

<i class="fa fa-edit"></i>

</button>

<button
class="delete-btn"
onclick="deleteProduct(${product.productId})">

<i class="fa fa-trash"></i>

</button>

<button
class="verify-btn"
onclick="sendToPending(${product.productId})">

<i class="fa fa-clock"></i>

</button>

</div>

</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById("tableArea").innerHTML = html;

    }

    catch(error){

        console.log(error);

        showError(error.message);

    }

}

async function editProduct(id){

    const response = await fetch(
        `${API_BASE_URL}/api/products/${id}`
    );

    const product = await response.json();

    const imageBase = `${API_BASE_URL}/uploads/`;

document.getElementById("productImage1").src =
    product.image ? imageBase + product.image : "";

document.getElementById("productImage2").src =
    product.image2 ? imageBase + product.image2 : "";

document.getElementById("productImage3").src =
    product.image3 ? imageBase + product.image3 : "";

document.getElementById("productImage4").src =
    product.image4 ? imageBase + product.image4 : "";

    document.getElementById("productModal").style.display="flex";

    document.getElementById("productId").value = product.productId;

    document.getElementById("productName").value = product.productName;

    document.getElementById("productBrand").value =
    product.brand || "";

document.getElementById("productCategory").value =
    product.category || "";

document.getElementById("productSeller").value =
    product.seller?.shopName || "";

document.getElementById("productSellerPrice").value =
    product.sellingPrice || 0;

document.getElementById("productFinalPrice").value =
    product.finalSellingPrice || 0;

document.getElementById("productDescription").value =
    product.description || "";

    document.getElementById("productPurchasePrice").value =
    product.purchasePrice || 0;

document.getElementById("productQuantity").value =
    product.quantity || 0;

document.getElementById("productGst").value =
    product.gstPercentage || 0;

document.getElementById("productGstAmount").value =
    product.gstAmount || 0;

document.getElementById("productColor").value =
    product.color || "";

document.getElementById("productWeight").value =
    product.weight || "";

document.getElementById("productWarranty").value =
    product.warranty || "";

document.getElementById("productModel").value =
    product.model || "";

    document.getElementById("productSize").value = product.size || "";
document.getElementById("productMaterial").value = product.material || "";
document.getElementById("productFabric").value = product.fabric || "";
document.getElementById("productGender").value = product.gender || "";
document.getElementById("productFit").value = product.fit || "";
document.getElementById("productPattern").value = product.pattern || "";
document.getElementById("productSleeve").value = product.sleeve || "";
document.getElementById("productWashCare").value = product.washCare || "";

document.getElementById("productRam").value = product.ram || "";
document.getElementById("productStorage").value = product.storage || "";
document.getElementById("productProcessor").value = product.processor || "";
document.getElementById("productBattery").value = product.battery || "";
document.getElementById("productCamera").value = product.camera || "";
document.getElementById("productDisplay").value = product.display || "";
document.getElementById("productOperatingSystem").value = product.operatingSystem || "";
document.getElementById("productNetwork").value = product.network || "";

document.getElementById("productVoltage").value = product.voltage || "";
document.getElementById("productPower").value = product.power || "";
document.getElementById("productConnectivity").value = product.connectivity || "";

document.getElementById("productDimensions").value = product.dimensions || "";
document.getElementById("productFinish").value = product.finish || "";
document.getElementById("productAssembly").value = product.assembly || "";
document.getElementById("productRoomType").value = product.roomType || "";

    document.getElementById("adminDiscount").value =
        product.adminDiscount || 0;

        calculateFinalPrice();
}  

function calculateFinalPrice() {

    const sellerPrice = Number(
        document.getElementById("productSellerPrice").value || 0
    );

    const discount = Number(
        document.getElementById("adminDiscount").value || 0
    );

    const finalPrice =
        sellerPrice - (sellerPrice * discount / 100);

    document.getElementById("productFinalPrice").value =
        finalPrice.toFixed(2);

        const finalPriceInput =
    document.getElementById("productFinalPrice");

finalPriceInput.classList.add("price-updated");

setTimeout(() => {

    finalPriceInput.classList.remove("price-updated");

},1500);
}

function closeProductModal(){

    document.getElementById("productModal").style.display = "none";

}
async function deleteProduct(id){

    if(!confirm("Delete this product?")) return;

    await fetch(
        `${API_BASE_URL}/api/products/${id}`,
        { method:"DELETE" }
    );

    loadProducts();
}
async function sendToPending(id){

    if(!confirm("Send this product for verification again?"))
        return;

    const response = await fetch(

        `${API_BASE_URL}/api/admin/${id}/pending`,

        {
            method:"PUT"
        }

    );

    if(!response.ok){

        alert(await response.text());
        return;

    }

    alert("Product sent to Pending.");

    loadProducts();

}

async function updateAdminDiscount(){

    const id =
        document.getElementById("productId").value;

    const discount =
        document.getElementById("adminDiscount").value;

    const response = await fetch(

        `${API_BASE_URL}/api/products/${id}/discount`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                adminDiscount:discount

            })

        }

    );

    if(response.ok){

        alert("Discount Updated");

        closeProductModal();

        loadProducts();

    }else{

        alert(await response.text());

    }

}

function previewProductImage(src){

    document.getElementById("previewImage").src = src;

    document.getElementById("imagePreviewModal").style.display = "flex";

}

function closeImagePreview(){

    document.getElementById("imagePreviewModal").style.display = "none";

}