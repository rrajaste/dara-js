export default class BoardCell{

    constructor(x, y) {
        this.isFrozen = false;
        this.owner = undefined;
        this.x = x;
        this.y = y;
    }
}