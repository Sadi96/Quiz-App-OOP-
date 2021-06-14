import {app} from './App.js'

export class AnswersCounter {
    questionNumberSpan = document.getElementById('question-number');
    remainingQuestionsSpan = document.getElementById('remaining-questions');

    constructor(remainingQuestions) {
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.questionCounter = 1;
        this.remainingQuestions = remainingQuestions;
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
        app.game.timer.displayCurrentTimer();
        this.displayAnswersCounters();
        this.displayQuestionCounters();
    }

    updateCounters() {
        this.questionCounter++;
        this.remainingQuestions--;
    }
}