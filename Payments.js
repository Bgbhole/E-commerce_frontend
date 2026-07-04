

let editGift = null;
let editUpi = null;
let editCard = null;

let giftCards = JSON.parse(localStorage.getItem("giftCards")) || [];
let upis = JSON.parse(localStorage.getItem("upis")) || [];
let cards = JSON.parse(localStorage.getItem("cards")) || [];

window.onload = function () {

    loadGiftCards();

    loadUpis();

    loadCards();

    document.getElementById("payAmount").innerHTML =
        localStorage.getItem("orderAmount") || 0;

}
// ================= GIFT CARD =================

function addGiftCard() {

    let cardNo = document.getElementById("giftCard").value;

    if (cardNo === "") {
        alert("Enter Gift Card Number");
        return;
    }

    let giftCard = {
        cardNo: cardNo,
        balance: 500
    };

    if (editGift != null) {
        giftCards[editGift] = giftCard;
        editGift = null;
    }
    else {
        giftCards.push(giftCard);
    }

    localStorage.setItem("giftCards", JSON.stringify(giftCards));

    document.getElementById("giftCard").value = "";

    loadGiftCards();
}

function loadGiftCards() {

    let html = "";

    giftCards.forEach((card, index) => {

        html += `
        <div class="option">

            <div class="option-left">

                <input type="radio"
                       name="paymentMethod"
                       value="gift-${index}">

                <div class="option-details">

                    <h4>Gift Card : ${card.cardNo}</h4>

                    <p>Balance : ₹${card.balance}</p>

                </div>

            </div>

            <div>

                <button class="edit-btn"
                        onclick="editGiftCard(${index})">
                    Edit
                </button>

                <button class="delete-btn"
                        onclick="deleteGiftCard(${index})">
                    Delete
                </button>

            </div>

        </div>
        `;
    });

    document.getElementById("giftCardList").innerHTML = html;
}

function editGiftCard(index) {

    document.getElementById("giftCard").value =
        giftCards[index].cardNo;

    editGift = index;
}

function deleteGiftCard(index) {

    giftCards.splice(index, 1);

    localStorage.setItem("giftCards", JSON.stringify(giftCards));

    loadGiftCards();
}


// ================= UPI =================

function addUpi() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let upi = {

        customerId: user.id,

        upiNumber: document.getElementById("upiId").value

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

        document.getElementById("upiId").value = "";

        loadUpis();

    });

}

async function loadUpis() {

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

    let response =
        await fetch(`${API_BASE_URL}/api/upis/${user.id}`);

    let upis = await response.json();

    let html = "";

    upis.forEach(upi => {

        html += `

        <div class="option">

            <input type="radio"
                   name="paymentMethod">

            <div class="option-details">

                <h4>${upi.upiNumber}</h4>

                <p>UPI Payment</p>

            </div>

        </div>

        `;

    });

    document.getElementById("upiList").innerHTML = html;

}

function editUpiData(index) {

    document.getElementById("upiId").value = upis[index];

    editUpi = index;
}

function deleteUpi(index) {

    upis.splice(index, 1);

    localStorage.setItem("upis", JSON.stringify(upis));

    loadUpis();
}


// ================= CARDS =================

function addCard() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let card = {

        customerId: user.id,

        cardHolderName:
            document.getElementById("cardName").value,

        cardNumber:
            document.getElementById("cardNumber").value,

        expiryDate:
            document.getElementById("expiryDate").value,

        cvv:
            document.getElementById("cvv").value

    };

    fetch(`${API_BASE_URL}/api/saveCard`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(card)

    })
    .then(res => res.json())
    .then(data => {

        alert("Card Saved Successfully");

        loadCards();

    });

}

async function loadCards() {

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

    let response =
        await fetch(`${API_BASE_URL}/api/cards/${user.id}`);

    let cards = await response.json();

    let html = "";

    cards.forEach(card => {

        html += `

        <div class="option">

            <input type="radio"
                   name="paymentMethod"
                   value="card-${card.cardId}">

            <div class="option-details">

                <h4>${card.cardHolderName}</h4>

                <p>
                    Card Number :
                    **** **** **** ${card.cardNumber.slice(-4)}
                </p>

                <p>
                    Expiry Date :
                    ${card.expiryDate}
                </p>

                <p>
                    CVV : ***
                </p>

            </div>

        </div>

        `;

    });

    document.getElementById("cardList").innerHTML = html;

}

function editCardData(index) {

    document.getElementById("cardName").value =
        cards[index].cardName;

    document.getElementById("cardNumber").value =
        cards[index].cardNumber;

    document.getElementById("expiryDate").value =
        cards[index].expiryDate;

    document.getElementById("cvv").value =
        cards[index].cvv;

    editCard = index;
}


function deleteCard(index) {

    cards.splice(index, 1);

    localStorage.setItem("cards", JSON.stringify(cards));

    loadCards();
}


async function payNow() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const deliveryAddressId = localStorage.getItem("deliveryAddressId");
    const billingAddressId = localStorage.getItem("billingAddressId");

    const selected = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    if (!selected) {
        alert("Please select payment method");
        return;
    }

    const paymentMethod = selected.value;

    const body = {
        userId: user.id,
        deliveryAddressId: Number(deliveryAddressId),
        billingAddressId: Number(billingAddressId),
        paymentMethod: paymentMethod
    };

    // CARD
    if (paymentMethod.startsWith("card")) {

        localStorage.setItem("orderRequest", JSON.stringify(body));

        window.location.href = "OtpPage.html";

        return;
    }

    // UPI
    if (paymentMethod.startsWith("upi")) {

        localStorage.setItem("orderRequest", JSON.stringify(body));

        window.location.href = "PaymentSuccessful.html";

        return;
    }

    // COD
    if (paymentMethod === "COD") {

    const response = await fetch(`${API_BASE_URL}/api/orders/place`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)

    });

    if (!response.ok) {

        alert("Unable to place order");
        return;

    }

    const order = await response.json();

    alert("Order Placed Successfully");

    localStorage.removeItem("deliveryAddressId");
    localStorage.removeItem("billingAddressId");
    localStorage.removeItem("orderRequest");

    window.location.href = "MyOrders.html";
}

}



