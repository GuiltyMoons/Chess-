import Piece from './piece.js'

const imgSources = {
    blue: '../imgs/blue/bKing.png',
    green: '../imgs/green/gKing.png',
    red: '../imgs/red/rKing.png',
    yellow: '../imgs/yellow/yKing.png'
};

function King(starting, player){
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

export default King;