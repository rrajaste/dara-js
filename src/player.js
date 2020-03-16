export default class {
    constructor(PLAYER_TYPE) {
        this.tokenCount = 12;
        this.PLAYER_TYPE = PLAYER_TYPE;
        this.screenName;
    }

    toString(){
        return this.PLAYER_TYPE.toString();
    }
}