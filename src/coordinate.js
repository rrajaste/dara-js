export default class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addDirection(direction){
        let newX = this.x + direction.columnIncrement;
        let newY = this.y + direction.rowIncrement;
        return new Coordinate(newX, newY);
    }
}