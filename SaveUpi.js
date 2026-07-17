window.onload = function () {

    loadUpis();

}

function addUpi() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let upiNumber = document.getElementById("upiInput").value;

    if (upiNumber == "") {

        alert("Enter UPI ID");

        return;

    }

    let upi = {

        customerId: user.id,

        upiNumber: upiNumber

    };

    fetch(`${API_BASE_URL}/api/saveUpi`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(upi)

    })
    .then(response => response.json())
    .then(data => {

        alert("UPI Saved Successfully");

        document.getElementById("upiInput").value = "";

        loadUpis();

    });

}


async function loadUpis() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) return;

    let response =
    await fetch(`${API_BASE_URL}/api/upi/${user.id}`);

    const upis = await response.json();

    let html = "";

   upis.forEach(upi => {

    html += `
    <div class="card">

        <div class="upi-info">
            <h3>${upi.upiNumber}</h3>
        </div>

        <div class="upi-buttons">

            <button class="edit-btn"
                onclick="editUpi(${upi.upiId}, '${upi.upiNumber}')">
                Edit
            </button>

            <button class="delete-btn"
                onclick="deleteUpi(${upi.upiId})">
                Delete
            </button>

        </div>

    </div>
    `;

});

    document.getElementById("upiList").innerHTML = html;

}

async function editUpi(upiId, oldUpi) {

    let newUpi = prompt("Edit UPI", oldUpi);

    if (!newUpi || newUpi.trim() === "") return;

    await fetch(`${API_BASE_URL}/api/upi/${upiId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            upiNumber: newUpi

        })

    });

    loadUpis();

}

async function deleteUpi(upiId) {

    if (!confirm("Are you sure you want to delete this UPI?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/api/upi/${upiId}`, {
        method: "DELETE"
    });

    loadUpis();

}

