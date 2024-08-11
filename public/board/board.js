import isCutOut from "./cutout.js";

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
