"use strict";

class GameBoard {

    #nrOfRows = 5;
    #nrOfColumns = 6;
    #board;

    constructor(nrOfRows, nrOfColumns) {
        #nrOfRows = nrOfRows;
        #nrOfColumns = nrOfColumns;

        #generateBoard();
    }

    #generateBoard(){
        let board = [];
        for (let i = 0; i < #nrOfRows; i++) {
            let row = [];
            for (let j = 0; j < #nrOfColumns; j++) {
                row.push(new BoardCell(PlayerTypes.NO_PLAYER))
            }
            board.push(row);
        }
        #board = board;
    }

    #getCell(row, col){
        return #board[row][col]
    }

    getCellOwner(row, column){
        return this.#getCell.owner;
    }

    setCellOwner(col, row, owner){
        this.#getCell(col, row).owner = owner;
    }

    freezeCell(row, col){
        this.#getCell.isFrozen = true;
    };

    isCellFrozen(row, col) {
        return this.#getCell(row, col).isFrozen;
    }

    get numberOfRows(){
        return #nrOfRows;
    }

    get numberOfColumns(){
        return #nrOfColumns;
    }
}