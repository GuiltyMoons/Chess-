let button = document.getElementById("submit");
button.addEventListener("click", async (event) => {
    event.preventDefault();

    let body = {
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value,
    }

    let message = document.getElementById("message");

    try {
        await axios.post("/auth/login", body);
        window.location.href = "/game/dashboard";

    } catch (error) {
        message.textContent = error.response.data.message;
        message.classList.add('error');
        message.classList.remove('success');
    }
});