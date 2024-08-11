import Piece from './piece.js'

const imgSources = {
	blue: '../imgs/blue/bKnight.png',
	green: '../imgs/green/gKnight.png',
	red: '../imgs/red/rKnight.png',
	yellow: '../imgs/yellow/yKnight.png'
};

function Knight(starting, player){
	let piece = Piece(starting, player);
	const imgSource = imgSources[player];
	const dom = piece.dom;
	const imageElement = document.createElement("img");
	
	imageElement.src= imgSource;
	dom.append(imageElement);

	function getPossibleMoves(boardState){
		let position = piece.getPosition();
		let moves = [];

		const directions = [
			{ row: 2, col: 1 }, { row: 2, col: -1 },
			{ row: -2, col: 1 }, { row: -2, col: -1 },
			{ row: 1, col: 2 }, { row: 1, col: -2 },
			{ row: -1, col: 2 }, { row: -1, col: -2 },
		];

		for (const direction of directions){
			const newRow = position.row + direction.row;
			const newCol = position.col + direction.col;

			if (newRow >= 0 && newRow < boardState.length &&
				newCol >= 0 && newCol < boardState[0].length &&
				boardState[newRow][newCol] !== 0 && boardState[newRow][newCol]){
				moves.push({ row: newRow, col: newCol });
			}
		}
		return moves;
	}
	return {
		...piece,
		getPossibleMoves
	}
}

export default Knight;
