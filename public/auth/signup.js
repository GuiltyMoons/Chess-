const message = document.getElementById("message");
const button = document.getElementById("submit");

button.addEventListener("click", async (event) => {
    event.preventDefault();

    const body = {
        username: document.getElementById("username-input").value, //TODO: database breaks if you put in a chinese character...
        email: document.getElementById("email-input").value,
        password: document.getElementById("password-input").value,
    }

    try {
        const response = await axios.post("signup", body);

        message.textContent = response.data.message;
        message.classList.add('success');
        message.classList.remove('error');
    } catch (error) {
        message.textContent = error.response.data.message;
        message.classList.add('error');
        message.classList.remove('success');
    }
});