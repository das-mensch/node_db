const DBTypes = require('./type');
const BaseType = require('./type/BaseType');
const { InvalidTypeException } = require('./exception');

class Types {
    static isValidType(type) {
        if (!(type instanceof BaseType)) {
            throw new InvalidTypeException();
        }
        let valid = false;
        for (let validType in DBTypes) {
            if (type instanceof DBTypes[validType]) {
                valid = true;
                break;
            }
        }
        return valid;
    }

    static forId(id, size) {
        switch(id) {
            case 1:
                return new DBTypes.TextType(size);
            case 2:
                return new DBTypes.Int32Type();
            case 3:
                return new DBTypes.DoubleType();
            default:
                throw new InvalidTypeException();
        }
    }
}

module.exports = Types;
