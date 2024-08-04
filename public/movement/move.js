const moves = {
    vertical: (squares) => ({x:x, y:y}) => ({x:x1, y:y1}) =>
        x === x1 && Math.abs(y1 - y) <= squares,

    horizontal: (squares) => ({x:x, y:y}) => ({x:x1, y:y1}) =>
        y === y1 && Math.abs(x1 - x) <= squares,

    diagonal: ({x:x, y:y}) => ({x:x1, y:y1}) => 
        Math.abs(x1 - x) === Math.abs(y1 - y),

    moveXSquares: (squares) => ({x:x, y:y}) => ({x:x1, y:y1}) =>
        Math.abs(x1 - x) === squares,

    moveYSquares: (squares) => ({x:x, y:y}) => ({x:x1, y:y1}) => 
        Math.abs(y1 - y) === squares,
}

export default moves;