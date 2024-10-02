# Card Guessing Game

Welcome to the Card Guessing Game! This is a fun, interactive memory game where players match pairs of cards with animal emojis. Test your memory and see how quickly you can match all the pairs!

## Features

- Interactive card-flipping gameplay
- Real-time score tracking
- Timer to add excitement and challenge
- Play, pause, and reset game controls
- Responsive design for various screen sizes
- Multiplayer support using Socket.IO

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Real-time Communication: Socket.IO

## Installation

To run this game locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/ComfortN/card-guessing-game.git
   cd card-guessing-game
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your web browser and navigate to `http://localhost:3000`

## How to Play

1. Click the "Start Game" button on the landing page to begin.
2. You'll see a grid of face-down cards.
3. Click on a card to flip it over and reveal the animal emoji.
4. Try to find the matching pair by flipping another card.
5. If the cards match, they'll stay face-up. If not, they'll flip back over.
6. Match all pairs before the timer runs out to win!
7. Your score increases by 10 points for each match and decreases by 1 point for each mismatch.

## Game Controls

- Play/Pause: Pause the game timer or resume play
- Reset: Start a new game with reshuffled cards
- Stop: End the current game and return to the landing page
