import BoardTraverser from "./boardTraverser.js";
import Coordinate from "./coordinate";
import gameboard from "./gameboard";

export default class BoardScanner{

    constructor(gameBoard){
        this.gameBoard = gameBoard;
        this.traverser = new BoardTraverser(this.gameBoard);
    }

    isMovingTokenLegal(coordinate, direction){

        let destinationCoordinate = coordinate.addDirection(direction);
        let claimer = this.gameBoard.getCellOwner(coordinate);

        if (!direction.isOrthogonal()){
            return false;
        }
        if (this.gameBoard.isCellFrozen(coordinate)){
            return false;
        }
        if (this.gameBoard.getCellOwner(destinationCoordinate) !== undefined){
            return false;
        }
        this.gameBoard.removeCellOwner(coordinate);
        let isLegal = !this.doesClaimingCellCauseNInARow(4, destinationCoordinate, claimer);
        this.gameBoard.setCellOwner(coordinate, claimer);
        return isLegal;
    }

    isClaimingCellLegal(coordinate, claimer){
        return !this.doesClaimingCellCauseNInARow(3, coordinate, claimer);
    }

    doesClaimingCellCauseNInARow(n, cellCoordinate, claimer) {

        if (this.gameBoard.getCellOwner(cellCoordinate) !== undefined) {
            throw new Error(); //TODO: dedicated exception
        }
        this.gameBoard.setCellOwner(cellCoordinate, claimer);
        let maxMatchesInRow = 0;
        let matchesInRow = 0;
        let board = this.gameBoard;
        let output = function(returnedCoordinates){
            if (board.getCellOwner(returnedCoordinates) === claimer){
                matchesInRow++;
                if (matchesInRow > maxMatchesInRow){
                    maxMatchesInRow = matchesInRow;
                }
            } else {
                matchesInRow = 0;
            }
        };
        this.traverser.traverseRow(cellCoordinate, output);
        matchesInRow = 0;
        this.traverser.traverseColumn(cellCoordinate, output);
        this.gameBoard.removeCellOwner(cellCoordinate);
        return (maxMatchesInRow >= n);
    }

    getAllCellCoordinatesThatArePartOfThreeInARow(player){
        let collectedCoordinates = [];
        let matchingCellsInRowCoordinates = [];
        let board = this.gameBoard;
        let output = function (returnedCoordinates) {
            if (board.getCellOwner(returnedCoordinates) === player){
                matchingCellsInRowCoordinates.push(returnedCoordinates);
                if (matchingCellsInRowCoordinates.length === 3){
                    collectedCoordinates.concat(matchingCellsInRowCoordinates);
                } else if (matchingCellsInRowCoordinates.length > 3) {
                    throw new Error(); // TODO: dedicated exception
                }
            } else {
                matchingCellsInRowCoordinates = [];
            }
        };
        for (let i = 0; i < this.gameBoard.numberOfRows; i++) {
            this.traverser.traverseRow(i, output);
        }
        for (let i = 0; i < this.gameBoard.numberOfColumns; i++) {
            this.traverser.traverseColumn(i, output);
        }
        return collectedCoordinates;
    }
}

