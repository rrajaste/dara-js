import GameBoard from "./gameBoard";

export default class GameEngine {

    constructor() {
        this.board = new GameBoard();
        this.gamePhase = GamePhases.NOT_STARTED;
        this.firstPlayerTokens = 12;
        this.secondPlayerTokens = 12;
        this.whoseTurn = PlayerTypes.FIRST_PLAYER;
    }

    startDropPhase(){
        if (this.gamePhase !== GamePhases.NOT_STARTED) {
            throw new IllegalGamePhaseException(
                `Drop phase can only be started once per game and as the first phase. Current phase: ${this.gamePhase}`
            );
        }
        this.gamePhase = GamePhases.MOVE_PHASE;
    }

    startMovePhase(){
        if (this.gamePhase !== GamePhases.DROP_PHASE) {
            throw new IllegalGamePhaseException(
                `Move phase can only be started after drop phase. Current phase: ${this.gamePhase}`
            );
        }
        this.gamePhase = GamePhases.MOVE_PHASE;
    }

    dropToken(row, column, claimer){

        if (this.gamePhase !== GamePhases.DROP_PHASE) {
            throw new IllegalGamePhaseException(`Cannot drop tokens in game phase: ${this.gamePhase}`);
        }

        if (this.board.getCellOwner(row, column) !== PlayerTypes.NO_PLAYER) {
            throw new IllegalCellClaimException(
                "Cannot drop a token on already claimed cell."
            )
        }
        this.board.setCellOwner(row, column, claimer);

        this.decrementActivePlayerUnusedTokenCount();
    }

    _decrementActivePlayerUnusedTokenCount(){
        if (#whoseTurn === PlayerTypes.FIRST_PLAYER) {
            #firstPlayerTokens--;
        } else if (#whoseTurn === PlayerTypes.SECOND_PLAYER) {
            #secondPlayerTokens--;
        } else {
            throw new UnknownPlayerException(`Unknown player type: '${#whoseTurn}'`);
        }
    }

    isThreeInARow(row, column){
        for (let i = 0; i < this.board.numberOfRows; i++) {

        }
    }

}

function IllegalGamePhaseException(message) {
    return new Error(message);
}

function IllegalCellClaimException(message) {
    return new Error(message);
}

function UnknownPlayerException(message) {
    return new Error(message);
}

IllegalGamePhaseException.prototype = Object.create(Error.prototype);
IllegalCellClaimException.prototype = Object.create(Error.prototype);
UnknownPlayerException.prototype = Object.create(Error.prototype);