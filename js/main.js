import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js';
import { createTimer, getRandomColorPairs, hidePlayAgainButton, setTimerText, showPlayAgainButton } from './utils.js';
import { getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton } from './selectors.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(second) {
  const fullSecond = 'Time left: ' + `0${second}`.slice(-2);
  setTimerText(fullSecond);
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED;
  setTimerText('Game Over 😭');
  showPlayAgainButton();
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  const isClicked = liElement.classList.contains('active');

  if (!liElement || shouldBlockClick || isClicked) return;

  // show color for clicked cell
  liElement.classList.add('active');

  // save clicked cell to selections
  selections.push(liElement);
  if (selections.length < 2) return;

  // check color match ?
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if (isMatch) {
    // Check win if all li elements active (16)
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      // show replay and You Win
      showPlayAgainButton();
      setTimerText('You Win 😸');
      timer.clear();

      gameStatus = GAME_STATUS.FINISHED;
    }

    selections = [];
    return;
  }
  
  // in case of not match
  // remove active class for 2 li elements
  gameStatus = GAME_STATUS.BLOCKING;

  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    // reset selection for the next turn
    selections = [];

    // race-condition check with handleTimerFinish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING;
    }
  }, 250);
}

function initColors() {
  // random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  // bind to li > div.overlay
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    // add data-color at li
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) {
      overlayElement.style.backgroundColor = colorList[index];
    }
  });
}

function attachEventForColorList(element) {
  const ulElement = getColorListElement();
  if (!ulElement) return;

  // Event delegation
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;

    handleColorClick(event.target);
  });
}

function resetGame() {
  gameStatus = GAME_STATUS.PLAYING;
  selections = [];

  // reset DOM elements
  // - remove active class from li
  const colorElementList = getColorElementList();
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active');
  }

  // - hide replay button & clear you win/timeout text
  hidePlayAgainButton();
  setTimerText('');

  // re-generate new colors
  initColors();

  startTimer();
}

function attachEventForPlayButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) return;

  playAgainButton.addEventListener('click', resetGame);
}

function startTimer() {
  timer.start();
}

;(() => {
  initColors();

  attachEventForColorList();

  attachEventForPlayButton();

  startTimer();
})()