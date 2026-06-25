window.onload = function () {

    document.getElementById("payAmount").innerHTML =
        localStorage.getItem("orderAmount") || 0;

    loadGiftCards();
    loadUpis();
    loadCards();
};


// ---------- Gift Cards ----------

function loadGiftCards() {

    let giftCards =
        JSON.parse(localStorage.getItem("giftCards")) || [];

    let html = "";

    giftCards.forEach((card, index) => {

        html += `
        <div class="payment-option">

            <input type="radio"
                   name="payment"
                   value="gift-${index}">

            Gift Card : ${card.cardNo}

            <br>

            Balance : ₹${card.balance}

        </div>
        `;
    });

    document.getElementById("giftCardList").innerHTML = html;
}


// ---------- UPI ----------

function loadUpis() {

    let upis =
        JSON.parse(localStorage.getItem("upis")) || [];

    let html = "";

    upis.forEach((upi, index) => {

        html += `
        <div class="payment-option">

            <input type="radio"
                   name="payment"
                   value="upi-${index}">

            ${upi}

        </div>
        `;
    });

    document.getElementById("upiList").innerHTML = html;
}


// ---------- Cards ----------

function loadCards() {

    let cards =
        JSON.parse(localStorage.getItem("cards")) || [];

    let html = "";

    cards.forEach((card, index) => {

        html += `
        <div class="payment-option">

            <input type="radio"
                   name="payment"
                   value="card-${index}">

            ${card.cardName}

            <br>

            ****${card.cardNumber.slice(-4)}

        </div>
        `;
    });

    document.getElementById("cardList").innerHTML = html;
}


// ---------- Pay ----------

function payNow() {

    let selected =
        document.querySelector('input[name="payment"]:checked');

    if (!selected) {

        alert("Please select a payment method");

        return;
    }

    let amount =
        Number(localStorage.getItem("orderAmount"));

    let value = selected.value;


    // Gift Card Payment
    if (value.startsWith("gift")) {

        let index = value.split("-")[1];

        let giftCards =
            JSON.parse(localStorage.getItem("giftCards")) || [];

        let giftCard = giftCards[index];

        if (giftCard.balance >= amount) {

            giftCard.balance -= amount;

            localStorage.setItem(
                "giftCards",
                JSON.stringify(giftCards));

            alert("Payment Successful using Gift Card");

        }
        else {

            alert("Insufficient Gift Card Balance");

            return;
        }
    }
    else if (value.startsWith("upi")) {

        alert("Payment Successful using UPI");

    }
    else {

        alert("Payment Successful using Card");

    }

    // Clear cart after payment
    localStorage.removeItem("cart");

    window.location.href = "OrderSuccess.html";
}