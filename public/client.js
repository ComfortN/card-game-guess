const socket = io();

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

let flippedCards = [];
let matchedPairs = 0;

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('requestCards');
});

socket.on('cardsGenerated', (cards) => {
    console.log('Received cards:', cards);
    gameBoard.innerHTML = '';
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        gameBoard.appendChild(card);
    });
});



// For debugging
socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
});

socket.on('connect_timeout', () => {
    console.log('Connection timeout');
});

socket.on('error', (error) => {
    console.log('Socket error:', error);
});