import { Sound } from "@pixi/sound";
import { Assets } from "pixi.js";
import { Campaign } from "./gameEngine/games/campaign";
import { DevGame } from "./gameEngine/games/devGame";
import { tenemigsWidth } from "./gameEngine/hitBox/dev/devTenemigs";

export let assets: any;

const buttonStartGameHTML = document.getElementById("startGame");
buttonStartGameHTML.addEventListener('click', async () => {
    buttonStartGameHTML.remove();

    const bodyHTML = document.querySelector('body');
    const textHTML = document.createElement('p');
    textHTML.textContent = "Chargement des ressources ...";
    bodyHTML.append(textHTML);

    const manifest = await fetch('assets/manifest.json').then((res) => res.json());

    Assets.init({manifest: manifest});
    assets = await Assets.loadBundle(['adventurer', 'keys', 'tenemigs', 'theme', 'torch']);

    assets.theme.theme01.loop = true;
    assets.theme.theme02.loop = true;

    textHTML.remove();

    const game = new DevGame(document.body);    
});

export function fixBug() {
    Sound.from({url: ''})
}