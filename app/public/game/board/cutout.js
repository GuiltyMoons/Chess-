function isCutOut(r,c){
    let cutOuts = [ { row: 0, col: 0, size: 3 }, { row: 0, col: 11, size: 3 },
        { row: 11, col: 0, size: 3 }, { row: 11, col: 11, size: 3 }];
    
    return cutOuts.some(({ row, col, size }) =>
        r >= row && r < row + size &&
        c >= col && c < col + size)
}

export default isCutOut;
