let button = document.getElementById("submit");
button.addEventListener("click", async (event) => {
    event.preventDefault();

    let body = {
        username: document.getElementById("username-input").value,
        email: document.getElementById("email-input").value,
        password: document.getElementById("password-input").value, //TODO: hashing might have to occur before the body is sent to the server...?
    }

    let message = document.getElementById("message");

    try {
        await axios.post("/signup", body);

        message.textContent = "User created successfully";
        message.classList.add('success');
        message.classList.remove('error');
    } catch (error) {
        message.textContent = "An error occurred";
        message.classList.add('error');
        message.classList.remove('success');
    }
});