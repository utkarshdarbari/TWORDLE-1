let targetWord;
let remainingGuesses = 5;
let remainingTime = 150; // 2:30 minutes in seconds
let countdownInterval;
let wordList;

window.onload = function () {
    disableActivity();
};

function disableActivity() {
    const inputField = document.getElementById("inputField");
    const checkButton = document.getElementById("wordle-btn");
    checkButton.disabled = true;
    inputField.disabled = true;
    checkButton.classList.add("disabled");
}

function enableActivity() {
    const inputField = document.getElementById("inputField");
    const checkButton = document.getElementById("wordle-btn");
    checkButton.disabled = false;
    inputField.disabled = false;
    checkButton.classList.remove("disabled");
}

async function generateRandomWord() {
    try {
        const response = await fetch('wordList.json');
        wordList = await response.json();
        return wordList[Math.floor(Math.random() * wordList.length)];
    } catch (error) {
        console.error('Failed to generate random word:', error);
        return '';
    }
}

function isWordValid(word) {
    return wordList.includes(word);
}

function checkGuess() {
    const inputField = document.getElementById("inputField");
    const guessWord = inputField.value.toLowerCase();
    const resultText = document.getElementById("result");
    const hintbox = document.getElementById("hintbox");

    let hintText = "";
    let incorrectPositions = 0;
    let matchedPositions = [];
    let unmatchedGuess = [];
    let unmatchedTarget = [];

    if (guessWord.length !== targetWord.length) {
        resultText.textContent = "Incorrect guess. Guesses must be " +
            targetWord.length + " characters long. ";
        resultText.style.color = "red";
        inputField.value = "";
        return;
    }

    if (!isWordValid(guessWord)) {
        resultText.textContent = "Invalid guess. Please enter a valid word.";
        resultText.style.color = "red";
        inputField.value = "";
        return;
    }

    for (let i = 0; i < targetWord.length; i++) {
        if (guessWord[i] === targetWord[i]) {
            matchedPositions.push(i);
        } else {
            unmatchedGuess.push(guessWord[i]);
            unmatchedTarget.push(targetWord[i]);
        }
    }

    for (let i = 0; i < targetWord.length; i++) {
        if (matchedPositions.includes(i)) {
            hintText += '<span class="green-letter">' + guessWord[i] + '</span>';
        }
        else if (unmatchedTarget.includes(guessWord[i])) {
            incorrectPositions++;
            hintText += '<span class="yellow-letter">' + guessWord[i] + '</span>';
            const charIndex = unmatchedGuess.indexOf(guessWord[i]);
            unmatchedGuess = unmatchedGuess.slice(0, charIndex).concat(unmatchedGuess.slice(charIndex + 1));

            const wordIndex = unmatchedTarget.indexOf(guessWord[i]);
            unmatchedTarget = unmatchedTarget.slice(0, wordIndex).concat(unmatchedTarget.slice(wordIndex + 1));
        }
        else {
            hintText += '<span class="grey-letter">' + guessWord[i] + '</span>';
        }
    }

    if (matchedPositions.length === targetWord.length) {
        resultText.innerHTML = "Congratulations! You guessed the word!";
        resultText.style.color = "green";
        hintbox.innerHTML += "<div style='padding-top:4%; text-align: center;'>" + hintText + "</div><br>";
        disableActivity();
        clearInterval(countdownInterval);
        document.getElementById("timer").innerHTML = "02:30";
    } else if (remainingGuesses > 1) {
        remainingGuesses--;
        resultText.innerHTML =
            "Incorrect guess. You have " + remainingGuesses +
            " guesses remaining.<br>Correct positions: " + matchedPositions.length +
            ".<br>Letters with incorrect position: " + incorrectPositions + ".";
        hintbox.innerHTML += "<div style='padding-top:4%; text-align: center;'>" + hintText + "</div><br>";
        resultText.style.color = "red";
        inputField.value = "";
    } else {
        resultText.innerHTML =
            "Out of guesses. <br>The target word was: " +
            targetWord + ".<br> Better luck next time!";
        resultText.style.color = "red";
        disableActivity();
        clearInterval(countdownInterval);
        hintbox.innerHTML += "<div style='padding-top:4%; text-align: center;'>" + hintText + "</div><br>";
        document.getElementById("timer").innerHTML = "02:30";
    }

    inputField.value = "";
}

function startTimer() {
    const resultText = document.getElementById("result");
    countdownInterval = setInterval(() => {
        remainingTime--;

        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, "0");
        const seconds = (remainingTime % 60).toString().padStart(2, "0");
        const timerElement = document.getElementById("timer");
        timerElement.innerHTML = minutes + ":" + seconds;

        if (remainingTime === 0) {
            clearInterval(countdownInterval);
            resultText.innerHTML =
                "Out of time! <br>The target word was: " +
                targetWord + ".<br> Better luck next time!";
            resultText.style.color = "red";
            timerElement.innerHTML = "Time's up!";
            disableActivity();
        }
    }, 1000);

}

async function startGame() {
    targetWord = "";
    while (targetWord.length != 5) {
        targetWord = await generateRandomWord();
    }
    remainingGuesses = 5;
    remainingTime = 150;
    clearInterval(countdownInterval);
    document.getElementById("timer").innerHTML = "02:30";
    startTimer();
    enableActivity();
    document.getElementById("result").innerHTML = "";
    document.getElementById("hintbox").innerHTML = "";
}

function shareInvitation() {
    const invitationMessage = "Hey friends! I found this interesting game 'Twordle'! Join me in playing the game! https://apani05.github.io/CSS566_RoamingCoders/";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(invitationMessage)}`;
    window.open(twitterUrl, '_blank');
}
