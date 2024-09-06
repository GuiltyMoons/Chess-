import Piece from './piece.js'
import { getFiniteMoves } from '../movement/movement.js';
import { rookDirections, bishopDirections } from '../movement/direction.js';
import { getCastlingMoves } from '../movement/positionCheck.js';
import { deserializePiece, serializePiece } from './serialize.js';

const imgSources = {
	blue: '/game/imgs/blue/bKing.png',
	green: '/game/imgs/green/gKing.png',
	red: '/game/imgs/red/rKing.png',
	yellow: '/game/imgs/yellow/yKing.png'
};

function King(starting, player, moved = false){
	let move = moved;
	let piece = Piece(starting, player, "king");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	const directions = [...rookDirections, ...bishopDirections];

	function handleMovingCastle(boardState, closestRookPosition) {
		let rook, newRookPos, newKingPos, thisRow, thisCol;
		if (this.getPlayer() === "blue" || this.getPlayer() === "red") {
			if (typeof boardState[closestRookPosition.row][closestRookPosition.col + 1] === "object") {
				rook = boardState[closestRookPosition.row][closestRookPosition.col + 1];
				thisRow = this.getPlayer() === "blue" ? 0 : 13;
				newRookPos = {row: thisRow, col:7};
				newKingPos = {row: thisRow, col:8};
			} else {
				rook = boardState[closestRookPosition.row][closestRookPosition.col - 1];
				thisRow = this.getPlayer() === "blue" ? 0 : 13;
				newRookPos = {row: thisRow, col: 5};
				newKingPos = {row: thisRow, col: 4};
			}
		} else {
			if (typeof boardState[closestRookPosition.row + 1][closestRookPosition.col] === "object") {
				rook = boardState[closestRookPosition.row + 1][closestRookPosition.col]
				thisCol = this.getPlayer() === "yellow" ? 0 : 13;
				newRookPos = {row: 7, col: thisCol};
				newKingPos = {row: 8, col: thisCol};
			} else {
				rook = boardState[closestRookPosition.row -1][closestRookPosition.col];
				thisCol = this.getPlayer() === "yellow" ? 0 : 13;
				newRookPos = {row: 5, col: thisCol};
				newKingPos = {row: 4, col: thisCol};
			}
		}
		this.setPosition(newKingPos, boardState);
		deserializePiece(rook).setPosition(newRookPos, boardState);
	}

	function getCastling(boardState, kingPosition, player, moved){
		return getCastlingMoves(boardState, kingPosition, player, moved)
	}

	function getPossibleMoves(boardState){
		return getFiniteMoves(boardState, directions, piece.getPosition(), piece.getPlayer());
	}
	return {
		...piece,
		getMoved: () => move,
		getPossibleMoves,
		getCastling,
		setMoved: (moved) => move = moved ,
		handleMovingCastle
	}
}

export default King;
