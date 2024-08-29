

const message = document.getElementById("message");
const button = document.getElementById("submit");

button.addEventListener("click", async (event) => {
    event.preventDefault();

    const password = document.getElementById("password-input").value;
    const confirmPassword = document.getElementById("confirm-password-input").value;

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.classList.add('error');
        message.classList.remove('success');
        return;
    }

    const body = {
        username: document.getElementById("username-input").value,
        email: document.getElementById("email-input").value,
        password: password,
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