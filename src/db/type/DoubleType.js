const BaseType = require('./BaseType');

const ID = 3;

class DoubleType extends BaseType {
    constructor() {
        super(ID, 8);
    }

    static get ID() {
        return ID;
    }
}

module.exports = DoubleType;
