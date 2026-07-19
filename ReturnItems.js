window.onload = loadReturns;

async function loadReturns(){

    let response =
    await fetch(`${API_BASE_URL}/api/returns`);

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
<div class="action-group">

<button class="verify-btn"
onclick="verifyProduct(${product.productId})">

<i class="fa fa-eye"></i> Verify

</button>

</div>
</td>
        </tr>
        `;
    });

    document.getElementById("tbody").innerHTML=html;
}