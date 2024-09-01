import Piece from './piece.js'
import { getFiniteMoves } from '../movement/movement.js';
import { rookDirections, bishopDirections } from '../movement/direction.js';

const imgSources = {
	blue: '/game/imgs/blue/bKing.png',
	green: '/game/imgs/green/gKing.png',
	red: '/game/imgs/red/rKing.png',
	yellow: '/game/imgs/yellow/yKing.png'
};

function King(starting, player){
	let piece = Piece(starting, player, "king");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	const directions = [...rookDirections, ...bishopDirections];

	function getPossibleMoves(boardState){
		return getFiniteMoves(boardState, directions, piece.getPosition(), piece.getPlayer());
	}
	return {
		...piece,
		getPossibleMoves
	}
}

export default King;
