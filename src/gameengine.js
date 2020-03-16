import GameBoard from "./gameBoard.js";
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
        this.whoseTurn = this.firstPlayer;
        this.boardScanner = new BoardScanner(this.board);
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
            throw new IllegalGamePhaseException(`Cannot claim cells in game phase: ${this.gamePhase}`);
        }
        if (!this.board.isCellUnclaimed(coordinates)){
            throw new IllegalCellClaimException(`Cell is already claimed by player ${this.board.getCellOwner(coordinates)}`)
        }
        if (!this.boardScanner.isClaimingCellLegal(coordinates)) {
            throw new IllegalCellClaimException(
                "Cannot claim cell, illegal move"
            )
        }
        if (this.whoseTurn.tokenCount < 1){
            throw new IllegalCellClaimException(
                `Cannot claim cell, ${this.whoseTurn} does not have any tokens left`
            )
        }
        this.board.setCellOwner(coordinates, this.whoseTurn);
        this.whoseTurn.tokenCount--;
        this.changeWhoseTurnItIs();

        if (this._areAllTokensSpent()){
            this._startMovePhase();
        }
    }

    moveToken(coordinates, direction){
        if (this.gamePhase !== GAME_PHASES.MOVE_PHASE){
            throw new IllegalGamePhaseException(`Cannot move tokens in game phase: ${this.gamePhase}`);
        }

        if (this.board.getCellOwner(coordinates) !== this.whoseTurn) {
            throw new IllegalTokenMoveException(`This token doesn't belong to you!`)
        }

        if (! this.boardScanner.isMovingTokenLegal(coordinates, direction)){
            throw new IllegalTokenMoveException('Cannot move token in given direction');
        }
        this.board.removeCellOwner(coordinates);
        this.board.setCellOwner(coordinates.addDirection(direction), this.whoseTurn);
        if (this.boardScanner.isNoMovesLeftFor(this.whoseTurn)) {
            this.gamePhase = GAME_PHASES.GAME_OVER;
        }
    };


    changeWhoseTurnItIs() {
        if (this.whoseTurn === this.firstPlayer){
            this.whoseTurn = this.secondPlayer;
        } else if (this.whoseTurn === this.secondPlayer){
            this.whoseTurn = this.firstPlayer;
        } else {
            throw new UnknownPlayerException(`Cannot change turn, unknown player: ${this.whoseTurn}`)
        }
    }

    get winner(){
        return this.whoseTurn;
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

IllegalTokenMoveException.prototype = Object.create(Error.prototype);
IllegalGamePhaseException.prototype = Object.create(Error.prototype);
IllegalCellClaimException.prototype = Object.create(Error.prototype);
UnknownPlayerException.prototype = Object.create(Error.prototype);