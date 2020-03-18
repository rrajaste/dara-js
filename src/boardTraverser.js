export default class BoardTraverser {

    constructor(board) {
        this.board = board;
        this.startingCoordinate = undefined;
        this.moveDirection = undefined;
    }

    getCoordinatesOfFirstCellMatchingPredicate(predicate){

        let currentCoordinate = this.startingCoordinate;

        while (currentCoordinate.y < this.board.numberOfRows && currentCoordinate.x < this.board.numberOfColumns) {
            let boardCell = this.board.getCell(currentCoordinate);
            if (predicate(boardCell)) {
                return currentCoordinate;
            }
            currentCoordinate = currentCoordinate.addDirection(this.moveDirection);
        }
    }
}