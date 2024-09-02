import boardFunc from "./board/boardFunc.js";
import { deserializePiece, serializeBoard, deserializeBoard } from "./pieces/serialize.js";

let initialBoard = boardFunc.createInitialArray();
boardFunc.boardSetup(initialBoard);

initialBoard = serializeBoard(initialBoard);
const socket = io();

let playerColor;
let currentPlayer;
let playerTurn = [];
let highlightedDiv = []
let pieceClicked;
let playersList = {};
let userId;

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
                console.log("pturn", playerTurn);
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
            let moves = piece.getPossibleMoves(initialBoard);
            highlight(moves);
            pieceClicked = piece;
        }
    } else if (tile.classList.contains("highlight") && pieceClicked) {
        console.log("pturn2", playerTurn);
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
    console.log(`${userId} is ${color}`);
    playerColor = color;
});

socket.on("playerJoined", ({ id, color }) => {
    console.log(color, "has joined");
    playersList[id] = color;
    setUpClicks();
    updateVisibilityForCurrentPlayer();
});

socket.on("roomFull", () => {
    alert("Room Full");
});

socket.on("gameUpdate", ({ from, to, board }) => {
    const piece = deserializePiece(initialBoard[from.row][from.col]);
    if (piece) {
        piece.setPosition(to, initialBoard);
    }
});

socket.on("playerTurn", ({ playerId, turnOrder }) => {
    console.log(playerId, "turn");
    console.log("turnorder", turnOrder);
    playerTurn = turnOrder;
    currentPlayer = playerId;
    updateVisibilityForCurrentPlayer();
});

socket.on("playerRejoined", ({ id, color, board }) => { 
    console.log(color, "has rejoined");
    playersList[id] = color;
    if (userId === id) {
        initialBoard = structuredClone(board);
        console.log("totalplayers", playersList);
        updateUI(initialBoard);
        updateVisibilityForCurrentPlayer(); 
    };
    setUpClicks();
});

socket.on("playerLeft", ({ id }) => {
    delete playersList[id];
    setUpClicks();
});

socket.on("playerList", ( playerList ) => {
    playersList = playerList.reduce((acc, { id, color }) => {
        acc[id] = color;
        return acc;
    }, {});
});