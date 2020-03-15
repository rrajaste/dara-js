import BoardCell from './boardcell';

export default class GameBoard {

    constructor(nrOfRows = 5, nrOfColumns = 6) {
        this.numberOfRows = nrOfRows;
        this.numberOfColumns = nrOfColumns;

        this._generateBoard();
    }

    _generateBoard(){

        let generatedBoard = [];
        for (let i = 0; i < this.numberOfRows; i++) {
            let row = [];
            for (let j = 0; j < this.numberOfColumns; j++) {
                row.push(new BoardCell(PlayerTypes.NO_PLAYER))
            }
            generatedBoard.push(row);
        }
        this.board = generatedBoard;
    }

    getCell(row, col){
        return this.board[row][col]
    }

    getCellOwner(row, column){
        return this.getCell.owner;
    }

    setCellOwner(col, row, owner){
        this.getCell(col, row).owner = owner;
    }

    freezeCell(row, col){
        this.getCell(row, col).isFrozen = true;
    };

    isCellFrozen(row, col) {
        return this.getCell(row, col).isFrozen;
    }
}