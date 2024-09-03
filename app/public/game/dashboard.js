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

let join = document.getElementById("join");
join.addEventListener("click", async () => {
    let roomCodeInput = document.getElementById("roomCode").value;
    if (roomCodeInput.length !== 4) {
        alert("Room code must be a 4-letter code.");
        return;
    }

    try {
        let res = await axios.post("join", { roomCode: roomCodeInput });
        let { roomId } = res.data;
        window.location = `/game/${roomId}`;
    } catch (error) {
        console.error("There was an error joining the room:", error);
        alert("Failed to join room. Please check the room code and try again.");
    }
});

const modal = document.getElementById("howToPlayModal");
const btn = document.getElementById("howToPlayBtn");
const span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "flex";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}