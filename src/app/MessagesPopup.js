import {app} from './App.js';

export class MessagesPopup {
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
        app.game.startNextRound();
    }

    static displayResultsInfo() {
        MessagesPopup.quizAppBox.classList.add('blurred');
        MessagesPopup.messageBox.classList.add('visible');
        MessagesPopup.messageParagraph.innerHTML =
            `Koniec gry! <br /><br />
        Twój wynik to: <br />
        ${app.game.answersCounter.correctAnswers} prawidłowych <br />
        ${app.game.answersCounter.wrongAnswers} nieprawidłowych
        `;
        MessagesPopup.messageButton.addEventListener('click', MessagesPopup.closeResultsInfo);
    }

    static closeResultsInfo() {
        MessagesPopup.quizAppBox.classList.remove('blurred');
        MessagesPopup.messageBox.classList.remove('visible');
        MessagesPopup.messageParagraph.innerHTML = ``;
        app.game.answersCounter.displayAnswersCounters();
        app.clearGameVariables();
        MessagesPopup.messageButton.removeEventListener('click', MessagesPopup.closeResultsInfo);
    }
}