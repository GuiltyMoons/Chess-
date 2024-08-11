import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bQueen.png',
    green: '../imgs/green/gQueen.png',
    red: '../imgs/red/rQueen.png',
    yellow: '../imgs/yellow/yQueen.png'
};

function Queen(starting, player){
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

export default Queen;