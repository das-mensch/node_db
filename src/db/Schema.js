const fs = require('fs');

const { InvalidTypeException, InvalidCallException, SchemaException } = require('./exception');
const Field = require('./Field');
const Types = require('./Types');

const MAGIC_NUMBER = 0x00464453;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 0;
const HEADER_SIZE = 55;

class Schema {
    constructor(name) {
        this._name = name;
        this._fields = new Map();
    }

    static fromName(name) {
        let schema = new Schema(name);
        schema.read();
        return schema;
    }

    static get VERSION() {
        return `${VERSION_MAJOR}.${VERSION_MINOR}`;
    }

    get fields() {
        return this._fields.values();
    }

    addField(field) {
        if (!(field instanceof Field)) {
            throw new InvalidTypeException();
        }
        if (this._fields.has(field.name)) {
            throw new InvalidCallException();
        }
        this._fields.set(field.name, field);
    }

    removeField(name) {
        return this._fields.delete(name);
    }

    toBuffer() {
        let outputBuffer = new Buffer(55 + this._fields.size * 50);
        outputBuffer.fill(0);
        let offset = 0;
        outputBuffer.writeUInt32LE(MAGIC_NUMBER, offset);
        offset += 4;
        outputBuffer.writeUInt8(VERSION_MAJOR, offset++);
        outputBuffer.writeUInt8(VERSION_MINOR, offset++);
        outputBuffer.writeUInt8(this._fields.size, offset++);
        outputBuffer.write(this._name, offset);
        offset += 48;
        for (let [name, field] of this._fields) {
            outputBuffer.writeUInt8(field.type.id, offset++);
            outputBuffer.writeUInt8(field.type.size, offset++);
            outputBuffer.write(name, offset);
            offset += 48;
        }
        return outputBuffer;
    }

    save() {
        let fileName = `${global._config.schemaDir}/schema_${this._name}.sdf`;
        const fd = fs.openSync(fileName, 'w');
        fs.writeSync(fd, this.toBuffer());
        fs.closeSync(fd);
    }

    read() {
        let fileName = `${global._config.schemaDir}/schema_${this._name}.sdf`;
        const fd = fs.openSync(fileName, 'r');
        let header = new Buffer(HEADER_SIZE);
        fs.readSync(fd, header, 0, HEADER_SIZE);
        if (header.readUInt32LE(0) !== MAGIC_NUMBER) {
            throw new SchemaException();
        }
        let nameBuffer = header.slice(7, 48);
        this._name = nameBuffer.toString('utf8', 0, nameBuffer.indexOf('\0'));
        let fieldCount = header.readUInt8(6);
        let fieldBuffer = new Buffer(50);
        for (let i = 0; i < fieldCount; i++) {
            fs.readSync(fd, fieldBuffer, 0, 50);
            let fieldType = fieldBuffer.readUInt8(0);
            let fieldSize = fieldBuffer.readUInt8(1);
            let nameBuffer = fieldBuffer.slice(2, Field.MAX_NAME_LENGTH);
            let fieldName = nameBuffer.toString('utf8', 0, nameBuffer.indexOf('\0'));
            this.addField(new Field(Types.forId(fieldType, fieldSize), fieldName));
        }
        fs.closeSync(fd);
    }
}

module.exports = Schema;
