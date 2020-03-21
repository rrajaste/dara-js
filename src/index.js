import {GAME_PHASES} from "./gamephases.js";
import Direction from "./direction.js";
import GameEngine from "./gameengine.js";
import Coordinate from "./coordinate.js";
import AI from "./ai.js";
import TokenMove from "./tokenMove.js";
import ai from "./ai";

// TODO: add messages
// TODO: add return to menu button

let engine = new GameEngine();
let displayBoard = document.querySelector('#gameBoard');
let displayBoardRows = displayBoard.querySelectorAll('.js-board-row');
let newGameButton  = document.querySelector('#new-game-button');
let toggleRulesButton = document.querySelector('#toggle-rules');
let firstPlayerColor = "green";
let secondPlayerColor = "blue";
let emptyCellColor = "brown";
let areRulesVisible = true;
let cellToMove;
let focusedCell;
let selectedCoordinate;
let movePhaseAction;
let displayCells = [];
let isBoardInteractable = true;
let Ai;
let aiThinkTime = 1000;
let aiClickCounter = 0;

engine.firstPlayer.name = "First player";
engine.secondPlayer.name = "Second player";

newGameButton.onclick = startNewGame;
toggleRulesButton.onclick = handleRulesToggle;

displayStats();
setErrorBoxText("\n");

console.log(engine);

const ACTIONS = {
    SELECT_CELL: "SELECT_CELL",
    REMOVE_CELL: "REMOVE_CELL",
    MOVE_CELL: "MOVE_CELL"
};

const GAME_MODES = {
    PLAYER_VS_AI: 0,
    PLAYER_VS_PLAYER: 1,
    AI_VS_PLAYER: 2,
    AI_VS_AI: 3
};

movePhaseAction = ACTIONS.SELECT_CELL;

function handleRulesToggle() {
    if (areRulesVisible){
        hideRules();
    } else {
        showRules();
    }
}

function startNewGame(event) {
    setPlayerNames();
    setUpDisplayBoard();
    engine.startGame();
    hideSettingsPanel();
    hideRules();
    showGameBoard();
    showGameInfoPanel();
    setAi();

    if (engine.firstPlayer.isAi){
        aiMakeMove();
    }
}

function setPlayerNames() {
    let firstPlayerName = document.querySelector('#first-player-name').value;
    let secondPlayerName = document.querySelector('#second-player-name').value;
    if (firstPlayerName !== undefined){
        engine.firstPlayer.name = firstPlayerName;
    }
    if (secondPlayerName !== undefined){
        engine.secondPlayer.name = secondPlayerName;
    }
}

function setAi(){
    engine.firstPlayer.isAi = document.querySelector('#first-player-switch').checked;
    engine.secondPlayer.isAi = document.querySelector('#second-player-switch').checked;
    if (engine.firstPlayer.isAi || engine.secondPlayer.isAi){
        Ai = new AI(engine.board);
    }
}

function setUpDisplayBoard() {
    for (const row of displayBoardRows) {
        let cells = row.querySelectorAll('.js-cell');
        for (const cell of cells)  {
            cell.onclick = cellClicked;
            displayCells.push(cell);
        }
    }
}

function cellClicked(event) {
    if (!wasCellClickedByPlayer(event)){
        handleCellClick(this);
    } else if (wasCellClickedByPlayer(event) && isPlayersTurn()){
        handleCellClick(this);
    }
}

function isPlayersTurn() {
    return !engine.activePlayer.isAi;
}

function handleCellClick(element) {
    setErrorBoxText("\n");
    if (isBoardInteractable){
        let row = Number (element.dataset.row);
        let column = Number (element.dataset.col);
        selectedCoordinate = new Coordinate(column, row);
        if (engine.gamePhase === GAME_PHASES.DROP_PHASE){
            handleDropPhaseCellClick(element);
        } else if (engine.gamePhase === GAME_PHASES.MOVE_PHASE) {
            handleMovePhaseCellClick(element);
        }
        updateBoard();
        displayStats();
        console.log("is player ai", engine.activePlayer.isAi);
        console.log("active player", engine.activePlayer);
        if (engine.activePlayer.isAi){
            aiMakeMove();
        }
    }
}

function handleDropPhaseCellClick(element){
    try{
        engine.claimCell(selectedCoordinate);    
    } catch (e) {
        console.log(e);
        setErrorBoxText(e.message);
        showTokenAsUnselectable(element);
    }
}

function handleMovePhaseCellClick(element){
    if (movePhaseAction === ACTIONS.SELECT_CELL) {
        handleCellSelection(element);
    } else if (movePhaseAction === ACTIONS.MOVE_CELL) {
        handleCellMoving(element);
    } else if (movePhaseAction === ACTIONS.REMOVE_CELL){
        handleCellRemoval(element);
    }
}

function handleCellSelection(element) {
    if (engine.isTokenOwnedByActivePlayer(selectedCoordinate)){
        cellToMove = selectedCoordinate;
        focusToken(element);
        movePhaseAction = ACTIONS.MOVE_CELL;
    } else {
        showTokenAsUnselectable(element);
        movePhaseAction = ACTIONS.SELECT_CELL;
    }
}

