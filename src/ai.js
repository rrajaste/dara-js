import BoardScanner from "./boardscanner";

export default class AI{

    constructor(gameBoard) {
        this.boardScanner = new BoardScanner(gameBoard);
    }

    getTokenDropCoordinatesFor(player) {
        return this._getRandomAvailableCellCoordinatesFor(player);
    }

    getDestinationCellCoordinatesFor(player) {
        if (this.lastChosenMove === undefined){
            throw new Error(
                `Cannot get destination cell coordinates for player ${player.name} - 
                    player did not perform previous cell selection`);
        }
        else {
            let coordinate = this.lastChosenMove.coordinate.addDirection(this.lastChosenMove.direction);
            this.lastChosenMove = undefined;
            return coordinate;
        }
    }

    getTokenToMoveCoordinatesFor(player) {
        let move;
        let allPossibleMoves = this.boardScanner.getAllPossibleMovesFor(player);
        let preferredMoves = this._getPreferredMovesFromArray(allPossibleMoves);
        if (preferredMoves.length !== 0){
            move = AI._getElementFromArray(preferredMoves);
        } else {
            move = AI._getElementFromArray(allPossibleMoves);
        }
        this.lastChosenMove = move;
        return move.coordinate;
    }

    getCoordinatesToRemoveTokenFrom(player) {
        return this._getCoordinatesForRandomTokenToRemoveFrom(player);
    }

    _getPreferredMovesFromArray(allMoves){
        let preferredMoves = [];
        let boardScanner = this.boardScanner;
        let checkMove = function(move){
            if (boardScanner.doesMovingTokenCauseNInARow(3, move)){
                preferredMoves.push(move);
            }
        };
        allMoves.forEach(checkMove);
        return preferredMoves;
    }

    _getCoordinatesForRandomTokenToRemoveFrom(player){
        let cells = this.boardScanner.getCoordinatesForAllPossibleTokensToRemoveFrom(player);
        return AI._getElementFromArray(cells);
    }

    _getRandomAvailableCellCoordinatesFor(player) {
        let cells = this.boardScanner.getCoordinatesToAllAvailableCellsFor(player);
        return AI._getElementFromArray(cells);
    }

    static _getElementFromArray(array){
        return array[Math.floor(Math.random() * array.length)];
    }
}
