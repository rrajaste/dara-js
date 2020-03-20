import GameBoard from "./gameboard.js";
import {GAME_PHASES} from "./gamephases.js";
import {PLAYER_TYPES} from "./playertypes.js";
import BoardScanner from "./boardscanner.js";
import Player from "./player.js";


export default class GameEngine {

    constructor() {
        this.board = new GameBoard();
        this.gamePhase = GAME_PHASES.NOT_STARTED;
        this.firstPlayer = new Player(PLAYER_TYPES.FIRST_PLAYER);
        this.secondPlayer = new Player(PLAYER_TYPES.SECOND_PLAYER);
        this.activePlayer = this.firstPlayer;
        this.passivePlayer = this.secondPlayer;
        this.boardScanner = new BoardScanner(this.board);
        this.coordinatesOfThreeInRows = [];
        this.lastMoveCausedThreeInARow = false;
    }

    startGame(){
        if (this.gamePhase !== GAME_PHASES.NOT_STARTED) {
            throw new IllegalGamePhaseException("Cannot start a game, game is already in progress")
        }
        this._startDropPhase();
    }

    _startDropPhase(){
        if (this.gamePhase !== GAME_PHASES.NOT_STARTED) {
            throw new IllegalGamePhaseException(
                `Drop phase can only be started once per game and as the first phase. Current phase: ${this.gamePhase}`
            );
        }
        this.gamePhase = GAME_PHASES.DROP_PHASE;
    }

    _startMovePhase(){
        if (this.gamePhase !== GAME_PHASES.DROP_PHASE) {
            throw new IllegalGamePhaseException(
                `Move phase can only be started after drop phase. Current phase: ${this.gamePhase}`
            );
        }
        this.gamePhase = GAME_PHASES.MOVE_PHASE;
    }

    _areAllTokensSpent(){
        return this.firstPlayer.unusedTokenCount === 0 && this.secondPlayer.unusedTokenCount === 0;
    }

    isTokenOwnedByActivePlayer(coordinate){
        return this.board.getCellOwner(coordinate) === this.activePlayer;
    }

    claimCell(coordinates){

        if (this.gamePhase !== GAME_PHASES.DROP_PHASE) {
            throw new IllegalGamePhaseException(
                `Cannot claim cells in game phase: ${this.gamePhase}`);
        }
        if (this.board.getCellOwner(coordinates) === this.passivePlayer){
            throw new IllegalCellClaimException(
                `This cell is already claimed by player ${this.board.getCellOwner(coordinates).name}`)
        }
        if (this.board.getCellOwner(coordinates) === this.activePlayer){
            throw new IllegalCellClaimException(
                `This cell is already claimed by you`)
        }
        if (!this.boardScanner.isClaimingCellLegal(coordinates, this.activePlayer)) {
            throw new IllegalCellClaimException(
                "Cannot claim cell, illegal move"
            )
        }
        if (this.activePlayer.unusedTokenCount < 1){
            throw new IllegalCellClaimException(
                `Cannot claim cell, ${this.activePlayer} does not have any tokens left`
            )
        }
        this.board.setCellOwner(coordinates, this.activePlayer);
        this.activePlayer.unusedTokenCount--;

        this.changeWhoseTurnItIs();

        if (this._areAllTokensSpent()){
            this._startMovePhase();
        }
    }

    moveToken(coordinates, direction){

        this.resetThreeInARowFlag();

        let destination = coordinates.addDirection(direction);

        if (this.gamePhase !== GAME_PHASES.MOVE_PHASE){
            throw new IllegalGamePhaseException(
                `Cannot move tokens in game phase: ${this.gamePhase}`);
        }

        if (! this.board.isCellEmpty(destination)){
            throw new IllegalTokenMoveException("Can only move token to an empty cell");
        }

        if (this.board.getCellOwner(coordinates) !== this.activePlayer) {
            throw new IllegalTokenMoveException(
                `This token doesn't belong to you!`)
        }

        if (destination.equals(coordinates)){
            throw new IllegalTokenMoveException("Choose a destination")
        }

        if (this.board.isCellEmpty(coordinates)) {
            throw new IllegalTokenMoveException(
                `This cell is empty`)
        }

        if (! this.boardScanner.isMovingTokenLegal(coordinates, direction)){
            throw new IllegalTokenMoveException(
                'Cannot move token in given direction');
        }

        if (this.boardScanner.doesMovingTokenCauseNInARow(3, coordinates, destination)) {
            this.lastMoveCausedThreeInARow = true;
        }

        this.board.removeCellOwner(coordinates);
        this.board.setCellOwner(destination, this.activePlayer);
        this._updateCoordinatesOfThreeInRows();

        if (this.lastMoveCausedThreeInARow === false){
            this.changeWhoseTurnItIs();
        }
    };

    resetThreeInARowFlag(){
        this.lastMoveCausedThreeInARow = false;
    }

    removeToken(coordinates){

        this.resetThreeInARowFlag();

        let cellOwner = this.board.getCellOwner(coordinates);

        if (cellOwner === this.activePlayer || cellOwner === undefined){
            throw new IllegalCellRemoveException("Cannot remove this token");
        }
        if (this.isCellPartOfThreeInARow(coordinates)){
            throw new IllegalCellRemoveException("Cannot remove this token, it's part of a three-in-a-row")
        }

        this.board.removeCellOwner(coordinates);
        this.passivePlayer.totalTokenCount--;

        this._updateCoordinatesOfThreeInRows();
        this._checkForVictory();
        this.changeWhoseTurnItIs();
    }

    _updateCoordinatesOfThreeInRows(){
        this.coordinatesOfThreeInRows = this.boardScanner
            .getAllCellCoordinatesThatArePartOfThreeInARow(this.activePlayer)
            .concat(this.boardScanner.getAllCellCoordinatesThatArePartOfThreeInARow(this.passivePlayer));
        console.log("ThreeInRows", this.coordinatesOfThreeInRows)
    };

    _checkForVictory() {
        if (this.passivePlayer.totalTokenCount <= 2){
            this.gamePhase = GAME_PHASES.GAME_OVER;
        }
    }

    isCellPartOfThreeInARow(coordinateToFind){
        for (let i = 0; i < this.coordinatesOfThreeInRows.length; i++) {
            let cellCoordinate = this.coordinatesOfThreeInRows[i];
            if (cellCoordinate.equals(coordinateToFind)){
                return true;
            }
        }
        return false;
    }

    changeWhoseTurnItIs() {
        let tmp = this.activePlayer;
        this.activePlayer = this.passivePlayer;
        this.passivePlayer = tmp;
    }

    get winner(){
        return this.activePlayer;
    }
}

function IllegalGamePhaseException(message) {
    return new Error(message);
}

function IllegalCellClaimException(message) {
    return new Error(message);
}

function IllegalTokenMoveException(message) {
    return new Error(message);
}

function UnknownPlayerException(message) {
    return new Error(message);
}

function IllegalCellRemoveException(message) {
    return new Error(message);
}

IllegalTokenMoveException.prototype = Object.create(Error.prototype);
IllegalGamePhaseException.prototype = Object.create(Error.prototype);
IllegalCellClaimException.prototype = Object.create(Error.prototype);
IllegalCellRemoveException.prototype = Object.create(Error.prototype);
UnknownPlayerException.prototype = Object.create(Error.prototype);