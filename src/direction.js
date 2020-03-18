import {SEMANTIC_DIRECTION} from "./semanticdirection.js";

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
            return SEMANTIC_DIRECTION.NORTH;
        } else if (this.x === 0 && this.y === 1){
            return SEMANTIC_DIRECTION.SOUTH;
        } else if (this.x === 1 && this.y === 0){
            return SEMANTIC_DIRECTION.EAST;
        } else if (this.x === -1 && this.y === 0){
            return SEMANTIC_DIRECTION.WEST;
        } else if (this.x === 1 && this.y === -1){
            return SEMANTIC_DIRECTION.NORTH_EAST;
        } else if (this.x === -1 && this.y === -1){
            return SEMANTIC_DIRECTION.NORTH_WEST
        } else if (this.x === 1 && this.y === 1){
            return SEMANTIC_DIRECTION.SOUTH_EAST
        } else if (this.x === -1 && this.y === 1){
            return SEMANTIC_DIRECTION.SOUTH_WEST
        }
    }

    isOrthogonal(){
        let semanticDirection = this.getSemanticDirection();
        return semanticDirection === SEMANTIC_DIRECTION.NORTH
            || semanticDirection === SEMANTIC_DIRECTION.SOUTH
            || semanticDirection === SEMANTIC_DIRECTION.EAST
            || semanticDirection === SEMANTIC_DIRECTION.WEST;
    }

    toString(){
        return this.getSemanticDirection();
    }
}