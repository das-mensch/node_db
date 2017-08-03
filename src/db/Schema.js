const fs = require('fs');

const { InvalidTypeException, InvalidCallException, SchemaException, InvalidArgumentException } = require('./exception');
const Field = require('./Field');
const Table = require('./Table');

const MAGIC_NUMBER = 0x00464453;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 0;
const HEADER_SIZE = 55;

class Schema {
    constructor(name) {
        this._name = name;
        this._fields = new Map();
        this._rowSize = null;
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
        return this._fields;
    }

    get name() {
        return this._name;
    }

    get rowSize() {
        if (this._rowSize !== null) {
            return this._rowSize;
        }
        this._rowSize = 0;
        for (const field of this._fields.values()) {
            this._rowSize += field.type.size;
        }
        return this._rowSize;
    }

    addField(field) {
        if (!(field instanceof Field)) {
            throw new InvalidArgumentException();
        }
        if (this._fields.has(field.name)) {
            throw new InvalidCallException();
        }
        this._fields.set(field.name, field);
        this._rowSize = null;
    }

    removeField(name) {
        this._rowSize = null;
        return this._fields.delete(name);
    }

    toBuffer() {
        let totalSize = HEADER_SIZE + this._fields.size * Field.PERSISTENCE_SIZE;
        let buffers = [];
        let headerBuffer = Buffer.alloc(HEADER_SIZE);
        let offset = 0;
        headerBuffer.writeUInt32LE(MAGIC_NUMBER, offset);
        offset += 4;
        headerBuffer.writeUInt8(VERSION_MAJOR, offset++);
        headerBuffer.writeUInt8(VERSION_MINOR, offset++);
        headerBuffer.writeUInt8(this._fields.size, offset++);
        headerBuffer.write(this._name, offset, 48);
        buffers.push(headerBuffer);
        for (let field of this._fields.values()) {
            buffers.push(field.toBuffer());
        }
        return Buffer.concat(buffers, totalSize);
    }

    save() {
        let fileName = `${global._config.schemaDir}/schema_${this._name}.sdf`;
        const fd = fs.openSync(fileName, 'w');
        fs.writeSync(fd, this.toBuffer());
        fs.closeSync(fd);
    }

    read() {
        let fileName = `${global._config.schemaDir}/schema_${this._name}.sdf`;
        if (!fs.existsSync(fileName)) {
            throw new SchemaException();
        }
        const fd = fs.openSync(fileName, 'r');
        let header = new Buffer(HEADER_SIZE);
        fs.readSync(fd, header, 0, HEADER_SIZE);
        if (header.readUInt32LE(0) !== MAGIC_NUMBER) {
            throw new SchemaException();
        }
        let nameBuffer = header.slice(7, 48);
        this._name = nameBuffer.toString('utf8', 0, nameBuffer.indexOf('\0'));
        let fieldCount = header.readUInt8(6);
        let fieldBuffer = Buffer.alloc(Field.PERSISTENCE_SIZE);
        for (let i = 0; i < fieldCount; i++) {
            fs.readSync(fd, fieldBuffer, 0, Field.PERSISTENCE_SIZE);
            console.log(Field.fromBuffer(fieldBuffer));
            this.addField(Field.fromBuffer(fieldBuffer));
        }
        fs.closeSync(fd);
    }
}

module.exports = Schema;
