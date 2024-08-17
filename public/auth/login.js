let button = document.getElementById("submit");
button.addEventListener("click", async (event) => {
    event.preventDefault();

    let body = {
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value,
    }

    let message = document.getElementById("message");

    try {
        //TODO: currently redirects you to game page after login, but should actually make cookies and direct you to main site
        await axios.post("login", body);
        window.location.href = "/"; // redirect to game page

    } catch (error) {
        message.textContent = error.response.data.message;
        message.classList.add('error');
        message.classList.remove('success');
    }
});
