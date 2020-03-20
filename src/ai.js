import BoardTraverser from "./boardTraverser.js";
import BoardScanner from "./boardscanner.js";
import Direction from "./direction.js";
import tokenMove from "./tokenMove";

export default class AI{
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.boardTraverser = new BoardTraverser(this.gameBoard);
        this.boardScanner = new BoardScanner(this.gameBoard);
    }

    getTokenDropCoordinatesFor(player){
        return this._getRandomAvailableCellCoordinatesFor(player);
    }

    getDestinationCellCoordinatesFor(player){
        return this.initiatedMove.coordinates.addDirection(this.initiatedMove.direction);
    }

    getTokenToRemoveCoordinatesFor(player){
        return this._getCoordinatesForRandomTokenToRemoveFor(player);
    }

    _getCoordinatesForRandomTokenToRemoveFor(player){
        this._getRandomElementFromArray(this._getCoordinatesForAllPossibleTokensToRemoveFor(player));
    }

    _getCoordinatesForAllPossibleTokensToRemoveFor(player){
        let availableCoordinates = [];
        let cellsPartOfThreeInRows = this.boardScanner.getAllCellCoordinatesThatArePartOfThreeInARow(player);
        let validateCell = function (coordinate) {
            if (!coordinate.isInArray(cellsPartOfThreeInRows)){
                availableCoordinates.push(coordinate);
            }
        };
        for (let i = 0; i < this.gameBoard.numberOfRows; i++) {
            this.boardTraverser.traverseRow(i, validateCell)
        }
        return availableCoordinates;
    }

    getTokenToMoveCoordinatesFor(player){
        let move;
        this._findPossibleMovesForPlayer(player);
        if (this.allPreferredMoves.length !== 0){
            move = this._getRandomElementFromArray(this.allPreferredMoves);
        } else {
            move = this._getRandomElementFromArray(this.allLegalMoves);
        }
        this.initiatedMove = move;
        return move.coordinates;
    }

    _findPossibleMovesForPlayer(player){
        let allLegalMoves = [];
        let allPreferredMoves = [];
        let directions = Direction.getAllOrthogonalDirections();
        let boardScanner = this.boardScanner;
        let validateCell = function (returnedCoordinate) {
            for (let i = 0; i < directions.length; i++) {
                let direction = directions[i];
                if (boardScanner.isMovingTokenLegal(returnedCoordinate, direction)){
                    let move = new tokenMove(returnedCoordinate, direction);
                    if (boardScanner.doesMovingTokenCauseNInARow(3, returnedCoordinate, direction)){
                        allPreferredMoves.push(move);
                    } else {
                        allLegalMoves.push(move);
                    }
                }
            }
        };
        for (let i = 0; i < this.gameBoard.numberOfRows; i++) {
            this.boardTraverser.traverseRow(i, validateCell)
        }
        this.allLegalMoves = allLegalMoves;
        this.allPreferredMoves = allPreferredMoves;
    }

    _getRandomAvailableCellCoordinatesFor(player){
        let cells = this._getCoordinatesToAllAvailableCellsFor(player);
        return this._getRandomElementFromArray(cells);
    }

    _getCoordinatesToAllAvailableCellsFor(player){
        let availableCoordinates = [];
        let boardScanner = this.boardScanner;
        let validateCell = function (coordinate) {
            if (boardScanner.isClaimingCellLegal(coordinate, player)){
                availableCoordinates.push(coordinate);
            }
        };
        for (let i = 0; i < this.gameBoard.numberOfRows; i++) {
            this.boardTraverser.traverseRow(i, validateCell)
        }
        return availableCoordinates;
    }

    _getRandomElementFromArray(array){
        return array[Math.floor(Math.random() * array.length)];
    }
}