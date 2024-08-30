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