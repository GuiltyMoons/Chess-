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
