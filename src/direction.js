import {DIRECTIONS} from "./directions.js";

export default class {
    constructor(rowIncrement, columnIncrement) {
        this.rowIncrement = this._normalizeIncrement(rowIncrement);
        this.columnIncrement = this._normalizeIncrement(columnIncrement);
    }

    static getDirection(startingCoordinate, destinationCoordinate){
        let rowIncrement = destinationCoordinate.y - startingCoordinate.y;
        let columnIncrement = destinationCoordinate.x - startingCoordinate.x;
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

    getSemanticDirection(){
        if (this.x === 0 && this.y === -1) {
            return DIRECTIONS.NORTH;
        } else if (this.x === 0 && this.y === 1){
            return DIRECTIONS.SOUTH;
        } else if (this.x === 1 && this.y === 0){
            return DIRECTIONS.EAST;
        } else if (this.x === -1 && this.y === 0){
            return DIRECTIONS.WEST;
        } else if (this.x === 1 && this.y === -1){
            return DIRECTIONS.NORTH_EAST;
        } else if (this.x === -1 && this.y === -1){
            return DIRECTIONS.NORTH_WEST
        } else if (this.x === 1 && this.y === 1){
            return DIRECTIONS.SOUTH_EAST
        } else if (this.x === -1 && this.y === 1){
            return DIRECTIONS.SOUTH_WEST
        }
    }

    toString(){
        return this.getSemanticDirection();
    }
}