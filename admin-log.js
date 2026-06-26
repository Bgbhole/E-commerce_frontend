async function adminLogin() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (response.ok) {

        let admin = await response.json();

        localStorage.setItem("currentAdmin", JSON.stringify(admin));

        alert("Login Successful");

        window.location.href = "AdminDashboard.html";

    } else {

        alert("Invalid Email or Password");

    }
}