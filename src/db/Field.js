const { InvalidTypeException, InvalidArgumentException, LengthExceedException } = require('./exception');
const Types = require('./Types');

const FIELD_NAME_MAX_LENGTH = 48;

class Field {
    constructor(type, name) {
        this._type = type;
        this._name = name;
        this.check();
    }

    static get MAX_NAME_LENGTH() {
        return FIELD_NAME_MAX_LENGTH;
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }

    check() {
        if (!Types.isValidType(this._type)) {
            throw new InvalidTypeException();
        }
        if (typeof this._name !== 'string') {
            throw new InvalidArgumentException();
        }
        if (this._name.length > FIELD_NAME_MAX_LENGTH) {
            throw new LengthExceedException();
        }
    }
}

module.exports = Field;
