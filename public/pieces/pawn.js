import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bPawn.png',
    green: '../imgs/green/gPawn.png',
    red: '../imgs/red/rPawn.png',
    yellow: '../imgs/yellow/yPawn.png'
};

function Pawn(starting, player){
    const piece = Piece(starting);
    const imgSource = imgSources[player];
    const dom = piece.dom;
    const imageElement = document.createElement("img");
    imageElement.src = imgSource;
    dom.append(imageElement);
    return {
        ...piece
    }
}

export default Pawn;