const DBTypes = require('./type');
const BaseType = require('./type/BaseType');
const { InvalidTypeException, InvalidCallException } = require('./exception');

class Types {
    static isValidType(type) {
        if (!(type instanceof BaseType)) {
            return false;
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

    static forName(name, size) {
        if (typeof name !== 'string') {
            throw new InvalidCallException();
        }
        switch(name.toLowerCase()) {
            case 'text':
                return Types.forId(DBTypes.TextType.ID, size);
            case 'int32':
                return Types.forId(DBTypes.Int32Type.ID);
            case 'double':
                return Types.forId(DBTypes.DoubleType.ID);
            default:
                throw InvalidTypeException();
        }
    }

    static nameForId(id) {
        console.log(id);
        switch(id) {
            case 1:
                return 'text';
            case 2:
                return 'int32';
            case 3:
                return 'double';
            default:
                throw new InvalidTypeException();
        }
    }

    static valueFor(type, buffer) {
        switch (type.id) {
            case 1:
                return buffer.slice(0, buffer.indexOf('\0')).toString();
            case 2:
                return buffer.readInt32LE(0);
            case 3:
                return buffer.readDoubleLE(0);
            default:
                throw new InvalidTypeException();
        }
    }

    static writeToBuffer(buffer, offset, value, type) {
        switch (type.id) {
            case 1:
                buffer.write(value, offset);
                break;
            case 2:
                buffer.writeInt32LE(value, offset);
                break;
            case 3:
                buffer.writeDoubleLE(value, offset);
                break;
            default:
                throw new InvalidTypeException();
        }
    }
}

module.exports = Types;
