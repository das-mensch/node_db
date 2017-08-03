const BaseType = require('./BaseType');
const { InvalidArgumentException } = require('../exception');

const ID = 1;

class TextType extends BaseType {
    constructor(size) {
        if (typeof size !== 'number' || size <= 0 || size > 255) {
            throw new InvalidArgumentException();
        }
        super(ID, size, '');
    }

    static get ID() {
        return ID;
    }
}

module.exports = TextType;
