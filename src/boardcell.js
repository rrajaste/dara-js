class BoardCell{

    owner;
    isFrozen;
    leftSibling;
    rightSibling;

    constructor(owner) {
        this.owner = owner;
        this.isFrozen = false;
        this.leftSibling = null;
        this.rightSibling = null;
    }
}