function handleCellRemoval(element) {
        try{
            engine.removeToken(selectedCoordinate);
            movePhaseAction = ACTIONS.SELECT_CELL;
        } catch (e) {
            showTokenAsUnselectable(element);
        }
}

function handleCellMoving(element){
    let direction = Direction.getDirection(cellToMove, selectedCoordinate);
    try{
        let move = new TokenMove(cellToMove, direction);
        engine.moveToken(move);
        movePhaseAction = ACTIONS.SELECT_CELL;
        if (engine.lastMoveCausedThreeInARow){
            displayThreeInARow();
            movePhaseAction = ACTIONS.REMOVE_CELL;
        }
    } catch (e) {
        console.log(e);
        showTokenAsUnselectable(element);
        movePhaseAction = ACTIONS.SELECT_CELL;
    } finally {
        unFocusToken(focusedCell);
    }
}

function aiMakeMove() {
    console.log("AI MOVED");
    if (engine.gamePhase === GAME_PHASES.DROP_PHASE){
        aiClickCell(Ai.getTokenDropCoordinatesFor(engine.activePlayer));
    } else if (engine.gamePhase === GAME_PHASES.MOVE_PHASE){
        let coords;
        if (movePhaseAction === ACTIONS.SELECT_CELL){
            coords = Ai.getTokenToMoveCoordinatesFor(engine.activePlayer)
        } else if (movePhaseAction === ACTIONS.MOVE_CELL){
            coords = Ai.getDestinationCellCoordinatesFor(engine.activePlayer);
        } else if (movePhaseAction === ACTIONS.REMOVE_CELL) {
            coords = Ai.getCoordinatesToRemoveTokenFrom(engine.passivePlayer)
        }
        aiClickCell(coords);
    }
}

function aiClickCell(coordinate) {
    let displayCellToClick = getDisplayCell(coordinate);
    let timerHandler = function(){
        aiClickCounter++;
        displayCellToClick.click();

    };
    setTimeout(timerHandler, aiThinkTime);

}

function getDisplayCell(coordinates) {
    for (let i = 0; i < displayCells.length; i++) {
        let displayCell = displayCells[i];
        let row = Number (displayCell.dataset.row);
        let col = Number (displayCell.dataset.col);
        let displayCellCoordinate = new Coordinate(col, row);
        if (coordinates.equals(displayCellCoordinate)){
            return displayCell
        }
    }
}

function wasCellClickedByPlayer(event) {
    return event.isTrusted;
}


function displayThreeInARow(){
    for (let i = 0; i < displayCells.length; i++) {
        let displayCell = displayCells[i];
        let row = Number (displayCell.dataset.row);
        let col = Number (displayCell.dataset.col);
        let coordinate = new Coordinate(col, row);
        if (engine.isCellPartOfThreeInARow(coordinate) && engine.board.getCellOwner(coordinate) === engine.activePlayer){
            showTokenAsPartOfThreeInARow(displayCell);
        }
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

    let updateCellColor = function (cell) {
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
        setCellColor(cell, color)
    };

    displayCells.forEach(updateCellColor);
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

function hideSettingsPanel() {
    document.querySelector('#settings-panel').style.display = 'none';
}

function showSettingsPanel() {
    document.querySelector("#settings-panel").style.display = 'block';
}

function showGameInfoPanel() {
    document.querySelector("#game-info-panel").style.display = 'block';
}

function hideGameInfoPanel() {
    document.querySelector("#game-info-panel").style.display = 'none';
}

function showGameBoard() {
    document.querySelector("#gameBoard").style.display = 'block';
}

function hideGameBoard() {
    document.querySelector("#gameBoard").style.display = 'none';
}

function showRules() {
    hideGameBoard();
    areRulesVisible = true;
    document.querySelector("#rules-panel").style.display = 'block';
    toggleRulesButton.innerText = "CLOSE RULES"
}

function hideRules() {
    areRulesVisible = false;
    document.querySelector("#rules-panel").style.display = 'none';
    showGameBoard();
    toggleRulesButton.innerText = "SHOW RULES"
}

function showTokenAsUnselectable(element) {

    let blinkCounter = 0;
    let nrOfBlinks = 3;
    element.classList.add("unselectable");
    let blink = function () {
        element.classList.remove("unselectable");
        blinkCounter++;
        if (blinkCounter < nrOfBlinks){
            setTimeout(blink, 100);
        }
    };
    setTimeout(blink, 100);
}

function showTokenAsPartOfThreeInARow(element) {

    // TODO: make this nice

    element.classList.add("threeInARowElement");
    let blink = function () {
        element.classList.remove("threeInARowElement");
        setTimeout(blinkAgain, 200);
    };

    let blinkOnceMore = function () {
        element.classList.remove("threeInARowElement");
    };

    let blinkAgain = function(){
        element.classList.add("threeInARowElement");
        setTimeout(blinkOnceMore, 200)
    };
    setTimeout (blink, 200);
}

function blinkElementInColor(element, colorClass, blinkTime) {
    element.classList.add(colorClass);
    let removeColorClass = function(){
        element.classList.remove(colorClass)
    };
    setTimeout(removeColorClass, blinkTime);
}