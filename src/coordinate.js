export default class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addDirection(direction){
        this.x = direction.columnIncrement;
        this.y = direction.rowIncrement;
    }
}