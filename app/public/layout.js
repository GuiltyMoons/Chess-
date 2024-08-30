async function fetchUsername() {
    try {
        let res = await axios.post("username");
        
        let usernameContainer = document.getElementById('username');
        let textNode = usernameContainer.childNodes[0];
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = res.data.username;
        } else {
            usernameContainer.insertBefore(document.createTextNode(res.data.username), usernameContainer.firstChild);
        }
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

fetchUsername();

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

//TODO: What happens if a user logs out of an in-progress game?