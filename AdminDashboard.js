const admin = JSON.parse(localStorage.getItem("currentAdmin"));

if (!admin) {
  alert("Please login as Admin.");

  window.location.href = "admin-log.html";
}

window.onload = function () {
  loadDashboard();
};

function showPage(page) {
  document.getElementById("pageTitle").innerHTML =
    page.charAt(0).toUpperCase() + page.slice(1);

  switch (page) {
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
      document.getElementById("tableArea").innerHTML = "<h2>Orders</h2>";
      break;

    case "transactions":
      document.getElementById("tableArea").innerHTML = "<h2>Transactions</h2>";
      break;

    case "complaints":
      document.getElementById("tableArea").innerHTML = "<h2>Complaints</h2>";
      break;

    default:
      loadDashboard();
  }
}
function openTab(event, tabName) {
  let tabContent = document.getElementsByClassName("tab-content");

  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  let tabButtons = document.getElementsByClassName("tab-btn");

  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";

  event.currentTarget.classList.add("active");
}

function closeSellerModal() {
  document.getElementById("editSellerModal").style.display = "none";
}

function clearSellerImages() {

    document.getElementById("shopLogoPreview").src = "";

    document.getElementById("shopFrontPreview").src = "";

    document.getElementById("shopInsidePreview").src = "";

}

async function loadDashboard() {
  document.getElementById("pageTitle").innerHTML = "Dashboard";

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);

    if (!response.ok) {
      throw new Error("Unable to load dashboard");
    }

    const dashboard = await response.json();

    // Dashboard Cards
    document.getElementById("usersCount").innerHTML = dashboard.totalUsers;

    document.getElementById("sellerCount").innerHTML = dashboard.totalSellers;

    document.getElementById("orderCount").innerHTML = dashboard.totalOrders;

    document.getElementById("productCount").innerHTML = dashboard.totalProducts;

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
  } catch (error) {
    console.log(error);

    alert("Unable to load dashboard.");
  }
}

