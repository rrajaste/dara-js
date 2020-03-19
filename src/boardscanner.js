import BoardTraverser from "./boardTraverser.js";
import Coordinate from "./coordinate";

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
        if (!this.gameBoard.isCellEmpty(destinationCoordinate)){
            return false;
        }

        this.gameBoard.removeCellOwner(coordinate);
        let isLegal = !this.doesClaimingCellCauseNInARow(4, destinationCoordinate, claimer);
        this.gameBoard.setCellOwner(coordinate, claimer);
        return isLegal;
    }

    isClaimingCellLegal(coordinate, claimer){
        if (!this.gameBoard.isCellEmpty(coordinate)){
            return false;
        }
        return !this.doesClaimingCellCauseNInARow(3, coordinate, claimer);
    }

    doesClaimingCellCauseNInARow(n, cellCoordinate, claimer) {

        if (! this.gameBoard.isCellEmpty(cellCoordinate)) {
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
        this.traverser.traverseRow(cellCoordinate.y, output);
        matchesInRow = 0;
        this.traverser.traverseColumn(cellCoordinate.x, output);
        this.gameBoard.removeCellOwner(cellCoordinate);
        return (maxMatchesInRow >= n);
    }

    doesMovingTokenCauseNInARow(n, currentCoordinates, destinationCoordinates){
        let owner = this.gameBoard.getCellOwner(currentCoordinates);
        this.gameBoard.removeCellOwner(currentCoordinates);
        let causesThreeInARow = this.doesClaimingCellCauseNInARow(n, destinationCoordinates, owner);
        this.gameBoard.setCellOwner(currentCoordinates, owner);
        return causesThreeInARow;
    }

    getAllCellCoordinatesThatArePartOfThreeInARow(player){
        let collectedCoordinates = [];
        let matchingCellsInRowCoordinates = [];
        let board = this.gameBoard;
        let output = function (returnedCoordinates) {
            if (board.getCellOwner(returnedCoordinates) === player){
                matchingCellsInRowCoordinates.push(returnedCoordinates);
                if (matchingCellsInRowCoordinates.length === 3){
                    collectedCoordinates = collectedCoordinates.concat(matchingCellsInRowCoordinates);
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

