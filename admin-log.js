async function adminLogin() {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {

        alert("Please enter Email and Password");

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        if (!response.ok) {

            throw new Error("Invalid Email or Password");

        }

        const admin = await response.json();

        localStorage.setItem(
            "currentAdmin",
            JSON.stringify(admin)
        );

        alert("Login Successful");

        window.location.href = "AdminDashboard.html";

    }
    catch (error) {

        console.log(error);

        alert(error.message);

    }

}