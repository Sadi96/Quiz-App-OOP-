import { MessagesPopup } from './MessagesPopup.js';
import {app} from './App.js';

export class Timer {
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
        this.timerIntervalFunctionId = setInterval(app.game.timer.countTime.bind(app.game.timer), 1000);
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
        app.game.answersCounter.wrongAnswers++;
        app.game.answersCounter.displayAnswersCounters();
        app.game.answersBoxes.changeHoverOnButtons('REMOVE');
        app.game.answersBoxes.highligtAnswerCorectness('ALL_BOXES', 'wrong');
        this.resetTimer();
        setTimeout(() => MessagesPopup.displayMessage('Czas minął!'), 1000);
    }

    resetTimer() {
        this.minutesCounter = this.minutesAmount;
        this.secondsCounter = this.secondsAmount;
    }
}