function logout() {
  localStorage.removeItem("currentAdmin");

  window.location.href = "admin-log.html";
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

    users.forEach((user) => {
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

    sellers.forEach((seller) => {
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
  } catch (error) {
    console.log(error);

    alert(error);
  }
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) {
    return;
  }

  let response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
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

async function deleteSeller(id) {
  if (!confirm("Delete this seller?")) return;

  let response = await fetch(`${API_BASE_URL}/api/sellers/${id}`, {
    method: "DELETE",
  });

  let message = await response.text();

  if (response.ok) {
    alert(message);

    loadSellers();
  } else {
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
 


  document.getElementById("editUserModal").style.display = "block";
}

async function updateUser() {

    const id = document.getElementById("editUserId").value;

    const user = {

        id: id,

        firstName: document.getElementById("editFirstName").value,

        lastName: document.getElementById("editLastName").value,

        email: document.getElementById("editEmail").value,

        mobile: document.getElementById("editMobile").value,

        gender: document.getElementById("editGender").value,

        dateOfBirth: document.getElementById("editDob").value,

        address: document.getElementById("editAddress").value,

        city: document.getElementById("editCity").value,

        state: document.getElementById("editState").value,

        pincode: document.getElementById("editPincode").value,

        country: document.getElementById("editCountry").value,


    };

    console.log(user);

    const response = await fetch(`${API_BASE_URL}/api/users/update`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    });

    if (response.ok) {

        alert("User Updated Successfully");

        closeUserModal();

        loadUsers();

    } else {

        alert(await response.text());

    }

}

function closeUserModal() {
  document.getElementById("editUserModal").style.display = "none";
}

async function editSeller(id) {

    try {

        const response = await fetch(`${API_BASE_URL}/api/sellers/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load seller details");
        }

        const seller = await response.json();

        console.log("Seller Data :", seller);

        // Hidden Id
        document.getElementById("sellerId").value =
            seller.sellerId || "";

        // Personal
        document.getElementById("sellerName").value =
            seller.name || "";

        document.getElementById("sellerEmail").value =
            seller.email || "";

        document.getElementById("sellerMobile").value =
            seller.mobile || "";

        document.getElementById("sellerAlternateMobile").value =
            seller.alternateMobile || "";

        document.getElementById("sellerPassword").value =
            seller.password || "";

    

        // Business

        document.getElementById("gstNumber").value =
            seller.gstNumber || "";

        document.getElementById("panNumber").value =
            seller.panNumber || "";

        document.getElementById("aadharNumber").value =
            seller.aadharNumber || "";

        document.getElementById("businessLicense").value =
            seller.businessLicense || "";

        // Shop

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

        // Bank

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

        // Nominee

        document.getElementById("nomineeName").value =
            seller.nomineeName || "";

        document.getElementById("nomineeMobile").value =
            seller.nomineeMobile || "";

       // ================= IMAGE PREVIEW =================

const logo = seller.shopLogo || "";

const front = seller.shopFrontPhoto || "";

const inside = seller.shopInsidePhoto || "";

document.getElementById("shopLogoPreview").src =
    logo
        ? `${API_BASE_URL}/uploads/${logo}`
        : "";

document.getElementById("shopFrontPreview").src =
    front
        ? `${API_BASE_URL}/uploads/${front}`
        : "";

document.getElementById("shopInsidePreview").src =
    inside
        ? `${API_BASE_URL}/uploads/${inside}`
        : "";
        // Show Modal

        document.getElementById("editSellerModal").style.display =
            "block";

        // First Tab

        document.querySelectorAll(".tab-content")
            .forEach(tab => tab.style.display = "none");

        document.getElementById("personal").style.display =
            "block";

        document.querySelectorAll(".tab-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelector(".tab-btn")
            .classList.add("active");

    }
    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

async function updateSeller() {

    try {

        const seller = {

            sellerId: document.getElementById("sellerId").value,

            // Personal
            name: document.getElementById("sellerName").value,
            email: document.getElementById("sellerEmail").value,
            mobile: document.getElementById("sellerMobile").value,
            alternateMobile: document.getElementById("sellerAlternateMobile").value,
            password: document.getElementById("sellerPassword").value,
           

            // Business
            gstNumber: document.getElementById("gstNumber").value,
            panNumber: document.getElementById("panNumber").value,
            aadharNumber: document.getElementById("aadharNumber").value,
            businessLicense: document.getElementById("businessLicense").value,

            // Shop
            shopName: document.getElementById("shopName").value,
            shopAddress: document.getElementById("shopAddress").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            pincode: document.getElementById("pincode").value,
            category: document.getElementById("category").value,
            productType: document.getElementById("productType").value,
            pickupAddress: document.getElementById("pickupAddress").value,

            // Bank
            accountHolderName: document.getElementById("accountHolderName").value,
            accountNumber: document.getElementById("accountNumber").value,
            bankName: document.getElementById("bankName").value,
            ifscCode: document.getElementById("ifscCode").value,
            upiId: document.getElementById("upiId").value,

            // Nominee
            nomineeName: document.getElementById("nomineeName").value,
            nomineeMobile: document.getElementById("nomineeMobile").value
        };

        console.log("Updating Seller:", seller);

        const response = await fetch(
            `${API_BASE_URL}/api/sellers/update`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(seller)
            }
        );

        if (!response.ok) {

            const message = await response.text();

            throw new Error(message);

        }

        alert("Seller Updated Successfully");

        closeSellerModal();

        loadSellers();

    }
    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

async function loadPendingSellers() {
  document.getElementById("pageTitle").innerHTML = "Seller Confirmation";

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-sellers`);

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

    sellers.forEach((seller) => {
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
  } catch (error) {
    console.log(error);

    alert(error.message);
  }
}

async function approveSeller(id) {
  if (!confirm("Approve this seller?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/approve-seller/${id}`,

      {
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Unable to approve seller");
    }

    alert("Seller Approved Successfully");

    loadPendingSellers();

    loadDashboard();
  } catch (error) {
    console.log(error);

    alert(error.message);
  }
}

async function rejectSeller(id) {
  if (!confirm("Reject this seller?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/reject-seller/${id}`,

      {
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Unable to reject seller");
    }

    alert("Seller Rejected Successfully");

    loadPendingSellers();

    loadDashboard();
  } catch (error) {
    console.log(error);

    alert(error.message);
  }
}

async function loadPendingProducts() {
  document.getElementById("pageTitle").innerHTML = "Product Approval";

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-products`);

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

    products.forEach((product) => {
      html += `

            <tr>

                <td>

                    <img src="${API_BASE_URL}/api/products/image/${product.productId}"
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
  } catch (error) {
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
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Unable to approve product");
    }

    alert("Product Approved Successfully");

    loadPendingProducts();

    loadDashboard();
  } catch (error) {
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
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Unable to reject product");
    }

    alert("Product Rejected Successfully");

    loadPendingProducts();

    loadDashboard();
  } catch (error) {
    console.log(error);

    alert(error.message);
  }
}

function logout() {
  localStorage.removeItem("currentAdmin");

  window.location.href = "admin-log.html";
}
/* Redesigned admin workspace */
function safe(value, fallback = "?") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}

function setLoading(message = "Loading data?") {
  document.getElementById("tableArea").innerHTML =
    `<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i> ${message}</div>`;
}

function emptyState(icon, title, message) {
  return `<div class="empty-state"><i class="fa-solid ${icon}"></i><h3>${title}</h3><p>${message}</p></div>`;
}

function errorState(message) {
  document.getElementById("tableArea").innerHTML =
    `<div class="error-state"><i class="fa-solid fa-triangle-exclamation"></i><h3>Something went wrong</h3><p>${safe(message)}</p></div>`;
}

function statusBadge(status) {
  const value = String(status || "Unknown");
  return `<span class="status ${value.toLowerCase()}">${safe(value)}</span>`;
}

function filterAdminTable(query) {
  const term = query.toLowerCase().trim();
  document.querySelectorAll("#adminTable tbody tr").forEach((row) => {
    row.style.display = row.textContent.toLowerCase().includes(term)
      ? ""
      : "none";
  });
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
}

function enhanceAdminShell() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.id = "sidebar";
  const items = [...sidebar.querySelectorAll("li")];
  items.forEach((item) => {
    const action = item.getAttribute("onclick") || "";
    const match = action.match(/showPage\('([^']+)'/);
    if (match) item.dataset.page = match[1];
    if (match && match[1] === "complaints") item.remove();
    if (match && match[1] === "confirmation") {
      item.childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim())
          node.textContent = " Seller approvals ";
      });
      item.insertAdjacentHTML(
        "beforeend",
        '<span class="nav-badge" id="sellerApprovalBadge">0</span>',
      );
    }
    if (match && match[1] === "products") {
      item.childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim())
          node.textContent = " Product approvals ";
      });
      item.insertAdjacentHTML(
        "beforeend",
        '<span class="nav-badge" id="productApprovalBadge">0</span>',
      );
    }
    if (match && match[1] === "transactions")
      item.childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim())
          node.textContent = " Payments ";
      });
  });
  const topbar = document.querySelector(".topbar");
  topbar.innerHTML = `<div class="title-group"><button class="menu-toggle" onclick="toggleSidebar()" aria-label="Toggle navigation"><i class="fa-solid fa-bars"></i></button><div><p class="eyebrow">ADMIN CONSOLE</p><h1 id="pageTitle">Dashboard</h1></div></div><div class="admin-profile"><span class="avatar"><i class="fa-solid fa-user-shield"></i></span><div><strong>${safe(admin.name || admin.email || "Administrator")}</strong><small>Platform admin</small></div></div>`;
  const cardData = [
    [
      "usersCount",
      "Total customers",
      "Registered accounts",
      "fa-users",
      "blue",
    ],
    [
      "sellerCount",
      "Total sellers",
      "Marketplace partners",
      "fa-store",
      "violet",
    ],
    [
      "orderCount",
      "Total orders",
      "Orders placed",
      "fa-cart-shopping",
      "amber",
    ],
    ["productCount", "Total products", "Catalog items", "fa-box-open", "green"],
  ];
  document.querySelector(".cards").id = "summaryCards";
  document.querySelectorAll(".card").forEach((card, index) => {
    const [id, label, note, icon, color] = cardData[index];
    card.innerHTML = `<div class="card-icon ${color}"><i class="fa-solid ${icon}"></i></div><div><h3>${label}</h3><p id="${id}">0</p><small>${note}</small></div>`;
  });
}

