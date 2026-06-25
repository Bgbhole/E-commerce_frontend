async function register(event) {
    event.preventDefault();

    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let mobile = document.getElementById("mobile").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let user = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        mobile: mobile,
        password: password,
        role: "USER"
    };

    try {
        let response = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert("Registration Successful");
            window.location.href = "loginpage.html";
        } else {
            let error = await response.text();
            alert("Registration Failed: " + error);
        }

    } catch (err) {
        console.error(err);
        alert("Server Error");
    }
}


async function login() {

    let role = document.getElementById("role").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = {
        email: email,
        password: password
    };

    let url = "";

    if (role === "customer") {
        url = "http://localhost:8080/api/login";
    } else {
        url = "http://localhost:8080/api/sellers/login";
    }

    try {

        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {

            let data = await response.json();

            if (role === "customer") {

                localStorage.setItem("currentUser", JSON.stringify(data));
                window.location.href = "index.html";

            } else {

                localStorage.setItem("currentSeller", JSON.stringify(data));
                window.location.href = "Seller-Dashboard.html";

            }

        } else {

            alert("Invalid Email or Password");

        }

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }
}
