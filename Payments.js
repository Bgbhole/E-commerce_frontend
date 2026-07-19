

let editGift = null;
let editUpi = null;
let editCard = null;

let giftCards = [];
let upis = [];
let cards = [];

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

async function saveUpi() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const upiId = document.getElementById("upiId").value;
    const upiValue = document.getElementById("upiValue").value.trim();

    if (upiValue === "") {
        alert("Enter UPI ID");
        return;
    }

    let response;

    if (upiId === "") {

        response = await fetch(`${API_BASE_URL}/api/saveUpi`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customerId: user.id,
                upiNumber: upiValue
            })

        });

    } else {

        response = await fetch(`${API_BASE_URL}/api/upi/${upiId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                upiNumber: upiValue
            })

        });

    }

    if (response.ok) {

        closeUpiModal();

        document.getElementById("upiId").value = "";
        document.getElementById("upiValue").value = "";

        loadUpis();

    } else {

        alert("Unable to save UPI");

    }

}

async function loadUpis() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const response = await fetch(`${API_BASE_URL}/api/upi/${user.id}`);

    const upis = await response.json();

    let html = "";

    const displayUpis = upis.slice(0, 4);

    displayUpis.forEach(upi => {

        html += `
        <div class="upi-card">

            <div class="upi-left">

                <input
                    type="radio"
                    name="paymentMethod"
                    value="upi-${upi.upiId}">

                <div class="upi-details">

                    <div class="upi-title">
                        ${upi.upiNumber}
                    </div>

                    <div class="upi-id">
                        UPI Payment
                    </div>

                </div>

            </div>

            <div class="upi-actions">

                <button
                    class="edit-upi"
                    onclick="editUpiData(${upi.upiId}, '${upi.upiNumber}')">

                    Edit

                </button>

                <button
                    class="delete-upi"
                    onclick="deleteUpiData(${upi.upiId})">

                    Delete

                </button>

            </div>

        </div>
        `;

    });

    if (upis.length > 4) {

        html += `
        <div style="text-align:center;margin-top:15px;">
            <button class="add-upi-btn"
                    onclick="window.location.href='SaveUpi.html'">

                View All UPI IDs

            </button>
        </div>
        `;

    }

    document.getElementById("upiList").innerHTML = html;

}

function editUpiData(upiId, upiNumber){

    document.getElementById("upiId").value = upiId;

    document.getElementById("upiValue").value = upiNumber;

    openUpiModal();

}

async function deleteUpiData(upiId){

    if(!confirm("Delete this UPI?")) return;

    await fetch(`${API_BASE_URL}/api/upi/${upiId}`,{

        method:"DELETE"

    });

    loadUpis();

}


// ================= CARDS =================

function addCard() {

    let user = JSON.parse(localStorage.getItem("currentUser"));

    let cardName = document.getElementById("cardName").value.trim();
    let cardNumber = document.getElementById("cardNumber").value.trim();
    let expiryDate = document.getElementById("expiryDate").value.trim();
    let cvv = document.getElementById("cvv").value.trim();

    if (cardName === "") {
        alert("Please enter Card Holder Name");
        return;
    }

    if (cardNumber === "") {
        alert("Please enter Card Number");
        return;
    }

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        alert("Card Number must be 16 digits");
        return;
    }

    if (expiryDate === "") {
        alert("Please enter Expiry Date");
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert("Expiry Date should be in MM/YY format");
        return;
    }

    if (cvv === "") {
        alert("Please enter CVV");
        return;
    }

    if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits");
        return;
    }

    let card = {

        customerId: user.id,
        cardHolderName: cardName,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv

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

        document.getElementById("cardName").value = "";
        document.getElementById("cardNumber").value = "";
        document.getElementById("expiryDate").value = "";
        document.getElementById("cvv").value = "";

        loadCards();

    });

}

async function loadCards() {

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

    let response =
        await fetch(`${API_BASE_URL}/api/cards/${user.id}`);

   cards = await response.json();

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
   
   const selectedValue = selected.value;
   let paymentMethod = selected.value;

if (selectedValue.startsWith("card")) {

    const card =
        cards.find(c => c.cardId == paymentMethod.split("-")[1]);

    paymentMethod =
        "Card **** " + card.cardNumber.slice(-4);

}

if (paymentMethod.startsWith("upi")) {

    const upiId =
        document.querySelector('input[name="paymentMethod"]:checked')
        .parentElement
        .querySelector("h4").innerText;

    paymentMethod = `UPI (${upiId})`;

}

    const body = {
        userId: user.id,
        deliveryAddressId: Number(deliveryAddressId),
        billingAddressId: Number(billingAddressId),
        paymentMethod: paymentMethod
    };

    // CARD
  if (selectedValue.startsWith("card")) {

    const selectedCard = document.querySelector('input[name="paymentMethod"]:checked');

    if (!selectedCard) {
        alert("Please select a saved card");
        return;
    }

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

   window.location.replace("MyOrders.html"); 
}

}


function openUpiModal() {

    document.getElementById("upiModal").classList.add("show");

}

function closeUpiModal() {

    document.getElementById("upiModal").classList.remove("show");
}
