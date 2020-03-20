import {SEMANTIC_DIRECTION} from "./semanticdirection.js";
import Coordinate from "./coordinate";

export default class Direction{
    constructor(x, y) {
        this.x = this._normalizeIncrement(x);
        this.y = this._normalizeIncrement(y);
    }

    static getDirection(startingCoordinate, destinationCoordinate){
        let x = destinationCoordinate.x - startingCoordinate.x;
        let y = destinationCoordinate.y - startingCoordinate.y;
        return new this(x, y);
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
        console.log("dir", this.getSemanticDirection());
        return semanticDirection === SEMANTIC_DIRECTION.NORTH
            || semanticDirection === SEMANTIC_DIRECTION.SOUTH
            || semanticDirection === SEMANTIC_DIRECTION.EAST
            || semanticDirection === SEMANTIC_DIRECTION.WEST;
    }

    static getAllOrthogonalDirections(){
        return [
            new Direction(0, -1),
            new Direction(0, 1),
            new Direction(1, 0),
            new Direction(-1, 0),
        ];
    }

    toString(){
        return this.getSemanticDirection();
    }
}