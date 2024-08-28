let match = document.getElementById("match");
match.addEventListener("click", async () => {
    try {
        let response = await axios.post("create");
        let { roomId } = response.data;
        window.location = `/game/${roomId}`;
    } catch (error) {
        console.error("There was an error creating the room:", error);
    }
});

let logout = document.getElementById("logout");
logout.addEventListener("click", async () => {
    try {
        let response = await axios.post("/auth/logout");
        if (response.status === 200 || response.status === 400) {
            window.location.href = "/auth/login";
        }
    } catch (error) {
        console.error("There was an error logging out:", error);
    }
});