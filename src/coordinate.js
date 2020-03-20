export default class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addDirection(direction){
        let newX = this.x + direction.x;
        let newY = this.y + direction.y;
        return new Coordinate(newX, newY);
    }
    equals(coordinate){
        return this.x === coordinate.x && this.y === coordinate.y;
    };

    isInArray(array){
        for (let i = 0; i < array.length; i++) {
            let arrayElement = array[i];
            if (this.equals(arrayElement)){
                return true;
            }
        }
        return false;
    }
}