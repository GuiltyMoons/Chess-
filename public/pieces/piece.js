function Piece(starting) {
    let currentPosition = starting; 
    let dom = document.createElement("div");

    const render = () => {
        const id = `${currentPosition.row}-${currentPosition.col}`
        const parent = document.getElementById(`${currentPosition.row}-${currentPosition.col}`)
        parent.append(dom);
    }
    return {
        dom,
        render
    }
}
export default Piece;
