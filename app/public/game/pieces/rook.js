import Piece from './piece.js'
import { getNonFiniteMoves } from '../movement/movement.js';
import { rookDirections } from '../movement/direction.js';

const imgSources = {
	blue: '/game/imgs/blue/bRook.png',
	green: '/game/imgs/green/gRook.png',
	red: '/game/imgs/red/rRook.png',
	yellow: '/game/imgs/yellow/yRook.png'
};

function Rook(starting, player, moved){
	let move = moved;
	let piece = Piece(starting, player, "rook");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function getPossibleMoves(boardState){
		return getNonFiniteMoves(boardState, rookDirections, piece.getPosition(), piece.getPlayer());
	}

	return {
		...piece,
		getMoved: () => move,
		getPossibleMoves,
		setMoved: (moved) => move = moved 
	}
}

export default Rook;