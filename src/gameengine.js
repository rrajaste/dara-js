import Gameboard from "./gameboard.js";
import {GAME_PHASES} from "./gamephases.js";
import {PLAYER_TYPES} from "./playertypes.js";
import BoardScanner from "./boardscanner.js";
import Player from "./player.js";


export default class GameEngine {

    constructor() {
        this.board = new Gameboard();
        this.gamePhase = GAME_PHASES.NOT_STARTED;
        this.firstPlayer = new Player(PLAYER_TYPES.FIRST_PLAYER);
        this.secondPlayer = new Player(PLAYER_TYPES.SECOND_PLAYER);
        this.activePlayer = this.firstPlayer;
        this.passivePlayer = this.secondPlayer;
        this.boardScanner = new BoardScanner(this.board);
        this.coordinatesOfThreeInRows = [];
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
        return this.firstPlayer.tokenCount === 0 && this.secondPlayer.tokenCount === 0;
    }

    claimCell(coordinates){

        if (this.gamePhase !== GAME_PHASES.DROP_PHASE) {
            throw new IllegalGamePhaseException(
                `Cannot claim cells in game phase: ${this.gamePhase}`);
        }
        if (!this.board.isCellUnclaimed(coordinates)){
            throw new IllegalCellClaimException(
                `Cell is already claimed by player ${this.board.getCellOwner(coordinates)}`)
        }
        if (!this.boardScanner.isClaimingCellLegal(coordinates, this.activePlayer)) {
            throw new IllegalCellClaimException(
                "Cannot claim cell, illegal move"
            )
        }
        if (this.activePlayer.tokenCount < 1){
            throw new IllegalCellClaimException(
                `Cannot claim cell, ${this.activePlayer} does not have any tokens left`
            )
        }
        this.board.setCellOwner(coordinates, this.activePlayer);
        this.activePlayer.tokenCount--;

        this.changeWhoseTurnItIs();

        if (this._areAllTokensSpent()){
            this._startMovePhase();
        }
    }

    isTokenMovable(coordinates){
        return (
            this.board.getCellOwner(coordinates) === this.activePlayer
            && !this.board.isCellFrozen(coordinates)
        )
    }

    moveToken(coordinates, direction){

        let destination = coordinates.addDirection(direction);

        if (this.gamePhase !== GAME_PHASES.MOVE_PHASE){
            throw new IllegalGamePhaseException(
                `Cannot move tokens in game phase: ${this.gamePhase}`);
        }

        if (this.board.getCellOwner(destination) !== undefined){
            throw new IllegalTokenMoveException;
        }

        if (this.board.getCellOwner(coordinates) !== this.activePlayer) {
            throw new IllegalTokenMoveException(
                `This token doesn't belong to you!`)
        }

        if (! this.boardScanner.isMovingTokenLegal(coordinates, direction)){
            throw new IllegalTokenMoveException(
                'Cannot move token in given direction');
        }


        this.board.removeCellOwner(coordinates);
        this.board.setCellOwner(destination, this.activePlayer);

        if (this.boardScanner.doesClaimingCellCauseNInARow(3, coordinates, this.activePlayer)){
            this.coordinatesOfThreeInRows = this.boardScanner.getAllCellCoordinatesThatArePartOfThreeInARow(this.activePlayer);
        }

        this.changeWhoseTurnItIs();

        // if (this.boardScanner.isNoMovesLeftFor(this.whoseTurn)) {
        //     this.gamePhase = GAME_PHASES.GAME_OVER;
        // }
    };

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