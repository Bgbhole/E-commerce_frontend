let user = JSON.parse(localStorage.getItem("currentUser"));
let editId = null;

window.onload = function () {
    loadAddresses();
};


// ADD / UPDATE ADDRESS
async function addAddress() {

    let data = {

        addressId: editId,
        fullName: document.getElementById("fullName").value,
        mobile: document.getElementById("mobile").value,
        fullAddress: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value

    };

    let url = `${API_BASE_URL}/api/address/add/${user.id}`;
    let method = "POST";

    // Edit mode
    if (editId != null) {
        url = `${API_BASE_URL}/api/address/update`;
        method = "PUT";
    }

    let response = await fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });

    if (response.ok) {

        alert(editId == null ?
            "Address Added Successfully"
            :
            "Address Updated Successfully");

        clearForm();

        editId = null;

        loadAddresses();

    }
}


// LOAD ALL ADDRESSES
async function loadAddresses() {

    let response = await fetch(
        `${API_BASE_URL}/api/address/${user.id}`
    );

    let addresses = await response.json();

    console.log(addresses);

    if (!Array.isArray(addresses)) {
        document.getElementById("addressList").innerHTML =
            "<h3>No addresses found</h3>";
        return;
    }

    let html = "";

    addresses.forEach(address => {

        html += `
        <div class="address-card">

            <h4>${address.fullName}</h4>

            <p>${address.fullAddress}</p>

            <p>${address.city}, ${address.state} - ${address.pincode}</p>

            <p>Mobile : ${address.mobile}</p>

            <button onclick="editAddress(
                ${address.addressId},
                '${address.fullName}',
                '${address.mobile}',
                '${address.fullAddress}',
                '${address.city}',
                '${address.state}',
                '${address.pincode}'
            )">
                Edit
            </button>

            <button onclick="deleteAddress(${address.addressId})">
                Delete
            </button>

        </div>
        `;
    });

    document.getElementById("addressList").innerHTML = html;
}


// EDIT ADDRESS
function editAddress(id, fullName, mobile, fullAddress, city, state, pincode) {

    editId = id;

    document.getElementById("fullName").value = fullName;
    document.getElementById("mobile").value = mobile;
    document.getElementById("address").value = fullAddress;
    document.getElementById("city").value = city;
    document.getElementById("state").value = state;
    document.getElementById("pincode").value = pincode;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// DELETE ADDRESS
async function deleteAddress(id) {

    let response = await fetch(
        `${API_BASE_URL}/api/address/${id}`,
        {
            method: "DELETE"
        });

    if (response.ok) {

        alert("Address Deleted");

        loadAddresses();

    }
}


// CLEAR FORM
function clearForm() {

    document.getElementById("fullName").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("pincode").value = "";

}
