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

    getCellOwner(row, column){
        return #board[row][column];
    }

    setCellOwner(row, column, owner){
        #board[row][column] = owner;
    }

    get numberOfRows(){
        return #nrOfRows;
    }

    get numberOfColumns(){
        return #nrOfColumns;
    }
}