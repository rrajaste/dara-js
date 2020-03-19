import gameengine from "./gameengine";

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
let cellToMove;
let focusedCell;
let selectedCoordinate;
let movePhaseAction;


engine.firstPlayer.name = "First player";
engine.secondPlayer.name = "Second player";
engine.startGame();
displayStats();
setErrorBoxText("\n");

console.log(engine);

const ACTIONS = {
    SELECT_CELL: 1,
    REMOVE_CELL: 2,
    MOVE_CELL: 3
};

movePhaseAction = ACTIONS.SELECT_CELL;

for (const row of displayBoardRows) {
    let cells = row.querySelectorAll('.js-cell');
    for (const cell of cells)  {
        cell.onclick = cellClicked;
    }
}

function cellClicked(event) {
    setErrorBoxText("\n");
    if (engine.gamePhase !== GAME_PHASES.GAME_OVER){
        let row = Number (this.dataset.row);
        let column = Number (this.dataset.col);
        selectedCoordinate = new Coordinate(column, row);
        if (engine.gamePhase === GAME_PHASES.DROP_PHASE){
            handleDropPhaseCellClick();
        } else if (engine.gamePhase === GAME_PHASES.MOVE_PHASE) {
            handleMovePhaseCellClick(this);
        }
        updateBoard();
        displayStats();
    }
    console.log(engine);
}

function handleDropPhaseCellClick(){
    try {
        engine.claimCell(selectedCoordinate);
    } catch (e) {
        setErrorBoxText(e.message);
    }
}

function handleMovePhaseCellClick(element){
    if (movePhaseAction === ACTIONS.SELECT_CELL) {
        handleCellSelection(element);
    } else if (movePhaseAction === ACTIONS.MOVE_CELL) {
        handleCellMoving();
    } else if (movePhaseAction === ACTIONS.REMOVE_CELL){
        handleCellRemoval();
    }
}

function handleCellSelection(element) {
    if (engine.isTokenOwnedByActivePlayer(selectedCoordinate)){
        cellToMove = selectedCoordinate;
        focusToken(element);
        movePhaseAction = ACTIONS.MOVE_CELL;
    } else {
        movePhaseAction = ACTIONS.SELECT_CELL;
    }
}

function handleCellRemoval() {
    try{
        engine.removeToken(selectedCoordinate);
        movePhaseAction = ACTIONS.SELECT_CELL;
    } catch (e) {
        setErrorBoxText(e);
    }
}

function handleCellMoving(){
    let direction = Direction.getDirection(cellToMove, selectedCoordinate);
    try{
        engine.moveToken(cellToMove, direction);
    } catch (e) {
        setErrorBoxText(e)
    } finally {
        movePhaseAction = ACTIONS.SELECT_CELL;
        unFocusToken(focusedCell);
    }
    if (engine.lastMoveCausedThreeInARow){
        movePhaseAction = ACTIONS.REMOVE_CELL;
    }
}

function focusToken(element){
    element.classList.add("focused-token");
    focusedCell = element;
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
    document.getElementById("first-player-token-counter").innerText = engine.firstPlayer.unusedTokenCount;
    document.getElementById("second-player-token-counter").innerText = engine.secondPlayer.unusedTokenCount;
}

function displayGamePhase() {
    document.getElementById("game-phase").innerText = engine.gamePhase;
}

function displayWhoseTurnItIs() {
    document.getElementById("whose-turn").innerText = engine.activePlayer.name;
}