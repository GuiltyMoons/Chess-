export function outOfBound(boardState, row, col){
	if (row < 0 || row >= boardState.length || col < 0 || col >= boardState[0].length 
		|| boardState[row][col] === 0){
			return true;
		}
		
	return false;
}
