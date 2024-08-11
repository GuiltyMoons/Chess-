import isCutOut from "./cutout.js";
import Rook from "../pieces/rook.js";
import Knight from "../pieces/knight.js";
import Bishop from "../pieces/bishop.js";
import Queen from "../pieces/queen.js";
import King from "../pieces/king.js";
import Pawn from "../pieces/pawn.js";


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

let pieces = {
    Rook: Rook,
    Knight: Knight,
    Bishop: Bishop,
    Queen: Queen,
    King: King,
    Pawn: Pawn
};

let blue = [
    {piece: 'Rook', color: 'blue', position: [{row: 0, col: 3}, {row: 0, col: 10}]},
    {piece: 'Knight', color: 'blue', position: [{row: 0, col: 4}, {row: 0, col: 9}]},
    {piece: 'Bishop', color: 'blue', position: [{row: 0, col: 5}, {row: 0, col: 8}]},
    {piece: 'Queen', color: 'blue', position: [{row: 0, col: 7}]},
    {piece: 'King', color: 'blue', position: [{row: 0, col: 6}]},
    {piece: 'Pawn', color: 'blue', position: [{row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5},
        {row: 1, col: 6}, {row: 1, col: 7}, {row: 1, col: 8}, {row: 1, col: 9}, {row: 1, col: 10}
    ]},
];

let green = [
    {piece: 'Rook', color: 'green', position: [{row: 3, col: 13}, {row: 10, col: 13}]},
    {piece: 'Knight', color: 'green', position: [{row: 4, col: 13}, {row: 9, col: 13}]},
    {piece: 'Bishop', color: 'green', position: [{row: 5, col: 13}, {row: 8, col: 13}]},
    {piece: 'Queen', color: 'green', position: [{row: 7, col: 13}]},
    {piece: 'King', color: 'green', position: [{row: 6, col: 13}]},
    {piece: 'Pawn', color: 'green', position: [{row: 3, col: 12}, {row: 4, col: 12}, {row: 5, col: 12},
        {row: 6, col: 12}, {row: 7, col: 12}, {row: 8, col: 12}, {row: 9, col: 12}, {row: 10, col: 12}
    ]},
];

let red = [
    {piece: 'Rook', color: 'red', position: [{row: 13, col: 3}, {row: 13, col: 10}]},
    {piece: 'Knight', color: 'red', position: [{row: 13, col: 4}, {row: 13, col: 9}]},
    {piece: 'Bishop', color: 'red', position: [{row: 13, col: 5}, {row: 13, col: 8}]},
    {piece: 'Queen', color: 'red', position: [{row: 13, col: 7}]},
    {piece: 'King', color: 'red', position: [{row: 13, col: 6}]},
    {piece: 'Pawn', color: 'red', position: [{row: 12, col: 3}, {row: 12, col: 4}, {row: 12, col: 5},
        {row: 12, col: 6}, {row: 12, col: 7}, {row: 12, col: 8}, {row: 12, col: 9}, {row: 12, col: 10}
    ]},
];

let yellow = [
    {piece: 'Rook', color: 'yellow', position: [{row: 3, col: 0}, {row: 10, col: 0}]},
    {piece: 'Knight', color: 'yellow', position: [{row: 4, col: 0}, {row: 9, col: 0}]},
    {piece: 'Bishop', color: 'yellow', position: [{row: 5, col: 0}, {row: 8, col: 0}]},
    {piece: 'Queen', color: 'yellow', position: [{row: 7, col: 0}]},
    {piece: 'King', color: 'yellow', position: [{row: 6, col: 0}]},
    {piece: 'Pawn', color: 'yellow', position: [{row: 3, col: 1}, {row: 4, col: 1}, {row: 5, col: 1},
        {row: 6, col: 1}, {row: 7, col: 1}, {row: 8, col: 1}, {row: 9, col: 1}, {row: 10, col: 1}
    ]},
];

let color = [blue, green, red, yellow];

function boardSetup(board) {
     color.forEach(element => {
        element.forEach(({piece, color, position}) => {
            position.forEach(pos => {
                board[pos.row][pos.col] = pieces[piece](pos, color);
				board[pos.row][pos.col].render();
            });
        });
    });
};

const boardFunc = {
    createInitialArray,
    boardSetup
};

export default boardFunc;
