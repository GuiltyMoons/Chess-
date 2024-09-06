import { deserializePiece } from "/game/pieces/serialize.js";

function findKing(board, player) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let piece = board[row][col];
            if (typeof piece === "object") {
                if (piece.type === "king" && piece.player === player) {
                    return { row, col };
                }
            }
        }
    }
    return null;
}

export function outOfBound(boardState, row, col){
	if (row < 0 || row >= boardState.length || col < 0 || col >= boardState[0].length 
		|| boardState[row][col] === 0){
			return true;
		}
	return false;
}

export function checkChecked(board, playerColor) {
    const kingPosition = findKing(board, playerColor)
    return board.some(row =>
        row.some(piece => {
            if (typeof piece === "object" && piece.player !== playerColor) {
                const actualPiece = deserializePiece(piece);
                const moves = actualPiece.getPossibleMoves(board);
                return moves.some(move =>
                    move.row === kingPosition.row && move.col === kingPosition.col
                );
            }
            return false; 
        })
    );
}

export function checkCheckMate(board, playerColor) {
    if (!checkChecked(board, playerColor)) {
        return false;
    }

    for (let row of board) {
        for (let piece of row) {
            if (typeof piece === "object" && piece.player === playerColor) {
                const actualPiece = deserializePiece(piece);
                const possibleMoves = actualPiece.getSafeMoves(board);
                if (possibleMoves.length > 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

export function legalMoves(boardState, currentPosition, availableMoves, color) {
	let moves = []
	let copyBoard;
	let piece;

	for (let move of availableMoves) {
		copyBoard = structuredClone(boardState);
		piece = copyBoard[currentPosition.row][currentPosition.col];
		piece.position = move;
		copyBoard[move.row][move.col] = piece;
		copyBoard[currentPosition.row][currentPosition.col] = 1;
		if (!checkChecked(copyBoard, color)){
			moves.push(move);
		}
	}
	return moves;
}

export function isPastMiddle(position, player) {
    switch (player) {
        case 'blue':
            if (position.row >= 6 ) {
                return true;
            }
            break;
        case 'red':
            if (position.row <= 7 ) {
                return true;
            }
            break;
        case 'green':
            if (position.col <= 7 ) {
                return true;
            }
            break;
        case 'yellow':
            if (position.col >= 6 ) {
                return true
            }
            break;
    }
    return false;
}

export function getCastlingMoves(boardState, kingPosition, player, moved) {
    let castleMoves = []

    if (moved) return castleMoves;

    const objectsOnly = boardState.flat().filter(piece => typeof piece === "object");
    const rooks = objectsOnly.filter(piece =>
        piece.type === "rook" &&
        piece.player === player &&
        !piece.moved
    );


    for (let rook of rooks) {
        let direction, adjacent, concerningTiles, valid;
        if (player === "blue" || player === "red") {
            direction = kingPosition.col - rook.position.col > 0 ? 1 : -1
            adjacent = kingPosition.col - direction;
            if (!deserializePiece(rook).getPossibleMoves(boardState).some(pos => pos.col === adjacent)) continue; 

            concerningTiles = deserializePiece(rook).getPossibleMoves(boardState).filter(pos => pos.row === kingPosition.row);
        } else {
            direction = kingPosition.row - rook.position.row > 0 ? 1 : -1
            adjacent = kingPosition.row - direction;

            if (!deserializePiece(rook).getPossibleMoves(boardState).some(pos => pos.row === adjacent)) continue; 

            concerningTiles = deserializePiece(rook).getPossibleMoves(boardState).filter(pos => pos.col === kingPosition.col);
        }

        valid = true;
        const enemyPieces = objectsOnly.filter(piece => piece.player !== player);

        for (const enemy of enemyPieces) {
            let realEnemy = deserializePiece(enemy)
            if (realEnemy.getPossibleMoves(boardState).length === 0) continue;
            for (const move of realEnemy.getPossibleMoves(boardState)) {
                if (concerningTiles.some(t => t.row === move.row && t.col === move.col)){
                    valid = false;
                }
                if (!valid)
                    break;
            }
            if (!valid)
                break;
        }

        if (!valid) continue;
        if (player === "blue" || player === "red") {
            castleMoves.push({row : rook.position.row, col: rook.position.col + direction, closest: rook});
        } else {
            castleMoves.push({row : rook.position.row + direction, col: rook.position.col, closest: rook});
        }
    }

    return castleMoves;
}