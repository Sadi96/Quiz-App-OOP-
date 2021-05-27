import {
    questions
} from './questions.js';

class QuizData {
    constructor() {
        this.questions = questions;
    }
}

class Game {
    questionParagraph = document.getElementById('question');

    constructor(allQuestions = 10) {
        this.allQuestionsInGame = allQuestions;
        this.usedQuestionsIndexes = [];
        this.currentRoundQuizData = '';
    }

    startNewGame() {
        this.changeStartingButtonVisibility('HIDE');
        this.startNextRound(true);
    }

    startNextRound(isThisFirstRound = false) {
        if (!isThisFirstRound) {
            if (this.checkEndGame()) {
                return this.endGame();
            }
            App.answersCounter.updateCounters();
            App.answersBoxes.clearBoxesBackground();
        }
        App.answersCounter.displayCurrentCounters();
        this.currentRoundQuizData = this.drawQuizData();
        this.displayQuizData();
        App.answersBoxes.changeHoverOnButtons('ADD');
        App.answersBoxes.changeListeningForAnswer('ADD');
        App.timer.setTimeCountingInterval();
    }

    changeStartingButtonVisibility(activity) {
        if (activity === 'HIDE') {
            App.startGameBtn.style.display = 'none';
        } else if (activity === 'SHOW') {
            App.startGameBtn.style.display = 'block';
            App.startGameBtn.textContent = 'Zacznij nową grę';
        }
    }

    drawQuizData() {
        const index = Math.floor(Math.random() * App.quizData.questions.length);
        if (this.usedQuestionsIndexes.length === App.quizData.questions.length) {
            throw new Error('There is no more available questions in database')
        } else if (this.usedQuestionsIndexes.includes(index)) {
            return this.drawQuizData();
        } else if (!this.usedQuestionsIndexes.includes(index)) {
            this.usedQuestionsIndexes.push(index);
            return App.quizData.questions[index];
        }
    }

    displayQuizData() {
        this.questionParagraph.textContent = this.currentRoundQuizData.question;
        App.answersBoxes.answerSpans.forEach((span, index) => {
            span.textContent = this.currentRoundQuizData.answers[index]
        })
    }

    hideQuizData() {
        App.answersCounter.questionNumberSpan.textContent = '-';
        App.answersCounter.remainingQuestionsSpan.textContent = '--';
        App.answersBoxes.answerSpans.forEach(span => span.textContent = '---');
        App.timer.minutesCounterSpan.textContent = '--';
        App.timer.secondsCounterSpan.textContent = '--';
        this.questionParagraph.innerHTML = `Naciśnij przycisk na dole ekranu, aby rozpocząć grę`;
        this.changeStartingButtonVisibility('SHOW');
    }

    sendAnswer(choosedAnswerBox) {
        const choosedAnswer = choosedAnswerBox.querySelector('.answer').textContent;
        App.answersBoxes.highligtAnswerCorectness(choosedAnswerBox, 'selected');
        App.answersBoxes.changeHoverOnButtons('REMOVE');
        App.answersBoxes.changeListeningForAnswer('REMOVE');
        clearInterval(App.timer.timerIntervalFunctionId);
        App.timer.resetTimer();
        this.checkAnswerCorectness(choosedAnswer);
    }

    checkAnswerCorectness(choosedAnswer) {
        if (choosedAnswer === this.currentRoundQuizData.correctAnswer) {
            setTimeout(App.answersBoxes.correctAnswerAlert.bind(App.answersBoxes), 2000)
        } else if (choosedAnswer !== this.currentRoundQuizData.correctAnswer) {
            setTimeout(App.answersBoxes.wrongAnswerAlert.bind(App.answersBoxes), 2000)
        }
    }

    checkEndGame() {
        if (App.answersCounter.remainingQuestions === 0) {
            return true;
        } else {
            false;
        }
    }

    endGame() {
        MessagesPopup.displayResultsInfo();
        App.answersBoxes.changeListeningForAnswer('REMOVE');
        App.answersBoxes.changeHoverOnButtons('REMOVE');
        App.answersBoxes.clearBoxesBackground();
        App.clearGameVariables();
        App.answersCounter.displayAnswersCounters();
        this.hideQuizData();
    }
}

