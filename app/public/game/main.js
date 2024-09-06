import boardFunc from "./board/boardFunc.js";
import { deserializePiece, serializeBoard } from "./pieces/serialize.js";
import { checkCheckMate, checkChecked } from "./movement/positionCheck.js";

let initialBoard = boardFunc.createInitialArray();
boardFunc.boardSetup(initialBoard);

initialBoard = serializeBoard(initialBoard);
const socket = io();

let checkMated = false;
let playerColor;
let currentPlayer;
let playerTurn = [];
let highlightedDiv = []
let pieceClicked;
let playersList = {};
let userId;
const input = document.getElementById("input");
const send = document.getElementById("send");
const msgs = document.getElementById("messages");

document.getElementById('open-chat').addEventListener('click', function() {
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('chat-container').style.display = 'flex';
});

document.getElementById('modal-overlay').addEventListener('click', function() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('chat-container').style.display = 'none';
});

function addMessage(msg) {
    const newMsg = document.createElement('div');
    newMsg.textContent = msg;
    msgs.appendChild(newMsg);
    msgs.scrollTop = msgs.scrollHeight;
}

function highlight(moves) {
    moves.forEach(({ row, col }) => {
        const id = `${row}-${col}`;
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove("fog");
            element.classList.add("highlight");
            highlightedDiv.push(element);
        }
    });
}

function unHighlight() {
    highlightedDiv.forEach(element => {
        element.classList.remove("highlight");
    });
    highlightedDiv = [];
    updateVisibilityForCurrentPlayer();
}

function updateVisibilityForCurrentPlayer() { //TODO: fix fog bug where captured piece is not fogged correctly for other players
    for (let row = 0; row < initialBoard.length; row++) {
        for (let col = 0; col < initialBoard[row].length; col++) {
            const tile = document.getElementById(`${row}-${col}`);
            if (tile) {
                tile.classList.add("fog");
            }
        }
    }
    for (let row = 0; row < initialBoard.length; row++) {
        for (let col = 0; col < initialBoard[row].length; col++) {
            const piece = initialBoard[row][col];
            if (typeof piece === "object" && piece.player === playerColor) {
                // Get the positions around the piece within a 1-tile radius
                for (let r = Math.max(0, row - 1); r <= Math.min(initialBoard.length - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(initialBoard[r].length - 1, col + 1); c++) {
                        const surroundingTile = document.getElementById(`${r}-${c}`);
                        if (surroundingTile) {
                            surroundingTile.classList.remove("fog");
                        }
                    }
                }
            }
        }
    }
}
function updateUI(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            const tile = document.getElementById(`${row}-${col}`);
            if (tile) {
                tile.innerHTML = "";
            }
            if (typeof piece === "object") {
                let newPiece = deserializePiece(piece);
                newPiece.render();
            }
        }
    }
};
function setUpClicks() {
    cell.removeEventListener("click", handleClicks);
    if (Object.keys(playersList).length === 4) {
        cell.addEventListener("click", handleClicks);
    }
}

function handleClicks(event) {
    const tile = event.target.closest(".tile");

    if (!tile) {
        return;
    }

    const { id } = tile;
    const [rowStr, colStr] = id.split("-");
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    const positionDict = { row, col };

    if (typeof initialBoard[row][col] === "object") {
        let piece = deserializePiece(initialBoard[row][col]);
        if (piece.getPlayer() !== playerColor) {
            if (tile.classList.contains("highlight")) {
                const previousPosition = pieceClicked.getPosition();
                pieceClicked.setPosition(positionDict, initialBoard);
                unHighlight();
                updateVisibilityForCurrentPlayer();
                playerTurn.push(playerTurn.shift());

                socket.emit("gameUpdate", {
                    from: {
                        row: previousPosition.row,
                        col: previousPosition.col
                    },
                    to: positionDict,
                    board: structuredClone(initialBoard)
                });
                pieceClicked = null;
            } else {
                alert("It's not your piece."); //can be changed to put into a msg div instead
            }
            return;
        }
        if (userId !== currentPlayer) {
            alert("It's not your turn."); //can be changed to put into a msg div instead
            return;
        }
        if (piece !== pieceClicked) {
            unHighlight();
            let moves = piece.getSafeMoves(initialBoard);
            highlight(moves);
            pieceClicked = piece;
        }
    } else if (tile.classList.contains("highlight") && pieceClicked) {
        const previousPosition = pieceClicked.getPosition();
        const currentPosition = positionDict;
        pieceClicked.setPosition(currentPosition, initialBoard);
        unHighlight();
        updateVisibilityForCurrentPlayer();
        playerTurn.push(playerTurn.shift());

        socket.emit("gameUpdate", {
            from: {
                row: previousPosition.row,
                col: previousPosition.col
            },
            to: currentPosition,
            board: structuredClone(initialBoard)
        });
        pieceClicked = null;
    }
}

socket.on("assignColor", ({ id, color }) => {
    userId = id;
    playerColor = color;
});

socket.on("playerJoined", ({ id, color, username }) => {
    playersList[id] = color;
    addMessage(`${username} has joined.`);
    setUpClicks();
    updateVisibilityForCurrentPlayer();
});

socket.on("roomFull", () => {
    alert("Room Full");
});

socket.on("gameUpdate", ({ from, to, board }) => {
    let piece = initialBoard[from.row][from.col];
    if (typeof piece === "object") {
        piece = deserializePiece(piece);
        if (piece) {
            piece.setPosition(to, initialBoard);
        }
    }
});

socket.on("playerTurn", ({ playerId, turnOrder }) => {
    playerTurn = turnOrder;
    currentPlayer = playerId;
    addMessage(`It is ${playersList[currentPlayer]}'s turn.`);
    updateVisibilityForCurrentPlayer();

    if (userId === currentPlayer) {
        if (checkMated === true) {
            if (checkMated) {
                socket.emit("checkMated",
                    userId
                )
                socket.emit("gameUpdate", {
                    from: null,
                    to: null,
                    board: initialBoard
                })
            }
        } else {
            checkMated = checkCheckMate(initialBoard, playerColor);
            if (checkMated) {
                socket.emit("checkMated",
                    userId
                )
                socket.emit("gameUpdate", {
                    from: null,
                    to: null,
                    board: initialBoard
                })
            }
        }
    }
});

socket.on("playerRejoined", ({ id, color, board, username }) => { 
    playersList[id] = color;
    addMessage(`${username} has rejoined.`)
    if (userId === id) {
        initialBoard = structuredClone(board);
        updateUI(initialBoard);
        updateVisibilityForCurrentPlayer(); 
    };
    setUpClicks();
});

socket.on("playerLeft", ({ id, username }) => {
    addMessage(`${username} has left.`);
    delete playersList[id];
    setUpClicks();
});

socket.on("playerList", ( playerList ) => {
    playersList = playerList.reduce((acc, { id, color }) => {
        acc[id] = color;
        return acc;
    }, {});
});

socket.on("winner", ({ winner }) => {

    alert(`Player ${playersList[winner]} wins!`);
} )

document.addEventListener('DOMContentLoaded', () => {
    socket.on("message", (msg) => {
        addMessage(msg);
    });

    send.addEventListener("click", () => {
        const msg = input.value.trim();
        if (msg) {
            socket.emit("message", msg);
            input.value = "";
        }
    });

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            send.click();
        }
    });

});