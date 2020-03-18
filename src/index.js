"js-cell";

import {GAME_PHASES} from "./gamephases.js";
import Direction from "./direction.js";
import GameEngine from "./gameengine.js";
import Coordinate from "./coordinate.js";

let engine = new GameEngine();
let displayBoard = document.getElementById('gameBoard');
let displayBoardRows = displayBoard.querySelectorAll('.js-board-row');
let firstPlayerColor = "green";
let secondPlayerColor = "red";
let emptyCellColor = "brown";
let cellToMove = undefined;
let focusedCell = undefined;


engine.startGame();
displayStats();
setErrorBoxText("\n");
console.log(engine);

for (const row of displayBoardRows) {
    let cells = row.querySelectorAll('.js-cell');
    for (const cell of cells)  {
        cell.onclick = cellClicked;
    }
}

function cellClicked(event) {

    setErrorBoxText("\n");

    let row = Number (this.dataset.row);
    let col = Number (this.dataset.col);
    let coordinate = new Coordinate(col, row);

    if (engine.gamePhase === GAME_PHASES.DROP_PHASE)
        try {
            engine.claimCell(coordinate);
        } catch (e) {
            setErrorBoxText(e.message);

        } else if (engine.gamePhase === GAME_PHASES.MOVE_PHASE) {
        if (cellToMove === undefined && engine.isTokenMovable(coordinate)) {
            cellToMove = coordinate;
            focusedCell = this;
            focusToken(this);
        } else {
            let direction = Direction.getDirection(cellToMove, coordinate);
            try{
                engine.moveToken(cellToMove, direction);
            } catch (e) {
                setErrorBoxText(e)
            } finally {
                cellToMove = undefined;
                unFocusToken(focusedCell);
                console.log(this);
            }
        }
    }
    updateBoard();
    displayStats();
    console.log(engine);
}

function focusToken(element){
    element.classList.add("focused-token")
}

function unFocusToken(element){
    element.classList.remove("focused-token");
}

function updateBoard(){

    for (const row of displayBoardRows) {
        let cellsInRow = row.querySelectorAll('.js-cell');
        for (const cell of cellsInRow)  {
            let row = Number (cell.dataset.row);
            let col = Number (cell.dataset.col);
            let coordinate = new Coordinate(col, row);

            let color;

            if (engine.board.getCellOwner(coordinate) === engine.firstPlayer){
                color = firstPlayerColor;
            } else if (engine.board.getCellOwner(coordinate) === engine.secondPlayer){
                color = secondPlayerColor;
            } else {
                color = emptyCellColor;
            }
            cell.classList.add("red");
            setCellColor(cell, color)
        }
    }
}

function setCellColor(element, color) {
    clearCellColor(element);
    element.classList.add(color)
}

function clearCellColor(element) {
    if (element.classList.contains(firstPlayerColor)){
        element.classList.remove(firstPlayerColor);
    }
    if (element.classList.contains(secondPlayerColor)){
        element.classList.remove(secondPlayerColor);
    }
    if (element.classList.contains(emptyCellColor)){
        element.classList.remove(emptyCellColor);
    }
}

function displayStats() {
    displayTokenCount();
    displayWhoseTurnItIs();
    displayGamePhase()
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