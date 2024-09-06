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

let joinButton = document.getElementById("join");
joinButton.addEventListener("click", () => {
    let roomCodeInput = document.getElementById("roomCode").value;

    if (roomCodeInput) {
        window.location = `/game/${roomCodeInput}`;
    } else {
        alert("Please enter a room code.");
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