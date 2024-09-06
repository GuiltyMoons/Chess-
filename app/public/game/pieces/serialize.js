import Bishop from "./bishop.js";
import Knight from "./knight.js";
import Queen from "./queen.js";
import Rook from "./rook.js";
import Pawn from "./pawn.js";
import King from "./king.js";

export function serializePiece(piece) {
    if (piece.getType() === "king" || piece.getType() === "rook") {
        return {
            position: piece.getPosition(),
            player: piece.getPlayer(),
            type: piece.getType(),
            moved: piece.getMoved()
        }
    } else {
        return {
            position: piece.getPosition(),
            player: piece.getPlayer(),
            type: piece.getType()
        }
    }
}

export function deserializePiece(data) {
    switch (data.type) {
        case 'knight':
            return Knight(data.position, data.player);
        case 'queen':
            return Queen(data.position, data.player);
        case 'pawn':
            return Pawn(data.position, data.player);
        case 'rook':
            return Rook(data.position, data.player, data.moved);
        case 'bishop':
            return Bishop(data.position, data.player);
        case 'king':
            return King(data.position, data.player, data.moved);
        default:
            throw new Error('Unknown piece type: ' + data.type);
    }
}

export function serializeBoard(board) {
    return board.map(row =>
        row.map(cell =>
            typeof cell === 'object' ? serializePiece(cell) : cell
        )
    )
}

export function deserializeBoard(board) {
    return board.map(row =>
        row.map(cell =>
            typeof cell === 'object' ? deserializePiece(cell) : cell
        )
    )
}