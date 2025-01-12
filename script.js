const allCards = [
  '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', 
  '🍍', '🍍', '🍓', '🍓', '🍒', '🍒', '🍊', '🍊', 
  '🥥', '🥥', '🍑', '🍑', '🍍', '🍍', '🍓', '🍓',
  '🍋', '🍋', '🥝', '🥝', '🍏', '🍏', '🍒', '🍒'
];

let flippedCards = [];
let matchedCards = [];
let isGameOver = false;
let level = 1;
let flipChance = 100;  // Set maximum flips allowed (100 flips per level)
let currentCards = [];
let cashCoins = 0;

const gameBoard = document.getElementById('gameBoard');
const startButton = document.getElementById('startButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const gameMessage = document.getElementById('gameMessage');
const levelDisplay = document.getElementById('levelDisplay');
const coinDisplay = document.getElementById('coinDisplay');

// Shuffle the cards
function shuffleCards(cards) {
  return cards.sort(() => Math.random() - 0.5);
}

// Create the board with appropriate number of cards based on the level
function createBoard() {
  // Calculate the number of cards for the level
  let numCards = (level * 2) + 2; // More cards per level (e.g. Level 1 = 4 cards, Level 2 = 6, Level 3 = 8)

  // Stop increasing the number of cards after level 5
  if (level > 5) {
    numCards = 12; // Fix the card count to 12 after Level 5
  }

  const selectedCards = allCards.slice(0, numCards);

  // Randomize and prepare the puzzle by shuffling two sets of cards
  currentCards = shuffleCards(selectedCards.concat(selectedCards));

  gameBoard.innerHTML = '';
  currentCards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.card = card;
    cardElement.addEventListener('click', () => flipCard(cardElement));
    gameBoard.appendChild(cardElement);
  });
}

// Flip a card
const flipSound = new Audio('pop-268648.mp3'); // Add the sound file

function flipCard(cardElement) {
  if (flippedCards.length < flipChance && !cardElement.classList.contains('flipped') && !isGameOver) {
    // Play sound when flipping a card
    flipSound.play();

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;
    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}
const soundControl = document.getElementById('soundControl');
const vibrateControl = document.getElementById('vibrateControl');
const settingsPanel = document.getElementById('settingsPanel');
const settingsButton = document.getElementById('settingsButton');
const closeSettingsButton = document.getElementById('closeSettings');

// Handle opening and closing of settings
settingsButton.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});
closeSettingsButton.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
});

// Handle sound control
let isSoundOn = true;
let isVibrateOn = true;

soundControl.addEventListener('change', () => {
  isSoundOn = soundControl.checked;
  if (!isSoundOn) {
    flipSound.volume = 0; // Mute the sound
  } else {
    flipSound.volume = 1; // Unmute the sound
  }
});


// Handle vibration control
vibrateControl.addEventListener('change', () => {
  isVibrateOn = vibrateControl.checked;
});

// Play vibration on card flip
function flipCard(cardElement) {
  if (flippedCards.length < flipChance && !cardElement.classList.contains('flipped') && !isGameOver) {
    if (isSoundOn) {
      flipSound.play();
    }
    if (isVibrateOn) {
      navigator.vibrate(400); // Vibrate for 100ms
    }

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;
    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}



// Check if the flipped cards match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  if (firstCard.dataset.card === secondCard.dataset.card) {
    matchedCards.push(firstCard.dataset.card);
    flippedCards = [];
    if (matchedCards.length === currentCards.length / 2) {
      levelUp();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      flippedCards = [];
    }, 1000);
  }
}

// Level up function
function levelUp() {
  // Add CashCoins
  cashCoins += 10;
  coinDisplay.textContent = `CashCoins: ${cashCoins}`;

  if (level < 100) {
    gameMessage.textContent = `Level ${level} Complete!`;
    levelDisplay.textContent = `Level: ${level}`;
    nextLevelButton.style.display = 'block'; // Show "Next Level" button
  } else {
    gameMessage.textContent = "You have completed Level 100! Game Over!";
    isGameOver = true;
  }
}

// Go to the next level
function nextLevel() {
  level++;
  nextLevelButton.style.display = 'none';  // Hide the Next Level button
  createBoard();  // Create the next level's board
  
  // Reset flip chances and allow the player to flip cards again
  flipChance = 100;  // Reset flip chances to 100 for each new level (or any number you prefer)
  gameMessage.textContent = ''; // Reset the game message
  matchedCards = []; // Reset matched cards for the new level
  flippedCards = []; // Reset flipped cards for the new level
  isGameOver = false; // Reset game state to allow flipping cards again
};



// Start the game
function startGame() {
  level = 1;
  cashCoins = 0;
  flipChance = 100; // Set flip chance for the first level
  matchedCards = [];
  flippedCards = [];
  isGameOver = false;
  
  coinDisplay.textContent = `CashCoins: ${cashCoins}`;
  levelDisplay.textContent = `Level: ${level}`;
  nextLevelButton.style.display = 'none';  // Hide the Next Level button
  gameMessage.textContent = '';
  startButton.style.display = 'none';  // Hide the Start Game button
  createBoard();
}

startButton.addEventListener('click', startGame);
nextLevelButton.addEventListener('click', nextLevel);

// Initialize the game
startButton.style.display = 'block';  // Make the Start button visible
