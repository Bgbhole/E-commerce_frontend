async function registerAdmin() {

let admin = {

    firstName:
        document.getElementById("firstName").value,

    lastName:
        document.getElementById("lastName").value,

    companyIdNumber:
        document.getElementById("CompanyIdNumber").value,

    email:
        document.getElementById("email").value,

    mobile:
        document.getElementById("mobile").value,

    password:
        document.getElementById("password").value
};

let confirmPassword =
    document.getElementById("confirmPassword").value;

if(admin.password !== confirmPassword){

    alert("Passwords do not match");
    return;
}

let response = await fetch(
    "http://localhost:8080/api/admin/register",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(admin)
    }
);

if(response.ok){

    alert("Admin Registered Successfully");

    window.location.href =
        "admin-log.html";
}
else{

    alert("Registration Failed");
}


}
