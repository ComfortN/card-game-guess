const socket = io();

const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const playPauseButton = document.getElementById('play-pause-button');
const stopButton = document.getElementById('stop-button');
const winPopup = document.getElementById('win-popup');
const gameOverPopup = document.getElementById('game-over-popup');
const closePopupButton = document.getElementById('close-popup');
const closeGameOverPopupButton = document.getElementById('close-game-over-popup');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let flippedCards = [];
let matchedPairs = 0;
let isGamePaused = false;
let gameStarted = false;
let timerInterval;
let timeLeft = 5 * 60;
let score = 0;

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
    startTimer();
    updateScoreDisplay();
});


function flipCard() {
    if (isGamePaused || !gameStarted || timeLeft <= 0) return;
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
        score +=10;
        if (matchedPairs === 18) {
            winPopup.style.display = 'block';
            stopTimer();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        score = Math.max(0, score - 1);
    }
    flippedCards = [];
    updateScoreDisplay();
}


function resetGame() {
    matchedPairs = 0;
    flippedCards = [];
    isGamePaused = false;
    gameStarted = false;
    score = 0;
    updatePlayPauseButton();
    resetTimer();
    updateScoreDisplay();
    socket.emit('requestCards');
}


function togglePlayPause() {
    if (!gameStarted) return;
    isGamePaused = !isGamePaused;
    updatePlayPauseButton();
    if (isGamePaused) {
        stopTimer();
    } else {
        startTimer();
    }
}


function stopGame() {
    isGamePaused = true;
    gameStarted = false;
    updatePlayPauseButton();
    stopTimer();
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


function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}


function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}


function resetTimer() {
    stopTimer();
    timeLeft = 5 * 60;
    updateTimerDisplay();
}


function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        stopTimer();
        endGame(false);
    }
}


function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}


function endGame(isWin) {
    isGamePaused = true;
    gameStarted = false;
    updatePlayPauseButton();
    if (isWin) {
        winPopup.style.display = 'block';
    } else {
        gameOverPopup.style.display = 'block';
    }
}


resetButton.addEventListener('click', resetGame);
playPauseButton.addEventListener('click', togglePlayPause);
stopButton.addEventListener('click', stopGame);
closePopupButton.addEventListener('click', () => {
    winPopup.style.display = 'none';
    resetGame();
});


closeGameOverPopupButton.addEventListener('click', () => {
    gameOverPopup.style.display = 'none';
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