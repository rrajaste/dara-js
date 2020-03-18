import Coordinate from "./coordinate.js";
import Direction from "./direction.js";

export default class BoardTraverser {

    constructor(board) {
        this.board = board;
    }

    traverseRow(coordinate, output){
        let startingCoordinate = new Coordinate(0, coordinate.y);
        let moveDirection = new Direction(1, 0);
        this.traverse(startingCoordinate, moveDirection, output);
    }

    traverseColumn(coordinate, output){
        let startingCoordinate = new Coordinate(coordinate.x, 0);
        let moveDirection = new Direction(0, 1);
        this.traverse(startingCoordinate, moveDirection, output);
    }

    traverse(startingCoordinate, moveDirection, output){

        let currentCoordinate = startingCoordinate;
        while (this._isCoordinateWithinBorders(currentCoordinate)) {

            let boardCell = this.board.getCell(currentCoordinate);
            output(boardCell);
            currentCoordinate = currentCoordinate.addDirection(moveDirection);
        }
    }
    _isCoordinateWithinBorders(currentCoordinate){
        return currentCoordinate.y < this.board.numberOfRows && currentCoordinate.x < this.board.numberOfColumns;
    }
}