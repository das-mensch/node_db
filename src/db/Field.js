const { InvalidArgumentException, LengthExceedException } = require('./exception');
const Types = require('./Types');

const FIELD_NAME_MAX_LENGTH = 48;
const FIELD_PERSISTENCE_SIZE = 52;
const FLAG_INDEXED = 0x01;
const FLAG_INDEX_TYPE = 0x0E;

class Field {
    constructor(obj) {
        this._name = null;
        this._type = null;
        this._flags = 0;
        this.assignByObj(obj);
    }

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }

    get indexed() {
        return this._flags & FLAG_INDEXED;
    }

    get indexType() {
        return (this._flags & FLAG_INDEX_TYPE) >> 1;
    }

    static get MAX_NAME_LENGTH() {
        return FIELD_NAME_MAX_LENGTH;
    }

    static get PERSISTENCE_SIZE() {
        return FIELD_PERSISTENCE_SIZE;
    }

    static fromBuffer(fieldBuffer) {
        if (fieldBuffer.length !== FIELD_PERSISTENCE_SIZE) {
            throw new InvalidArgumentException();
        }
        let offset = 0;
        let typeId = fieldBuffer.readUInt8(offset++);
        let typeSize = fieldBuffer.readUInt8(offset++);
        let flags = fieldBuffer.readUInt16LE(offset);
        offset += 2;
        let nameBuffer = fieldBuffer.slice(offset, FIELD_NAME_MAX_LENGTH);
        let name = nameBuffer.slice(0, nameBuffer.indexOf('\0')).toString();
        return new Field({
            name: name,
            type: Types.nameForId(typeId),
            size: typeSize,
            indexed: (flags & FLAG_INDEX_TYPE)
        });
    }

    assignByObj(obj) {
        if (typeof obj.name !== 'string' || typeof obj.type !== 'string') {
            throw new InvalidArgumentException();
        }
        if (obj.name.length > FIELD_NAME_MAX_LENGTH) {
            throw new LengthExceedException();
        }
        this._name = obj.name;
        this._type = Types.forName(obj.type, obj.size);
        this.assignFlags(obj);
    }

    assignFlags(obj) {
        if (!!obj.indexed) {
            this._flags |= FLAG_INDEXED;
        }
    }

    toBuffer() {
        let fieldBuffer = Buffer.alloc(FIELD_PERSISTENCE_SIZE);
        let offset = 0;
        fieldBuffer.writeUInt8(this._type.id, offset++);
        fieldBuffer.writeUInt8(this._type.size, offset++);
        fieldBuffer.writeUInt16LE(this._flags, offset);
        offset += 2;
        fieldBuffer.write(this._name, offset, FIELD_NAME_MAX_LENGTH);
        return fieldBuffer;
    }
}

module.exports = Field;
