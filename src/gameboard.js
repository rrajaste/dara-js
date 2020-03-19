import BoardCell from './boardcell.js';
import coordinate from "./coordinate";


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

    freezeCell(coordinate){
        this.getCell(coordinate).isFrozen = true;
    };

    isCellFrozen(coordinate) {
        return this.getCell(coordinate).isFrozen;
    }
    isCellEmpty(coordinate){
        return this.getCellOwner(coordinate) === undefined;
    }
}