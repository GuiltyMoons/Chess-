async function fetchInfo() {
    try {
        let res = await axios.post("info");
        
        let usernameContainer = document.getElementById('username');
        let textNode = usernameContainer.childNodes[0];
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = res.data.username;
        } else {
            usernameContainer.insertBefore(document.createTextNode(res.data.username), usernameContainer.firstChild);
        }

        let winsElement = document.getElementById("user-wins");
        winsElement.textContent = `Wins: ${res.data.wins}`
    } catch (error) {
        let usernameContainer = document.getElementById('username');
        let textNode = usernameContainer.childNodes[0];

        if (textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = "error";
        } else {
            usernameContainer.insertBefore(document.createTextNode("error"), usernameContainer.firstChild);
        }
        
        console.error("Error retrieving username: ", error);
    }    
}
fetchInfo();

document.addEventListener("DOMContentLoaded", function () {
    const usernameContainer = document.getElementById('username');
    const dropdownMenu = usernameContainer.querySelector('.dropdown-menu');

    usernameContainer.addEventListener('click', function () {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function (event) {
        if (!usernameContainer.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
});

let logout = document.getElementById("logout");
logout.addEventListener("click", async () => {
    try {
        let res = await axios.post("/auth/logout");
        if (res.status === 200 || res.status === 400) {
            window.location.href = "/auth/login";
        }
    } catch (error) {
        console.error("There was an error logging out:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const colors = ["#0000B2", "#00B200", "#B20000", "#B2B200", "#0000B2"];
    let colorIndex = 0;

    const titleElements = document.querySelectorAll('h1, .title');
    const buttonElements = document.querySelectorAll('button, .username-container');

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