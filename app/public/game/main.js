import boardFunc from "./board/boardFunc.js";

let initialBoard = boardFunc.createInitialArray();
boardFunc.boardSetup(initialBoard);

const socket = io();

let playerTurn = ["blue", "green", "red", "yellow"];
let highlightedDiv = [];
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

function updateVisibilityForCurrentPlayer() {
    const currentPlayer = playerTurn[0];

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
            if (typeof piece === "object" && piece.getPlayer() === currentPlayer) {
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
        if (initialBoard[row][col].getPlayer() === playerTurn[0]) {
            let piece = initialBoard[row][col];
            if (piece !== pieceClicked) {
                unHighlight();
                let moves = piece.getPossibleMoves(initialBoard);
                highlight(moves);
                pieceClicked = piece;
            } else {
                return;
            }
        }
    }

    if (tile.classList.contains("highlight") && pieceClicked) {
        const previousPosition = pieceClicked.getPosition();
        const currentPosition = positionDict;
        pieceClicked.setPosition(currentPosition, initialBoard);
        unHighlight();
        playerTurn.push(playerTurn.shift());
        updateVisibilityForCurrentPlayer();

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

socket.on("gameUpdate", ({ from, to }) => {
    const piece = initialBoard[from.row][from.col];
    if (piece) {
        piece.setPosition(to, initialBoard);
    }
});

// Initial visibility setup when the board is first set up
updateVisibilityForCurrentPlayer();