document.addEventListener("DOMContentLoaded", enhanceAdminShell);

function setActivePage(page, clickedItem) {
  document
    .querySelectorAll(".sidebar li")
    .forEach((item) =>
      item.classList.toggle(
        "active",
        item === clickedItem || item.dataset.page === page,
      ),
    );
  document.getElementById("summaryCards").style.display =
    page === "dashboard" ? "grid" : "none";
  document.querySelector(".sidebar").classList.remove("open");
}

async function loadOrders() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/orders`);

        if (!response.ok) {
            throw new Error("Unable to load orders");
        }

        const orders = await response.json();

        let html = `
        <h2>All Orders</h2>

        <table id="adminTable">

        <tr>

        <th>Order ID</th>
        <th>Customer</th>
        <th>Seller</th>
        <th>Shop</th>
        <th>Total</th>
        <th>Payment</th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>

        </tr>
        `;

        orders.forEach(order => {

            html += `

            <tr>

            <td>${order.orderId}</td>

            <td>${order.user ?
                order.user.firstName + " " + order.user.lastName
                : "-"}</td>

            <td>${order.sellerName || "-"}</td>

            <td>${order.shopName || "-"}</td>

            <td>₹${order.totalAmount}</td>

            <td>${order.paymentStatus}</td>

            <td>${order.status}</td>

            <td>${new Date(order.orderDate).toLocaleDateString()}</td>

