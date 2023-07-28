import fetchParagraph from "./paragraphs.js";

const typingText = document.querySelector(".typing-text p");
const inputField = document.querySelector(".wrapper .input-field");
const tryAgainBtn = document.getElementById("try-again-btn");
const resetBtn = document.getElementById("reset-btn");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const accuracyTag = document.querySelector(".accuracy span");
const errorMessage = document.querySelector(".error-msg");

let timer;
const maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let isTyping = false;
let mistakes = 0;
let accuracy = 0;
let isCompleted = false;

// Load a new paragraph from the server
async function loadParagraph() {
  try {
    showLoadingSpinner();
    const paragraph = await fetchParagraph();
    displayParagraph(paragraph);
  } catch (error) {
    handleError(error);
  }
}

// Display the loading spinner while fetching a new paragraph
function showLoadingSpinner() {
  typingText.innerHTML = '<div class="spinner"></div>';
}

// Display the fetched paragraph for typing
function displayParagraph(paragraph) {
  typingText.innerHTML = "";
  const characters = paragraph.split("");
  const fragment = document.createDocumentFragment();

  characters.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    fragment.appendChild(span);
  });

  if (fragment.children.length > 0) {
    fragment.children[0].classList.add("active");
  }

  typingText.appendChild(fragment);

  document.addEventListener("keydown", () => inputField.focus());
  typingText.addEventListener("click", () => inputField.focus());
}

// Initialize the typing test and handle user input
function initTyping() {
  const characters = typingText.querySelectorAll("span");
  const typedChar = inputField.value.split("")[charIndex];

  if (charIndex >= characters.length - 1) {
    isCompleted = true;
  }

  if (isCompleted || timeLeft === 0) {
    clearInterval(timer);

    if (isCompleted) {
      saveProgress();
    }

    inputField.value = "";
    inputField.removeEventListener("input", initTyping);
    return;
  } else {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    handleCharacterInput(characters, typedChar);
    updateStats(characters);
  }
}

// Handle the user's input for each character in the paragraph
function handleCharacterInput(characters, typedChar) {
  if (typedChar == null) {
    if (charIndex > 0) {
      charIndex--;
      if (characters[charIndex].classList.contains("incorrect")) {
        mistakes--;
      }
      characters[charIndex].classList.remove("correct", "incorrect");
    }
  } else {
    if (characters[charIndex].innerText == typedChar) {
      characters[charIndex].classList.add("correct");
    } else {
      mistakes++;
      characters[charIndex].classList.add("incorrect");
    }
    charIndex++;
  }

  characters.forEach((span) => span.classList.remove("active"));
  characters[charIndex].classList.add("active");
}

// Update the statistics for the typing test
function updateStats(characters) {
  const totalChars = charIndex;
  const correctChars = charIndex - mistakes;

  const wpm = Math.round((correctChars / 5 / (maxTime - timeLeft)) * 60);
  wpmTag.innerText = Math.max(wpm, 0);
  mistakeTag.innerText = mistakes;
  cpmTag.innerText = charIndex - mistakes;

  if (charIndex > 0) {
    accuracy = ((correctChars / totalChars) * 100).toFixed(2);
    accuracyTag.innerText = accuracy + "%";
  }
}

// Initialize the timer for the typing test
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
    wpmTag.innerText = Math.round((charIndex - mistakes) / 5 / (maxTime - timeLeft) * 60);
  } else {
    if (!isCompleted) {
      saveProgress();
    }
    clearInterval(timer);
  }
}

// Start a new typing test
function newGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = 0;
  isTyping = false;
  inputField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  accuracyTag.innerText = 0;
}

// Reset the current typing test
function resetGame() {
  clearInterval(timer);
  inputField.value = "";
  charIndex = mistakes = 0;
  timeLeft = maxTime;
  isTyping = false;
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  accuracyTag.innerText = 0;

  const characters = typingText.querySelectorAll("span");
  characters.forEach((span) => {
    span.classList.remove("active", "correct", "incorrect");
  });

  errorMessage.classList.remove("show");
}

// Save the user's progress to local storage
function saveProgress() {
  console.log("Saving progress");
  const userProgress = {
    mistakes: mistakes,
    wpm: parseInt(wpmTag.innerText),
    cpm: parseInt(cpmTag.innerText),
    accuracy: parseFloat(accuracyTag.innerText),
    timestamp: new Date().toISOString(),
  };

  const existingUserProgress = JSON.parse(localStorage.getItem("userProgress")) || [];
  existingUserProgress.push(userProgress);
  localStorage.setItem("userProgress", JSON.stringify(existingUserProgress));
}

// Event listeners
await loadParagraph();
inputField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", newGame);
resetBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    newGame();
  } else if (event.key === "Escape") {
    resetGame();
  }
});