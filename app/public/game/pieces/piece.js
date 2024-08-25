function Piece(starting, player) {
	let p = player;
	let currentPosition = starting;
	let previousPosition;
	let dom = document.createElement("div");

	function getPosition(){
		return currentPosition;
	}

	function setPosition(newPosition, boardState){
		previousPosition = currentPosition;
		currentPosition = newPosition;
		if(typeof boardState[currentPosition.row][currentPosition.col] === "object"){
			unrender(currentPosition);
		}
		boardState[currentPosition.row][currentPosition.col] = this;
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
		getPosition,
		setPosition,
		unrender,
		render
	}
}

export default  Piece;
