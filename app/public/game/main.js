import boardFunc from "./board/boardFunc.js";

let initialBoard = boardFunc.createInitialArray();
boardFunc.boardSetup(initialBoard);

const socket = io();

let playerColor;
let currentPlayer;
let playerTurn = [];
let playersJoined = {};
let highlightedDiv = []
let pieceClicked;

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
            if (typeof piece === "object" && piece.getPlayer() === playerColor) {
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

cell.addEventListener("click", (event) => {
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
        let piece = initialBoard[row][col];
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
                    to: positionDict
                });
                pieceClicked = null;
            } else {
                alert("It's not your piece."); //can be changed to put into a msg div instead
            }
            return;
        }
        if (socket.id !== currentPlayer) {
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
            to: currentPosition
        });
        pieceClicked = null;
    }
});

socket.on("assignColor", ({ color }) => {
    playerColor = color;
    console.log(`Your color is ${playerColor}`); //can be changed to put into a msg div instead
});

socket.on("playerJoined", ({ id, color }) => {
    playersJoined[id] = color;
    console.log(`${color} player joined`);//can be changed to put into a msg div instead
    updateVisibilityForCurrentPlayer();
});

socket.on("roomFull", () => {
    alert("Room Full");
});

socket.on("gameUpdate", ({ from, to }) => {
    const piece = initialBoard[from.row][from.col];
    if (piece) {
        piece.setPosition(to, initialBoard);
    }
});

socket.on("playerTurn", ({ playerId, turnOrder }) => {
    console.log("your turn", playerId); //can be changed to put into a msg div instead
    playerTurn = turnOrder;
    currentPlayer = playerId;
    if (socket.id === playerId) {
        updateVisibilityForCurrentPlayer();
    }
});
