import { DevGame } from "./gameEngine/games/devGame";

const buttonStartGameHTML = document.getElementById("startGame");
buttonStartGameHTML.addEventListener('click', () => {
    buttonStartGameHTML.remove();
    const game = new DevGame(document.body);
});