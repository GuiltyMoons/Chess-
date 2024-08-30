

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

//Easier to just duplicate the code.
document.addEventListener("DOMContentLoaded", function () {
    const colors = ["#0000B2", "#00B200", "#B20000", "#B2B200", "#0000B2"];
    let colorIndex = 0;

    const titleElements = document.querySelectorAll('h1, .title');
    const buttonElements = document.querySelectorAll('button');

    function applyColor(element, isButton = false) {
        if (isButton) {
            element.style.backgroundColor = colors[colorIndex];
        } else {
            element.style.color = colors[colorIndex];
        }
        colorIndex = (colorIndex + 1) % colors.length;
    }

    titleElements.forEach((element) => {
        element.addEventListener('mouseenter', function () {
            applyColor(this);
        });
    });

    buttonElements.forEach((element) => {
        element.addEventListener('mouseenter', function () {
            applyColor(this, true);
        });
    });
});