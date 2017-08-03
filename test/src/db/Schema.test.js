const os = require('os');
const fs = require('fs');
const assert = require('assert');
const { describe, it, before } = require("mocha");

const Config = require('../../../src/db/config');
const Schema = require('../../../src/db/Schema');
const Field = require('../../../src/db/Field');
const Types = require('../../../src/db/Types');
const { SchemaException, InvalidArgumentException, InvalidCallException } = require('../../../src/db/exception');

global._config = new Config();
global._config.schemaDir = os.tmpDir;

describe('Schema', () => {
    before(() => {
        fs.writeFileSync(`${os.tmpDir}/schema_invalidHeader.sdf`, fs.readFileSync(fs.realpathSync('test/resources/schema_invalidHeader.sdf')));
        fs.writeFileSync(`${os.tmpDir}/schema_mySchema.sdf`, fs.readFileSync(fs.realpathSync('test/resources/schema_mySchema.sdf')));
    });
    describe('#VERSION', () => {
        it('should be 1.0', () => {
            assert.equal(Schema.VERSION, '1.0');
        });
    });
    describe('#fromFile', () => {
        it('load correct file', () => {
            let correctSchema = Schema.fromName('mySchema');
            assert.equal(correctSchema.fields.size, 3);
        });
        it('should throw SchemaException if file not found', () => {
            assert.throws(() => { Schema.fromName('notExisting'); }, (e) => { return e instanceof SchemaException; });
        });
        it('should throw SchemaException on invalidHeader', () => {
            assert.throws(() => { Schema.fromName('invalidHeader'); }, (e) => { return e instanceof SchemaException; });
        });
    });
    describe('#addField', () => {
        it('should throw InvalidArgumentException if parameter is not a field', () => {
            let schema = new Schema('test_schema');
            assert.throws(() => { schema.addField(null) }, (e) => { return e instanceof InvalidArgumentException; });
        });
        it('should throw InvalidCallException if field already exists', () => {
            let schema = new Schema('test_schema');
            let obj = { name: 'existent', type: 'int32' };
            schema.addField(new Field(obj));
            assert.throws(() => { schema.addField(new Field(obj)); }, (e) => { return e instanceof InvalidCallException; });
        });
        it('should add Field.. DUH', () => {
            let schema = new Schema('test_schema');
            let obj = { name: 'existent', type: 'int32' };
            schema.addField(new Field(obj));
            assert.equal(schema.fields.size, 1);
        });
    });
    describe('#removeField', () => {
        it('removes given field', () => {
            let schema = new Schema('test_schema');
            let obj = { name: 'existent', type: 'int32' };
            schema.addField(new Field(obj));
            assert.equal(schema.fields.size, 1);
            schema.removeField('existent');
            assert.equal(schema.fields.size, 0);
        });
    });
    describe('#save', () => {
        it('saves Schema correct', () => {
            let schema = new Schema('test_schema');
            let obj = { name: 'existent', type: 'int32' };
            schema.addField(new Field(obj));
            schema.save();
            assert.equal(fs.existsSync(`${os.tmpDir}/schema_test_schema.sdf`), true);
            let testSchema = Schema.fromName('test_schema');
            assert.equal(testSchema.fields.size, 1);
        });
    });
});
