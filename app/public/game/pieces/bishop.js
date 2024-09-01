import Piece from './piece.js'
import { getNonFiniteMoves } from '../movement/movement.js';
import { bishopDirections } from '../movement/direction.js';

const imgSources = {
	blue: '/game/imgs/blue/bBishop.png',
	green: '/game/imgs/green/gBishop.png',
	red: '/game/imgs/red/rBishop.png',
	yellow: '/game/imgs/yellow/yBishop.png'
};

function Bishop(starting, player){
	let piece = Piece(starting, player, "bishop");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function getPossibleMoves(boardState){
		return getNonFiniteMoves(boardState, bishopDirections, piece.getPosition(), piece.getPlayer());
	}
	return {
		...piece,
		getPossibleMoves
	}
}

export default Bishop;
