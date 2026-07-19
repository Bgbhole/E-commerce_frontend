/* ==========================================
   COMMON.JS
========================================== */

function showLoading(message = "Loading...") {
    document.getElementById("tableArea").innerHTML = `
        <div class="loading">
            <i class="fa fa-spinner fa-spin"></i>
            <p>${message}</p>
        </div>
    `;
}

function showEmpty(message = "No data found") {
    document.getElementById("tableArea").innerHTML = `
        <div class="empty">
            <i class="fa fa-box-open"></i>
            <h2>${message}</h2>
        </div>
    `;
}

function showError(message) {
    document.getElementById("tableArea").innerHTML = `
        <div class="empty">
            <i class="fa fa-circle-exclamation"></i>
            <h2>${message}</h2>
        </div>
    `;
}

/* ==========================================
   TOAST
========================================== */

function showToast(message, success = true) {

    const toast = document.createElement("div");

    toast.className = success ? "toast" : "toast error";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    },3000);

}

/* ==========================================
   MONEY
========================================== */

function money(amount){

    if(amount==null) return "₹0";

    return "₹"+Number(amount).toLocaleString("en-IN",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
    });

}

/* ==========================================
   DATE
========================================== */

function formatDate(date){

    if(!date) return "-";

    return new Date(date).toLocaleString();

}

/* ==========================================
   STATUS BADGE
========================================== */

function statusBadge(status){

    if(!status) return "";

    let css="inactive";

    switch(status.toUpperCase()){

        case "ACTIVE":
            css="active";
            break;

        case "PENDING":
            css="pending";
            break;

        case "REJECTED":
            css="rejected";
            break;

        case "PROCESSING":
            css="processing";
            break;

        case "DELIVERED":
            css="delivered";
            break;

        case "CANCELLED":
            css="cancelled";
            break;

    }

    return `<span class="status ${css}">${status}</span>`;

}

/* ==========================================
   SEARCH
========================================== */

function searchTable(){

    const keyword=document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#tableArea tbody tr")
        .forEach(row=>{

            row.style.display=
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

        });

}

/* ==========================================
   MODAL
========================================== */

function openModal(id){

    document
    .getElementById(id)
    .classList
    .add("active");

}

function closeModal(id){

    document
    .getElementById(id)
    .classList
    .remove("active");

}

/* ==========================================
   FETCH
========================================== */

async function api(url,options={}){

    try{

        const response=await fetch(
            API_BASE_URL+url,
            {
                headers:{
                    "Content-Type":"application/json"
                },
                ...options
            }
        );

        if(!response.ok){

            throw new Error(await response.text());

        }

        if(response.status===204){

            return null;

        }

        return await response.json();

    }

    catch(error){

        console.error(error);

        showToast(error.message,false);

        throw error;

    }

}

/* ==========================================
   LOGOUT
========================================== */

function logout(){

    if(confirm("Logout?")){

        localStorage.removeItem("currentAdmin");

        window.location.href="AdminLogin.html";

    }

}

/* ==========================================
   PAGE TITLE
========================================== */

function setTitle(title){

    document.getElementById("pageTitle").innerText=title;

}

/* ==========================================
   CONFIRM
========================================== */

function confirmAction(message){

    return confirm(message);

}