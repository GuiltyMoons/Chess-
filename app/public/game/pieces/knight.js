import Piece from './piece.js'
import { getFiniteMoves } from '../movement/movement.js';
import { knightDirections } from '../movement/direction.js';

const imgSources = {
	blue: '/game/imgs/blue/bKnight.png',
	green: '/game/imgs/green/gKnight.png',
	red: '/game/imgs/red/rKnight.png',
	yellow: '/game/imgs/yellow/yKnight.png'
};

function Knight(starting, player){
	let piece = Piece(starting, player);
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function getPossibleMoves(boardState){
		return getFiniteMoves(boardState, knightDirections, piece.getPosition(), piece.getPlayer());
	}
	return {
		...piece,
		getPossibleMoves
	}
}

export default Knight;