class Timer {
    minutesCounterSpan = document.getElementById('minutes');
    secondsCounterSpan = document.getElementById('seconds');

    constructor(minutesAmount = 0, secondsAmount = 10) {
        this.minutesAmount = minutesAmount;
        this.secondsAmount = secondsAmount;
        this.minutesCounter = minutesAmount;
        this.secondsCounter = secondsAmount;
        this.timerIntervalFunctionId = '';
    }

    displayCurrentTimer() {
        this.minutesCounterSpan.textContent = this.minutesCounter < 10 ? `0${this.minutesCounter}` : this.minutesCounter;
        this.secondsCounterSpan.textContent = this.secondsCounter < 10 ? `0${this.secondsCounter}` : this.secondsCounter;
    }

    setTimeCountingInterval() {
        clearInterval(this.timerIntervalFunctionId);
        this.timerIntervalFunctionId = setInterval(App.timer.countTime.bind(App.timer), 1000);
    }

    countTime() {
        if (this.minutesCounter > 0 && this.secondsCounter === 0) {
            this.minutesCounter--;
            this.secondsCounter = 60;
        }
        this.secondsCounter--;
        this.displayCurrentTimer();
        if (this.minutesCounter <= 0 && this.secondsCounter <= 0) {
            this.timedOut();
        }
    }

    timedOut() {
        clearInterval(this.timerIntervalFunctionId);
        App.answersCounter.wrongAnswers++;
        App.answersCounter.displayAnswersCounters();
        App.answersBoxes.changeHoverOnButtons('REMOVE');
        App.answersBoxes.highligtAnswerCorectness('ALL_BOXES', 'wrong');
        this.resetTimer();
        setTimeout(() => MessagesPopup.displayMessage('Czas minął!'), 1000);
    }

    resetTimer() {
        this.minutesCounter = this.minutesAmount;
        this.secondsCounter = this.secondsAmount;
    }
}

class AnswersCounter {
    questionNumberSpan = document.getElementById('question-number');
    remainingQuestionsSpan = document.getElementById('remaining-questions');

    constructor() {
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.questionCounter = 1;
        this.remainingQuestions = App.game.allQuestionsInGame - 1;
    }

    displayAnswersCounters() {
        const correctAnswersSpan = document.getElementById('correct-counter');
        const wrongAnswersSpan = document.getElementById('wrong-counter');
        correctAnswersSpan.textContent = this.correctAnswers;
        wrongAnswersSpan.textContent = this.wrongAnswers;
    }

    displayQuestionCounters() {
        this.questionNumberSpan.textContent = this.questionCounter;
        this.remainingQuestionsSpan.textContent = this.remainingQuestions;
    }

    displayCurrentCounters() {
        App.timer.displayCurrentTimer();
        this.displayAnswersCounters();
        this.displayQuestionCounters();
    }

    updateCounters() {
        this.questionCounter++;
        this.remainingQuestions--;
    }
}

class AnswersBoxes {
    boxes = [...document.getElementsByClassName('answer-box')];
    answerSpans = document.querySelectorAll('span.answer');

    constructor() {
        this.boundAnswerListeners = [];
    }

    changeHoverOnButtons(activity) {
        if (activity === 'ADD') {
            this.boxes.forEach(box => {
                box.classList.add('game-started');
            })
        } else if (activity === 'REMOVE') {
            this.boxes.forEach(box => {
                box.classList.remove('game-started');
            })
        }
    }

    changeListeningForAnswer(activity) {
        // because of the binding, if I want to remove listening for click on the box I need to keep bound functions in extended array (this.boundAnswerListeners)
        if (activity === 'ADD') {
            this.boxes.forEach((box, index) => {
                this.boundAnswerListeners.push(this.sendAnswerHandler.bind(this, box));
                box.addEventListener('click', this.boundAnswerListeners[index]);
            });
        } else if (activity === 'REMOVE') {
            this.boxes.forEach((box, index) => box.removeEventListener('click', this.boundAnswerListeners[index]));
            this.boundAnswerListeners.length = 0;
        }
    }

