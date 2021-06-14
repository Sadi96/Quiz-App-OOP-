import {
    questions
} from './questions.js';

import {
    MessagesPopup
} from './MessagesPopup.js';

import {
    AnswersBoxes
} from './AnswersBoxes.js';

import {
    AnswersCounter
} from './AnswersCounter.js';

import {
    Timer
} from './Timer.js';

import {
    app
} from './App.js';

export class Game {
    questionParagraph = document.getElementById('question');
    startGameBtn = document.getElementById('new-game-button');

    constructor(allQuestions = 10) {
        this.answersCounter = new AnswersCounter(allQuestions - 1);
        this.timer = new Timer();
        this.answersBoxes = new AnswersBoxes();
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
            this.answersCounter.updateCounters();
            this.answersBoxes.clearBoxesBackground();
        }
        this.answersCounter.displayCurrentCounters();
        this.currentRoundQuizData = this.drawQuizData();
        this.displayQuizData();
        this.answersBoxes.changeHoverOnButtons('ADD');
        this.answersBoxes.changeListeningForAnswer('ADD');
        this.timer.setTimeCountingInterval();
    }

    changeStartingButtonVisibility(activity) {
        if (activity === 'HIDE') {
            this.startGameBtn.style.display = 'none';
        } else if (activity === 'SHOW') {
            this.startGameBtn.style.display = 'block';
            this.startGameBtn.textContent = 'Zacznij nową grę';
        }
    }

    drawQuizData() {
        const index = Math.floor(Math.random() * questions.length);
        if (this.usedQuestionsIndexes.length === questions.length) {
            throw new Error('There is no more available questions in database')
        } else if (this.usedQuestionsIndexes.includes(index)) {
            return this.drawQuizData();
        } else if (!this.usedQuestionsIndexes.includes(index)) {
            this.usedQuestionsIndexes.push(index);
            return questions[index];
        }
    }

    displayQuizData() {
        this.questionParagraph.textContent = this.currentRoundQuizData.question;
        this.answersBoxes.answerSpans.forEach((span, index) => {
            span.textContent = this.currentRoundQuizData.answers[index]
        })
    }

    hideQuizData() {
        this.answersCounter.questionNumberSpan.textContent = '-';
        this.answersCounter.remainingQuestionsSpan.textContent = '--';
        this.answersBoxes.answerSpans.forEach(span => span.textContent = '---');
        this.timer.minutesCounterSpan.textContent = '--';
        this.timer.secondsCounterSpan.textContent = '--';
        this.questionParagraph.innerHTML = `Naciśnij przycisk na dole ekranu, aby rozpocząć grę`;
        this.changeStartingButtonVisibility('SHOW');
    }

    sendAnswer(choosedAnswerBox) {
        const choosedAnswer = choosedAnswerBox.querySelector('.answer').textContent;
        this.answersBoxes.highligtAnswerCorectness(choosedAnswerBox, 'selected');
        this.answersBoxes.changeHoverOnButtons('REMOVE');
        this.answersBoxes.changeListeningForAnswer('REMOVE');
        clearInterval(this.timer.timerIntervalFunctionId);
        this.timer.resetTimer();
        this.checkAnswerCorectness(choosedAnswer);
    }

    checkAnswerCorectness(choosedAnswer) {
        if (choosedAnswer === this.currentRoundQuizData.correctAnswer) {
            return setTimeout(this.answersBoxes.correctAnswerAlert.bind(this.answersBoxes), 2000)
        }
        setTimeout(this.answersBoxes.wrongAnswerAlert.bind(this.answersBoxes), 2000)
    }

    checkEndGame() {
        if (this.answersCounter.remainingQuestions === 0) {
            return true;
        } else {
            false;
        }
    }

    endGame() {
        MessagesPopup.displayResultsInfo();
        this.answersBoxes.changeListeningForAnswer('REMOVE');
        this.answersBoxes.changeHoverOnButtons('REMOVE');
        this.answersBoxes.clearBoxesBackground();
        app.clearGameVariables();
        this.answersCounter.displayAnswersCounters();
        this.hideQuizData();
    }
}