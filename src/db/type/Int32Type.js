const BaseType = require('./BaseType');

const ID = 2;

class Int32Type extends BaseType {
    constructor() {
        super(ID, 4);
    }

    static get ID() {
        return ID;
    }
}

module.exports = Int32Type;
