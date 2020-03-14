"js-cell";

//let gameEngine = new gameEngine();

let board = document.getElementById('gameBoard');
let rows = board.querySelectorAll('.js-board-row');

let playerColorMap = {
    '0': 'white',
    '1': 'green',
    '2': 'blue'
};

function cellClicked(event) {
    let row = this.dataset.row;
    let col = this.dataset.col;

    // gameEngine.makeMove(col, row);
    //
    // let owner = gameEngine.getCellOwner(col, row);

    let owner = this.dataset.player;

    console.log(owner)
}

function setDisplayCell(element, owner) {
    clearCellColorClass(element);
    setColorClass(element, playerColorMap[owner]);
}

function clearCellColorClass(element){
    let owner = element.dataset.player;
    let colorClass = playerColorMap[owner];
    element.classList.remove(colorClass);
}

function setColorClass(element, colorClass){
    element.classList.add(colorClass);
}

for (const row of rows) {
    let cells = row.querySelectorAll('.js-cell');
    for (const cell of cells)  {
        cell.onclick = cellClicked;
    }
}




