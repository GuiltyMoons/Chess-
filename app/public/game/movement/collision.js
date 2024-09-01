export function collisionDetection(board, newPosition){
	if (typeof board[newPosition.row][newPosition.col] === 'object'){
		return true;
	}
	return false;
}

export function sameTeamDetection(board, newPosition, player){
	if(board[newPosition.row][newPosition.col].player === player){
		return true;
	}
	return false;
}
