let button = document.getElementById("submit");
button.addEventListener("click", async (event) => {
    event.preventDefault();

    let body = {
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value,
    }

    let message = document.getElementById("message");

    try {
        await axios.post("login", body);
        window.location.href = "/";// redirect to game page

    } catch (error) {
        message.textContent = "An error occurred";
        message.classList.add('error');
        message.classList.remove('success');
    }
});
