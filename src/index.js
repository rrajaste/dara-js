import {GAME_PHASES} from "./gamephases.js";
import {PLAYER_TYPES} from "./playertypes.js";

"js-cell";

import GameEngine from "./gameengine.js";
import Coordinate from "./coordinate.js";

let engine = new GameEngine();
engine.startGame();

console.log(engine);

displayStats();
setErrorBoxText("\n");

let displayBoard = document.getElementById('gameBoard');
let displayBoardRows = displayBoard.querySelectorAll('.js-board-row');

let playerColorMap = {
    "First Player": "blue",
    "Second Player": "green",
    "Empty": "brown"
};


let cellToMove;

function cellClicked(event) {
    setErrorBoxText("\n");

    let row = this.dataset.row;
    let col = this.dataset.col;
    let coordinate = new Coordinate(col, row);

    if (engine.gamePhase === GAME_PHASES.DROP_PHASE)
    try {
        engine.claimCell(coordinate);
        setCellColor(this, playerColorMap[engine.whoseTurn.PLAYER_TYPE]);
    } catch (e) {
        setErrorBoxText(e.message);
    } else if (engine.gamePhase === GAME_PHASES.MOVE_PHASE) {
        if (cellToMove === undefined) {
            cellToMove = this;
        } else {
            engine.moveToken()
        }
    }
    displayStats();
    console.log(engine);
}

function setCellColor(element, color) {
    clearCellColor(element);
    element.classList.add(color)
}

function clearCellColor(element) {

    for (const player in playerColorMap) {
        let color = playerColorMap[player];
        if (element.classList.contains(color)){
            element.classList.remove(color);
        }
    }
}

function setErrorBoxText(text){
    document.getElementById("js-error-box").innerText = text;
}

function displayTokenCount() {
    document.getElementById("first-player-token-counter").innerText = engine.firstPlayer.tokenCount;
    document.getElementById("second-player-token-counter").innerText = engine.secondPlayer.tokenCount;
}

function displayGamePhase() {
    document.getElementById("game-phase").innerText = engine.gamePhase;
}

function displayWhoseTurnItIs() {
    document.getElementById("whose-turn").innerText = engine.whoseTurn.toString();
}

function displayStats() {
    displayTokenCount();
    displayWhoseTurnItIs();
    displayGamePhase()
}

for (const row of displayBoardRows) {
    let cells = row.querySelectorAll('.js-cell');
    for (const cell of cells)  {
        cell.onclick = cellClicked;
    }
}




