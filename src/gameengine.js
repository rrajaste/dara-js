"use strict";

class GameEngine {

    #numberOfRows = 5;
    #numberOfColumns = 6;
    #board;
    #whoseTurn;
    #gamePhase;
    #firstPlayerTokens;
    #secondPlayerTokens;

    constructor() {
        #board = new GameBoard(#numberOfRows, #numberOfColumns);
        #gamePhase = GamePhases.NOT_STARTED;
        #firstPlayerTokens = 12;
        #secondPlayerTokens = 12;
        #whoseTurn = PlayerTypes.FIRST_PLAYER;
    }

    startDropPhase(){
        if (#gamePhase !== GamePhases.NOT_STARTED) {
            throw new IllegalGamePhaseException(
                `Drop phase can only be started once per game and as the first phase. Current phase: ${#gamePhase}`
            );
        }
        #gamePhase = GamePhases.MOVE_PHASE;
    }

    startMovePhase(){
        if (#gamePhase !== GamePhases.DROP_PHASE) {
            throw new IllegalGamePhaseException(
                `Move phase can only be started after drop phase. Current phase: ${#gamePhase}`
            );
        }
        #gamePhase = GamePhases.MOVE_PHASE;
    }

    dropToken(row, column, claimer){

        if (#gamePhase !== GamePhases.DROP_PHASE) {
            throw new IllegalGamePhaseException(`Cannot drop tokens in game phase: ${#gamePhase}`);
        }

        if (#board.getCellOwner(row, column) !== PlayerTypes.NO_PLAYER) {
            throw new IllegalCellClaimException(
                "Cannot drop a token on already claimed cell."
            )
        }
        #board.setCellOwner(row, column, claimer);

        #decrementActivePlayerUnusedTokenCount();
    }

    get gamePhase(){
        return #gamePhase;
    }

    #decrementActivePlayerUnusedTokenCount(){
        if (#whoseTurn === PlayerTypes.FIRST_PLAYER) {
            #firstPlayerTokens--;
        } else if (#whoseTurn === PlayerTypes.SECOND_PLAYER) {
            #secondPlayerTokens--;
        } else {
            throw new UnknownPlayerException(`Unknown player type: '${#whoseTurn}'`);
        }
    }

    #isThreeInARow(row, column){
        for (let i = 0; i < #board.numberOfRows; i++) {

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