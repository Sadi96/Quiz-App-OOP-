import {app} from './App.js';

export class AnswersBoxes {
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
        app.game.sendAnswer(selectedBox);
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
            box.classList.remove('correct', 'wrong', 'selected');
        })
    }

    correctAnswerAlert() {
        const choosedBox = this.boxes.find(box => box.classList.contains('selected'));
        choosedBox.classList.remove('selected');
        this.highligtAnswerCorectness(choosedBox, 'correct');
        app.game.answersCounter.correctAnswers++;
        app.game.answersCounter.displayCurrentCounters();
        setTimeout(app.game.startNextRound.bind(app.game), 1000)
    }

    wrongAnswerAlert() {
        const choosedBox = this.boxes.find(box => box.classList.contains('selected'));
        const correctBox = this.boxes.find(box => box.querySelector('.answer').textContent === app.game.currentRoundQuizData.correctAnswer);
        choosedBox.classList.remove('selected');
        this.highligtAnswerCorectness(choosedBox, 'wrong');
        setTimeout(() => {
            this.highligtAnswerCorectness(correctBox, 'correct');
        }, 1000)
        app.game.answersCounter.wrongAnswers++;
        app.game.answersCounter.displayCurrentCounters();
        setTimeout(app.game.startNextRound.bind(app.game), 2000)
    }
}