const socket = io();

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const playPauseButton = document.getElementById('play-pause-button');
const stopButton = document.getElementById('stop-button');
const winPopup = document.getElementById('win-popup');
const closePopupButton = document.getElementById('close-popup');

let flippedCards = [];
let matchedPairs = 0;
let isGamePaused = false;
let gameStarted = false;

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
    gameStarted = true;
    updatePlayPauseButton();
});

function flipCard() {
    if (isGamePaused || !gameStarted) return;
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
    isGamePaused = false;
    gameStarted = false;
    updatePlayPauseButton();
    socket.emit('requestCards');
}

function togglePlayPause() {
    if (!gameStarted) return;
    isGamePaused = !isGamePaused;
    updatePlayPauseButton();
}

function stopGame() {
    isGamePaused = true;
    gameStarted = false;
    updatePlayPauseButton();
    gameBoard.innerHTML = '';
    window.location.href = '/';
}

function updatePlayPauseButton() {
    const icon = playPauseButton.querySelector('i');
    if (isGamePaused || !gameStarted) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    } else {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
}

resetButton.addEventListener('click', resetGame);
playPauseButton.addEventListener('click', togglePlayPause);
stopButton.addEventListener('click', stopGame);
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