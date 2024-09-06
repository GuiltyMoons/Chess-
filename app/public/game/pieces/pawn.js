import Piece from './piece.js'
import { getPawnMoves } from '../movement/movement.js';
import Queen from './queen.js';

const imgSources = {
	blue: '/game/imgs/blue/bPawn.png',
	green: '/game/imgs/green/gPawn.png',
	red: '/game/imgs/red/rPawn.png',
	yellow: '/game/imgs/yellow/yPawn.png'
};

function Pawn(starting, player){
	let piece = Piece(starting, player, "pawn");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function handlePromotion(boardState, newPosition) {
		let newPiece = Queen(this.getPosition(), this.getPlayer());
		newPiece.setPosition(newPosition, boardState);
	}

	function getPossibleMoves(boardState){
		return getPawnMoves(boardState, piece.getPosition(), piece.getPlayer());
	}

	return {
		...piece,
		getPossibleMoves,
		handlePromotion
	}
}

export default Pawn;
