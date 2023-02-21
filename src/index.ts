import { Sound } from "@pixi/sound";
import { Assets } from "pixi.js";
import { DevGame } from "./gameEngine/games/dev/devGame";

export let assets: any;

const buttonStartGameHTML = document.getElementById("startGame");
buttonStartGameHTML.addEventListener('click', async () => {
    buttonStartGameHTML.remove();

    const bodyHTML = document.querySelector('body');
    const textHTML = document.createElement('p');
    textHTML.textContent = "Chargement des ressources...   (Attention au son)";
    bodyHTML.append(textHTML);

    const manifest = await fetch('assets/manifest.json').then((res) => res.json());

    Assets.init({manifest: manifest});
    assets = await Assets.loadBundle(['adventurer', 'keys', 'tenemigs', 'theme', 'light']);

    assets.theme.theme01.loop = true;
    assets.theme.theme02.loop = true;

    textHTML.remove();

    const game = new DevGame(document.body);    
});

export function fixBug() {
    Sound.from({url: ''})
}