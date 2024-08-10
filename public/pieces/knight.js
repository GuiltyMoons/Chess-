import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bKnight.png',
    green: '../imgs/green/gKnight.png',
    red: '../imgs/red/rKnight.png',
    yellow: '../imgs/yellow/yKnight.png'
};

function Knight(starting, player){
    const piece = Piece(starting);
    const imgSource = imgSources[player];
    const dom = piece.dom;
    const imageElement = document.createElement("img");
    imageElement.src= imgSource;
    dom.append(imageElement);
    return {
        ...piece
    }
}

export default Knight;