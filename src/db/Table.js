const fs = require('fs');

const Types = require('./Types');
const SuffixArrayIndex = require('./index/SuffixArrayIndex');
const { InvalidCallException } = require('./exception');

class Table {
    constructor(schema) {
        this._dataFilePath = null;
        this._fileSize = null;
        this._schema = schema;
        this.check();
        this._readStream = fs.openSync(this._dataFilePath, 'r');
        this._writeStream = fs.openSync(this._dataFilePath, fs.constants.O_WRONLY);
        this._indexes = new Map();
        this.updateFileSize();
        this.initIndexes();
    }

    get schema() {
        return this._schema;
    }

    check() {
        this._dataFilePath = `${global._config.dataDir}/data_${this._schema.name}.tdt`;
        if (!fs.existsSync(this._dataFilePath)) {
            fs.writeFileSync(this._dataFilePath, '');
        }
    }

    initIndexes() {
        for (const name of this._schema.fields.keys()) {
            this._indexes.set(name, new SuffixArrayIndex());
        }
        this.loadIndexes();
    }

    loadIndexes() {
        console.log(this._fileSize, this._schema.rowSize, this._fileSize / this._schema.rowSize);
        for (let i = 1; i < this._fileSize / this._schema.rowSize; i++) {
            //console.log(i);
            let entry = this.findById(i);
            for (const prop in entry) {
                //if (!this._indexes.has(prop)) continue;
                //console.log(`Insert ${entry[prop]} into ${prop}`);
                this._indexes.get(prop).insert(entry[prop], i);
            }
        }
        for (const [name, index] of this._indexes) {
            index.sort();
        }
    }

    updateFileSize() {
        this._fileSize = fs.statSync(this._dataFilePath).size;
    }

    buildObject(buffer) {
        let obj = {};
        let offset = 0;
        for (const [name, field] of this._schema.fields) {
            let fieldBuffer = buffer.slice(offset, offset + field.type.size);
            offset += field.type.size;
            obj[name] = Types.valueFor(field.type, fieldBuffer)
        }
        return obj;
    }

    objToBuffer(obj) {
        let buffer = new Buffer(this._schema.rowSize);
        buffer.fill(0);
        let offset = 0;
        for (const [name, field] of this._schema.fields) {
            let value = obj[name];
            if (typeof value === 'undefined') {
                value = field.type.defaultValue;
            }
            Types.writeToBuffer(buffer, offset, value, field.type);
            offset += field.type.size;
        }
        return buffer;
    }

    findByKeyValue(key, value, exact) {
        if (!this._indexes.has(key)) {
            return [];
        }
        const ids = this._indexes.get(key).find(value);
        let resultSet = [];
        for (const id of ids) {
            resultSet.push(this.findById(id));
        }
        return resultSet;
    }

    findById(id) {
        const position = (id - 1) * this._schema.rowSize;
        if (position > this._fileSize) {
            throw new InvalidCallException();
        }
        let buffer = new Buffer(this._schema.rowSize);
        fs.readSync(this._readStream, buffer, 0, this._schema.rowSize, position);
        return this.buildObject(buffer);
    }

    writeById(id, obj) {
        const position = (id - 1) * this._schema.rowSize;
        const fieldBuffer = this.objToBuffer(obj);
        fs.writeSync(this._writeStream, fieldBuffer, 0, fieldBuffer.length, position);
        for (const prop in obj) {
            if (!this._indexes.has(prop)) continue;
            this._indexes.get(prop).insert(obj[prop], id);
        }
        this.updateFileSize();
    }
}

module.exports = Table;
