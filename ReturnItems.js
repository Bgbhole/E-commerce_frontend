window.onload = loadReturns;

async function loadReturns(){

    let response =
    await fetch("http://localhost:8080/api/returns");

    let returns = await response.json();

    let html="";

    returns.forEach(item=>{

        html+=`
        <tr>

            <td>${item.orderId}</td>
            <td>${item.productName}</td>
            <td>${item.customerName}</td>
            <td>${item.reason}</td>
            <td>${item.status}</td>

            <td>

                <button class="approve"
                onclick="approveReturn(${item.returnId})">
                Approve
                </button>

                <button class="reject"
                onclick="rejectReturn(${item.returnId})">
                Reject
                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById("tbody").innerHTML=html;
}