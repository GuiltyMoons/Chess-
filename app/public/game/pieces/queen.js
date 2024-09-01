import Piece from './piece.js'
import Rook from './rook.js';
import Bishop from './bishop.js';


const imgSources = {
	blue: '/game/imgs/blue/bQueen.png',
	green: '/game/imgs/green/gQueen.png',
	red: '/game/imgs/red/rQueen.png',
	yellow: '/game/imgs/yellow/yQueen.png'
};

function Queen(starting, player){
	let piece = Piece(starting, player, "queen");
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function getPossibleMoves(boardState){
		let rookMoves = Rook(piece.getPosition(), piece.getPlayer()).getPossibleMoves(boardState);
		let bishopMoves = Bishop(piece.getPosition(), piece.getPlayer()).getPossibleMoves(boardState);
		return rookMoves.concat(bishopMoves);
	}
	return {
		...piece,
		getPossibleMoves
	}
}

export default Queen;
