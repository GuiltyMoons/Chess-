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