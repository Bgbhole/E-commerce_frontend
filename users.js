let users = JSON.parse(localStorage.getItem("users")) || [];

displayUsers();

function displayUsers(){

    let box = document.getElementById("users");

    box.innerHTML = "";

    users.forEach((user,index)=>{

        box.innerHTML += `
        <div class="user">

            <h2>${user.name}</h2>

            <p>Email : ${user.email}</p>

            <button onclick="deleteUser(${index})">
                Delete User
            </button>

        </div>
        `;
    });
}

function deleteUser(index){

    users.splice(index,1);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    displayUsers();

}