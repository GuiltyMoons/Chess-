import isCutOut from "./cutout.js";

function createInitialArray() {
    const size = 14;
    let board = [];

    for (let r = 0; r < size; r++) {
        board[r] = [];
        for (let c = 0; c < size; c++) {
            if (isCutOut(r, c)) {
                board[r][c] = 0;
            } else {
                board[r][c] = 1;
            }
        }
    }
    return board;
}

export default createInitialArray;
