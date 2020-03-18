export default class {

    constructor(PLAYER_TYPE) {
        this.totalTokenCount = 12;
        this.unusedTokenCount = 12;
        this.PLAYER_TYPE = PLAYER_TYPE;
        this.Name;
    }

    toString(){
        return this.Name;
    }
}