    sendAnswerHandler(selectedBox) {
        App.game.sendAnswer(selectedBox);
    }

    highligtAnswerCorectness(boxToHighlight, correctness) {
        if (boxToHighlight === 'ALL_BOXES') {
            this.boxes.forEach(box => box.classList.add(correctness));
        } else {
            boxToHighlight.classList.add(correctness);
        }
    }

    clearBoxesBackground() {
        this.boxes.forEach(box => {
            box.classList.remove('correct');
            box.classList.remove('wrong');
            box.classList.remove('selected');
        })
    }

    correctAnswerAlert() {
        const choosedBox = this.boxes.filter(box => box.classList.contains('selected'))[0];
        choosedBox.classList.remove('selected');
        this.highligtAnswerCorectness(choosedBox, 'correct');
        App.answersCounter.correctAnswers++;
        App.answersCounter.displayCurrentCounters();
        setTimeout(App.game.startNextRound.bind(App.game), 1000)
    }

    wrongAnswerAlert() {
        const choosedBox = this.boxes.filter(box => box.classList.contains('selected'))[0];
        const correctBox = this.boxes.filter(box => box.querySelector('.answer').textContent === App.game.currentRoundQuizData.correctAnswer)[0];
        choosedBox.classList.remove('selected');
        this.highligtAnswerCorectness(choosedBox, 'wrong');
        setTimeout(() => {
            this.highligtAnswerCorectness(correctBox, 'correct');
        }, 1000)
        App.answersCounter.wrongAnswers++;
        App.answersCounter.displayCurrentCounters();
        setTimeout(App.game.startNextRound.bind(App.game), 2000)
    }
}

class MessagesPopup {
    static messageButton = document.getElementById('message-button');
    static quizAppBox = document.getElementById('quiz-app');
    static messageBox = document.getElementById('message-box-wrapper');
    static messageParagraph = document.getElementById('message-paragraph');

    static displayMessage(message) {
        MessagesPopup.quizAppBox.classList.add('blurred');
        MessagesPopup.messageBox.classList.add('visible');
        MessagesPopup.messageParagraph.textContent = message;
        MessagesPopup.messageButton.addEventListener('click', MessagesPopup.hideMessage);
    }

    static hideMessage() {
        MessagesPopup.quizAppBox.classList.remove('blurred');
        MessagesPopup.messageBox.classList.remove('visible');
        MessagesPopup.messageParagraph.textContent = '';
        MessagesPopup.messageButton.removeEventListener('click', MessagesPopup.hideMessage);
        App.game.startNextRound();
    }

    static displayResultsInfo() {
        MessagesPopup.quizAppBox.classList.add('blurred');
        MessagesPopup.messageBox.classList.add('visible');
        MessagesPopup.messageParagraph.innerHTML =
            `Koniec gry! <br /><br />
        Twój wynik to: <br />
        ${App.answersCounter.correctAnswers} prawidłowych <br />
        ${App.answersCounter.wrongAnswers} nieprawidłowych
        `;
        MessagesPopup.messageButton.addEventListener('click', MessagesPopup.closeResultsInfo);
    }

    static closeResultsInfo() {
        MessagesPopup.quizAppBox.classList.remove('blurred');
        MessagesPopup.messageBox.classList.remove('visible');
        MessagesPopup.messageParagraph.innerHTML = ``;
        App.answersCounter.displayAnswersCounters();
        App.clearGameVariables();
        MessagesPopup.messageButton.removeEventListener('click', MessagesPopup.closeResultsInfo);
    }
}

class App {
    static startGameBtn = document.getElementById('new-game-button');
    static init() {
        this.quizData = new QuizData();
        this.game = new Game();
        this.answersCounter = new AnswersCounter();
        this.timer = new Timer();
        this.answersBoxes = new AnswersBoxes();
        this.messagesPopup = new MessagesPopup();
        this.game.startNewGame();
    }

    static clearGameVariables() {
        this.game = new Game();
        this.answersCounter = new AnswersCounter();
    }
}

App.startGameBtn.addEventListener('click', App.init.bind(App));