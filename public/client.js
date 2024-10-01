const socket = io();

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const winPopup = document.getElementById('win-popup');
const closePopupButton = document.getElementById('close-popup');

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
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
});

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.symbol;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        if (matchedPairs === 18) {
            winPopup.style.display = 'block';
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    flippedCards = [];
}

function resetGame() {
    matchedPairs = 0;
    flippedCards = [];
    socket.emit('requestCards');
}

resetButton.addEventListener('click', resetGame);
closePopupButton.addEventListener('click', () => {
    winPopup.style.display = 'none';
    resetGame();
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