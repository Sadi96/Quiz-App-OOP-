import {Game} from './Game.js';

class App {
    constructor(game) {
        this.game = game;
    }

    init() {
        this.game.startNewGame();
    }

    clearGameVariables() {
        this.game = new Game();
    }
}

export const app = new App(new Game())
app.game.startGameBtn.addEventListener('click', app.init.bind(app));