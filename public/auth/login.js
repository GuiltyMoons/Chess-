let button = document.getElementById("submit");
button.addEventListener("click", async (event) => {
    event.preventDefault();

    let body = {
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value,
    }

    try {
        await axios.post("/login", body);
        //TODO: after the login is successful, redirect the user to the game page

    } catch (error) {

    }
});