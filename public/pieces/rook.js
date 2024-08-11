import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bRook.png',
    green: '../imgs/green/gRook.png',
    red: '../imgs/red/rRook.png',
    yellow: '../imgs/yellow/yRook.png'
};

function Rook(starting, player){
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

export default Rook;