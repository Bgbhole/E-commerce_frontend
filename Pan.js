function savePan(){

    let holderName =
        document.getElementById("holderName").value;

    let panNumber =
        document.getElementById("panNumber").value;

    document.getElementById("panDetails").innerHTML = `
        <h3>Saved PAN Details</h3>
        <p><b>Name :</b> ${holderName}</p>
        <p><b>PAN Number :</b> ${panNumber}</p>
    `;

    alert("PAN Details Saved Successfully");
}

function resetPan(){

    document.getElementById("holderName").value = "";
    document.getElementById("panNumber").value = "";
    document.getElementById("panImage").value = "";

    document.getElementById("panDetails").innerHTML = "";
}