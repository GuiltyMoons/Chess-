import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bBishop.png',
    green: '../imgs/green/gBishop.png',
    red: '../imgs/red/rBishop.png',
    yellow: '../imgs/yellow/yBishop.png'
};

function Bishop(starting, player){
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

export default Bishop;