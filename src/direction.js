export default class a {
    constructor(rowIncrement, columnIncrement) {
        this.rowIncrement = this._normalizeIncrement(rowIncrement);
        this.columnIncrement = this._normalizeIncrement(columnIncrement);
    }

    static getDirection(startingCoordinate, destinationCoordinate){
        let rowIncrement = destinationCoordinate.x - startingCoordinate.y;
        let columnIncrement = destinationCoordinate.y - startingCoordinate.y;
        return new this(rowIncrement, columnIncrement);
    }
    _normalizeIncrement(increment){
        if (increment > 1) {
            increment = 1;
        } else if (increment < -1) {
            increment = -1
        }
        return increment;
    }
}