<td>

<button class="edit-btn"
onclick="editOrder(${order.orderId})">

<i class="fa fa-edit"></i>

Edit

</button>

</td>

            </tr>

            `;

        });

        html += "</table>";

        document.getElementById("tableArea").innerHTML = html;

    }
    catch (e) {

        console.log(e);

        alert("Unable to load orders");

    }

}

async function editOrder(id){

    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`);

    const order = await response.json();

    document.getElementById("editOrderId").value = order.orderId;

    document.getElementById("editDeliveryName").value = order.deliveryName;

    document.getElementById("editDeliveryMobile").value = order.deliveryMobile;

    document.getElementById("editDeliveryAddress").value = order.deliveryAddress;

    document.getElementById("editDeliveryCity").value = order.deliveryCity;

    document.getElementById("editDeliveryState").value = order.deliveryState;

    document.getElementById("editDeliveryPincode").value = order.deliveryPincode;

    document.getElementById("editOrderStatus").value = order.status;

    document.getElementById("editOrderModal").style.display = "block";

}

function closeOrderModal(){

    document.getElementById("editOrderModal").style.display =
    "none";

}

async function updateOrder() {

    const id = document.getElementById("editOrderId").value;

    const body = {

        deliveryName: document.getElementById("editDeliveryName").value,
        deliveryMobile: document.getElementById("editDeliveryMobile").value,
        deliveryAddress: document.getElementById("editDeliveryAddress").value,
        deliveryCity: document.getElementById("editDeliveryCity").value,
        deliveryState: document.getElementById("editDeliveryState").value,
        deliveryPincode: document.getElementById("editDeliveryPincode").value

    };

    console.log("Order ID:", id);
    console.log("Request Body:", body);

    const response = await fetch(
        `${API_BASE_URL}/api/orders/update/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    );

    console.log("Status:", response.status);

    const result = await response.text();

    console.log("Response:", result);

    if (response.ok) {

        alert("Order Updated Successfully");

        closeOrderModal();

        loadOrders();

    } else {

        alert(result);

    }
}

function showPage(page, clickedItem) {

    setActivePage(page, clickedItem);

    const titles = {
        dashboard: "Dashboard",
        users: "Customers",
        sellers: "Sellers",
        confirmation: "Seller Approvals",
        products: "Product Approvals",
        orders: "Orders",
        transactions: "Payments"
    };

    document.getElementById("pageTitle").textContent =
        titles[page] || "Admin";

    if (page === "dashboard") return loadDashboard();

    if (page === "users") return loadUsers();

    if (page === "sellers") return loadSellers();

    if (page === "confirmation") return loadPendingSellers();

    if (page === "products") return loadPendingProducts();

    if (page === "orders") return loadOrders();

    document.getElementById("tableArea").innerHTML = "";
}



async function loadDashboard() {
  setActivePage("dashboard");
  document.getElementById("pageTitle").textContent = "Dashboard";
  setLoading("Loading dashboard?");
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
    if (!response.ok) throw new Error("The dashboard service is unavailable.");
    const data = await response.json();
    document.getElementById("usersCount").textContent = data.totalUsers ?? 0;
    document.getElementById("sellerCount").textContent = data.totalSellers ?? 0;
    document.getElementById("orderCount").textContent = data.totalOrders ?? 0;
    document.getElementById("productCount").textContent =
      data.totalProducts ?? 0;
    const sellerBadge = document.getElementById("sellerApprovalBadge");
    const productBadge = document.getElementById("productApprovalBadge");
    if (sellerBadge) sellerBadge.textContent = data.pendingSellers ?? 0;
    if (productBadge) productBadge.textContent = data.pendingProducts ?? 0;
    document.getElementById("tableArea").innerHTML =
      `<div class="dashboard-grid"><section class="quick-panel"><h2>Review centre</h2><p>Items that need an administrator decision.</p><div class="review-list"><div class="review-item"><i class="fa-solid fa-store"></i><div><strong>${data.pendingSellers ?? 0} seller applications</strong><small>Review business and shop details</small></div><button onclick="showPage('confirmation')">Review</button></div><div class="review-item"><i class="fa-solid fa-box"></i><div><strong>${data.pendingProducts ?? 0} product submissions</strong><small>Check product information before publishing</small></div><button onclick="showPage('products')">Review</button></div></div></section><section class="quick-panel"><h2>Platform overview</h2><p>A quick snapshot of marketplace activity.</p><div class="review-list"><div class="review-item"><i class="fa-solid fa-chart-line"></i><div><strong>${data.totalOrders ?? 0} total orders</strong><small>Across ${data.totalUsers ?? 0} registered customers</small></div></div><div class="review-item"><i class="fa-solid fa-cubes"></i><div><strong>${data.totalProducts ?? 0} catalog products</strong><small>Managed by ${data.totalSellers ?? 0} sellers</small></div></div></div></section></div>`;
  } catch (error) {
    errorState(error.message);
  }
}

async function loadUsers() {
  setLoading("Loading customers?");
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) throw new Error("Unable to load customers.");
    const users = await response.json();
    const rows = users
      .map(
        (user) =>
          `<tr><td><span class="cell-title">#${safe(user.id)}</span></td><td><span class="cell-title">${safe(`${user.firstName || ""} ${user.lastName || ""}`.trim())}</span><span class="cell-subtitle">${safe(user.email)}</span></td><td>${safe(user.mobile)}</td><td>${safe(user.city || user.address)}</td><td>${statusBadge(user.status || "Active")}</td><td><div class="action-group"><button class="edit-btn" title="Edit customer" onclick="editUser(${user.id})"><i class="fa-solid fa-pen"></i></button><button class="delete-btn" title="Delete customer" onclick="deleteUser(${user.id})"><i class="fa-solid fa-trash"></i></button></div></td></tr>`,
      )
      .join("");
    document.getElementById("tableArea").innerHTML =
      `<div class="panel-header"><div><h2>Customers</h2><p>${users.length} registered customer${users.length === 1 ? "" : "s"}</p></div><div class="toolbar"><label class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Search customers" oninput="filterAdminTable(this.value)"></label></div></div>${users.length ? `<div class="table-wrap"><table id="adminTable"><thead><tr><th>ID</th><th>Customer</th><th>Mobile</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("fa-users", "No customers found", "Registered customers will appear here.")}`;
  } catch (error) {
    errorState(error.message);
  }
}

async function loadSellers() {
  setLoading("Loading sellers?");
  try {
    const response = await fetch(`${API_BASE_URL}/api/sellers`);
    if (!response.ok) throw new Error("Unable to load sellers.");
    const sellers = await response.json();
    const rows = sellers
      .map(
        (seller) =>
          `<tr><td><span class="cell-title">#${safe(seller.sellerId)}</span></td><td><span class="cell-title">${safe(seller.shopName)}</span><span class="cell-subtitle">${safe(seller.name)}</span></td><td>${safe(seller.email)}<span class="cell-subtitle">${safe(seller.mobile)}</span></td><td>${statusBadge(seller.status)}</td><td><div class="action-group"><button class="edit-btn" title="Edit seller" onclick="editSeller(${seller.sellerId})"><i class="fa-solid fa-pen"></i></button><button class="approve-btn" title="Approve seller" onclick="approveSeller(${seller.sellerId})"><i class="fa-solid fa-check"></i></button><button class="reject-btn" title="Reject seller" onclick="rejectSeller(${seller.sellerId})"><i class="fa-solid fa-xmark"></i></button><button class="delete-btn" title="Delete seller" onclick="deleteSeller(${seller.sellerId})"><i class="fa-solid fa-trash"></i></button></div></td></tr>`,
      )
      .join("");
    document.getElementById("tableArea").innerHTML =
      `<div class="panel-header"><div><h2>Seller management</h2><p>${sellers.length} marketplace seller${sellers.length === 1 ? "" : "s"}</p></div><div class="toolbar"><label class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Search sellers" oninput="filterAdminTable(this.value)"></label></div></div>${sellers.length ? `<div class="table-wrap"><table id="adminTable"><thead><tr><th>ID</th><th>Shop and owner</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("fa-store", "No sellers found", "Seller registrations will appear here.")}`;
  } catch (error) {
    errorState(error.message);
  }
}

async function loadPendingSellers() {
  setLoading("Loading seller applications?");
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-sellers`);
    if (!response.ok) throw new Error("Unable to load seller applications.");
    const sellers = await response.json();
    const rows = sellers
      .map(
        (seller) =>
          `<tr><td><span class="cell-title">${safe(seller.shopName)}</span><span class="cell-subtitle">#${safe(seller.sellerId)}</span></td><td>${safe(seller.name)}</td><td>${safe(seller.email)}<span class="cell-subtitle">${safe(seller.mobile)}</span></td><td>${statusBadge(seller.status)}</td><td><div class="action-group"><button class="edit-btn" onclick="editSeller(${seller.sellerId})" title="Review details"><i class="fa-solid fa-eye"></i></button><button class="approve-btn" onclick="approveSeller(${seller.sellerId})">Approve</button><button class="reject-btn" onclick="rejectSeller(${seller.sellerId})">Reject</button></div></td></tr>`,
      )
      .join("");
    document.getElementById("tableArea").innerHTML =
      `<div class="panel-header"><div><h2>Seller approvals</h2><p>Review business details before allowing sellers onto the marketplace.</p></div></div>${sellers.length ? `<div class="table-wrap"><table><thead><tr><th>Shop</th><th>Owner</th><th>Contact</th><th>Status</th><th>Decision</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("fa-circle-check", "No pending sellers", "All seller applications have been reviewed.")}`;
  } catch (error) {
    errorState(error.message);
  }
}

async function loadPendingProducts() {
  setLoading("Loading product submissions?");
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending-products`);
    if (!response.ok) throw new Error("Unable to load product submissions.");
    const products = await response.json();
    const rows = products
      .map(
        (product) =>
          `<tr><td><img src="${API_BASE_URL}/uploads/${encodeURIComponent(product.image || "")}" alt="" width="52" height="52" style="object-fit:cover;border-radius:10px"></td><td><span class="cell-title">${safe(product.productName)}</span><span class="cell-subtitle">${safe(product.brand)}</span></td><td>${safe(product.category)}</td><td>${safe(product.seller?.shopName)}</td><td>?${safe(product.finalPrice || product.price || 0)}</td><td>${statusBadge(product.status)}</td><td><div class="action-group"><button class="approve-btn" onclick="approveProduct(${product.productId})">Approve</button><button class="reject-btn" onclick="rejectProduct(${product.productId})">Reject</button></div></td></tr>`,
      )
      .join("");
    document.getElementById("tableArea").innerHTML =
      `<div class="panel-header"><div><h2>Product approvals</h2><p>Verify product quality and information before publishing.</p></div></div>${products.length ? `<div class="table-wrap"><table><thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Seller</th><th>Price</th><th>Status</th><th>Decision</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("fa-circle-check", "No pending products", "All product submissions have been reviewed.")}`;
  } catch (error) {
    errorState(error.message);
  }
}
