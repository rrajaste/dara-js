import BoardTraverser from "./boardTraverser.js";

export default class BoardScanner{

    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.traverser = new BoardTraverser(this.gameBoard);
    }

    isMovingTokenLegal(move){

        let coordinate = move.coordinates;
        let direction = move.direction;
        let destinationCoordinate = coordinate.addDirection(direction);
        let claimer = this.gameBoard.getCellOwner(coordinate);

        if (!this.gameBoard.isCoordinateOnBoard(destinationCoordinate)){
            return false;
        }
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

    doesClaimingCellCauseNInARow(n, coordinate, claimer) {

        if (! this.gameBoard.isCellEmpty(coordinate)) {

            throw new Error(); //TODO: dedicated exception
        }

        this.gameBoard.setCellOwner(coordinate, claimer);

        let maxMatchesInRow = 0;
        let matchesInRow = 0;
        let board = this.gameBoard;
        let output = function(returnedCoordinates){
            let horizontalDistance = coordinate.getHorizontalDistanceFrom(returnedCoordinates);
            let verticalDistance = coordinate.getVerticalDistanceFrom(returnedCoordinates);
            if (board.getCellOwner(returnedCoordinates) === claimer && horizontalDistance < n && verticalDistance < n){
                matchesInRow++;
                if (matchesInRow > maxMatchesInRow){
                    maxMatchesInRow = matchesInRow;
                }
            } else {
                matchesInRow = 0;
            }
        };
        this.traverser.traverseRow(coordinate.y, output);
        matchesInRow = 0;
        this.traverser.traverseColumn(coordinate.x, output);
        this.gameBoard.removeCellOwner(coordinate);
        return (maxMatchesInRow >= n);
    }

    doesMovingTokenCauseNInARow(n, move){
        let currentCoordinates = move.coordinates;
        let destinationCoordinates = currentCoordinates.addDirection(move.direction);
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
            matchingCellsInRowCoordinates = [];
        }

        for (let i = 0; i < this.gameBoard.numberOfColumns; i++) {
            this.traverser.traverseColumn(i, output);
            matchingCellsInRowCoordinates = [];
        }
        return collectedCoordinates;
    }
}

