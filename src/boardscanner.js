import BoardTraverser from "./boardTraverser.js";

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

    isNoMovesLeftFor(player) {
        return false;
    }

    doesClaimingCellCauseNInARow(n, cellCoordinate, claimer) {

        if (this.gameBoard.getCellOwner(cellCoordinate) !== undefined) {
            throw new Error(); //TODO: dedicated exception
        }
        this.gameBoard.setCellOwner(cellCoordinate, claimer);
        let maxMatchesInRow = 0;
        let matchesInRow = 0;
        let output = function(boardCell){
            if (boardCell.owner === claimer){
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

    getAllCellsThatArePartOfThreeInARow(player){
        let collectedCells = [];
        let matchingCellsInRow = [];
        let output = function (cell) {
            if (cell.owner === player){
                matchingCellsInRow.push(cell);
                if (matchingCellsInRow.length === 3){
                    collectedCells.concat(matchingCellsInRow);
                } else if (matchingCellsInRow.length > 3) {
                    throw new Error(); // TODO: dedicated exception
                }
            } else {
                matchingCellsInRow = [];
            }
        };
        for (let i = 0; i < this.gameBoard.numberOfRows; i++) {
            this.traverser.traverseRow(i);
        }
        for (let i = 0; i < this.gameBoard.numberOfColumns; i++) {
            this.traverser.traverseColumn(i);
        }
        return collectedCells;
    }
}

