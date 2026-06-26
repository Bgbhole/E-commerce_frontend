let editCardId = null;

window.onload = function () {

    loadCards();

}

function addCard() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let card = {

        customerId: user.id,
        cardHolderName: document.getElementById("cardName").value,
        cardNumber: document.getElementById("cardNumber").value,
        expiryDate: document.getElementById("expiryDate").value,
        cvv: document.getElementById("cvv").value

    };

    let url = `${API_BASE_URL}/api/saveCard`;
    let method = "POST";

    if (editCardId != null) {

        url = `${API_BASE_URL}/api/updateCard/${editCardId}`;
        method = "PUT";

    }

    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(card)

    })
        .then(res => res.json())
        .then(data => {

            alert(editCardId == null ? "Card Saved Successfully" : "Card Updated Successfully");

            editCardId = null;

            clearForm();

            loadCards();

        });

}

function editCard(id, name, number, expiry, cvv) {

    editCardId = id;

    document.getElementById("cardName").value = name;
    document.getElementById("cardNumber").value = number;
    document.getElementById("expiryDate").value = expiry;
    document.getElementById("cvv").value = cvv;

}

function deleteCard(cardId) {

    fetch(`${API_BASE_URL}/api/deleteCard/${cardId}`, {

        method: "DELETE"

    })
        .then(() => {

            alert("Card Deleted Successfully");

            loadCards();

        });

}

async function loadCards() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let response =
        await fetch(`${API_BASE_URL}/api/cards/${user.id}`);

    let cards = await response.json();

    let html = "";

    cards.forEach(card => {

        html += `

        <div class="card">

            <h3>${card.cardHolderName}</h3>

            <p>
                Card Number :
                **** **** **** ${card.cardNumber.slice(-4)}
            </p>

            <p>
                Expiry Date :
                ${card.expiryDate}
            </p>

            <button onclick="editCard(${card.cardId},
            '${card.cardHolderName}',
            '${card.cardNumber}',
            '${card.expiryDate}',
            '${card.cvv}')">

                Edit

            </button>

            <button onclick="deleteCard(${card.cardId})">

                Delete

            </button>

        </div>

        `;

    });

    document.getElementById("cardList").innerHTML = html;

}

function clearForm() {

    document.getElementById("cardName").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("expiryDate").value = "";
    document.getElementById("cvv").value = "";

}