let button = document.getElementById("match");

button.addEventListener("click", async () => {
    try {
        let response = await axios.post("create");
        let { roomId } = response.data;
        window.location = `/game/${roomId}`;
    } catch (error) {
        console.error("There was an error creating the room:", error);
    }
});
