import { serializePiece } from "./serialize.js";
import { legalMoves } from "../movement/positionCheck.js";

function Piece(starting, player, pieceType) {
	let p = player;
	let type = pieceType;
	let currentPosition = starting;
	let previousPosition;
	let dom = document.createElement("div");

	function getSafeMoves(boardState) {
		let moves = this.getPossibleMoves(boardState);
		return legalMoves(boardState, this.getPosition(), moves, this.getPlayer());
	}

	function getPosition(){
		return currentPosition;
	}

	function setPosition(newPosition, boardState){
		previousPosition = currentPosition;
		currentPosition = newPosition;
		if(typeof boardState[currentPosition.row][currentPosition.col] === "object"){
			unrender(currentPosition);
		}
		boardState[currentPosition.row][currentPosition.col] = serializePiece(this);
		boardState[previousPosition.row][previousPosition.col] = 1;

		unrender(previousPosition);
		render();
	}

	const render = () => {
		const id = `${currentPosition.row}-${currentPosition.col}`;
		const parent = document.getElementById(id);
        parent.classList.add('fog');
		parent.append(dom);
	}

	const unrender = (position) =>{
		const id = `${position.row}-${position.col}`;
		const parent = document.getElementById(id);
        parent.classList.remove('fog');
		while (parent.firstChild){
			parent.removeChild(parent.lastChild);
		}
	}

	return {
		dom,
		getPlayer: () => p,
		getType: () => type,
		getPosition,
		setPosition,
		unrender,
		render,
		getSafeMoves
	}
}

export default  Piece;
