class BoardCell{

    owner;
    isFrozen;

    constructor(owner) {
        this.isFrozen = false;
        this.owner = owner;
    }
}