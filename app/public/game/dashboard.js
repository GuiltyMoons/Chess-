let username = document.getElementById("username");

async function fetchUsername() {
    try {
        let res = await axios.post("username");
        username.textContent = res.data.username;
    } catch (error) {
        username.textContent = "error";
        console.error("Error retreiving username: ", error);
    }    
}
fetchUsername();

let match = document.getElementById("match");
match.addEventListener("click", async () => {
    try {
        let res = await axios.post("create");
        let { roomId } = res.data;
        window.location = `/game/${roomId}`;
    } catch (error) {
        console.error("There was an error creating the room:", error);
    }
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