import Knight from '../pieces/knight.js'

let cutOuts = [ { row: 0, col: 0, size: 3 }, { row: 0, col: 11, size: 3 },
	{ row: 11, col: 0, size: 3 }, { row: 11, col: 11, size: 3 }];

const isCutOut = (r, c) => cutOuts.some(({ row, col, size }) =>
	r >= row && r < row + size &&
	c >= col && c < col + size
);

let cell = document.getElementById("cell");

for (let r = 0; r < 14; r++) {
	for (let c = 0; c < 14; c++) {
		let div = document.createElement("div");
		if (isCutOut(r,c)) {
			div.classList.add("cutout");
		} else{
			if ((r + c) % 2 === 0) {
				div.classList.add("white-cell", "tile");
				div.id = `${r}-${c}`
			} else {
				div.classList.add("black-cell","tile");
				div.id = `${r}-${c}`
			}
		}
		cell.append(div);
	}
};
