function createInitialArray(){
    const size = 14;
    let array = [];

    for (let r = 0; r < 14; r++){
        array[r] = [];
        for (let c = 0; c < 14; r++){
            if (isCutOut(r,c)){
                array[r][c] = 0
            } else {
                array[r][c] = 1; //array[r][c] = Knight({row:, col:}, [player])
            }
        }
    }
}

function updateBoard(){

}