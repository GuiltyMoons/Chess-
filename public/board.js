let cell = document.getElementById("cell");
let newBoard = [];
let cutOuts = [ { row: 0, col: 0, size: 3 }, { row: 0, col: 11, size: 3 },
     { row: 11, col: 0, size: 3 }, { row: 11, col: 11, size: 3 }];

for (let r = 0; r < 14; r++) {
    newBoard[r] = [];
    for (c = 0; c < 14; c++) {
        let div = document.createElement("div");

        let isCutOut = cutOuts.some(cutOut =>
            r >= cutOut.row && r < cutOut.row + cutOut.size &&
            c >= cutOut.col && c < cutOut.col + cutOut.size
        );
        
        if (isCutOut) {
            div.classList.add("cutout")
        } else{
            if ((r + c) % 2 === 0) {
                div.classList.add("white-cell");
            } else {
                div.classList.add("black-cell");
            }
        }
        newBoard[r][c] = { row: r, col: c };
        cell.append(div);
    }
};
