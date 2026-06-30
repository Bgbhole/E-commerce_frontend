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

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let response =
        await fetch(`${API_BASE_URL}/api/upis/${user.id}`);

    let upis = await response.json();

    let html = "";

    upis.forEach(upi => {

        html += `

        <div class="card">

            <h3>${upi.upiNumber}</h3>

        </div>

        `;

    });

    document.getElementById("upiList").innerHTML = html;

}