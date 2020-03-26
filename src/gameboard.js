import BoardCell from './boardcell.js';

export default class GameBoard {

    constructor(nrOfRows = 5, nrOfColumns = 6) {
        this.numberOfRows = nrOfRows;
        this.numberOfColumns = nrOfColumns;

        this._generateEmptyBoard();
    }

    _generateEmptyBoard(){

        let generatedBoard = [];
        for (let i = 0; i < this.numberOfRows; i++) {
            let row = [];
            for (let j = 0; j < this.numberOfColumns; j++) {
                row.push(new BoardCell())
            }
            generatedBoard.push(row);
        }
        this.board = generatedBoard;
    }

    getCell(coordinate){
        let col = coordinate.x;
        let row = coordinate.y;

        return this.board[row][col]
    }

    getCellOwner(coordinates){
        return this.getCell(coordinates).owner;
    }

    setCellOwner(coordinates, owner){
        this.getCell(coordinates).owner = owner;
    }

    removeCellOwner(coordinate){
        this.getCell(coordinate).owner = undefined;
    }

    isCellOwnedByPlayer(coordinate, claimer){
        return this.getCellOwner(coordinate) === claimer;
    }

    isCellEmpty(coordinate){
        return this.getCellOwner(coordinate) === undefined;
    }
    isCoordinateOnBoard(coordinate){
        return (coordinate.x >= 0
            && coordinate.x < this.numberOfColumns
            && coordinate.y >= 0
            && coordinate.y < this.numberOfRows);
    }
}