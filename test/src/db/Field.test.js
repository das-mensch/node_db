const assert = require('assert');
const { describe, it } = require("mocha");

const { InvalidTypeException, InvalidArgumentException, LengthExceedException } = require('../../../src/db/exception');
const Field = require('../../../src/db/Field');
const DBTypes = require('../../../src/db/type');

describe('Field', () => {
    describe('#MAX_NAME_LENGTH', () => {
        it('should return 48', () => {
            assert.equal(48, Field.MAX_NAME_LENGTH);
        });
    });
    describe('#check', () => {
        it('Invalid type should throw InvalidTypeException', () => {
            assert.throws(() => { new Field(null, 'A name') }, (e) => { return e instanceof InvalidTypeException });
        });
        it('if name is not a string InvalidArgumentException should be thrown', () => {
            assert.throws(() => { new Field(new DBTypes.TextType(15), 1) }, (e) => { return e instanceof InvalidArgumentException });
        });
        it('if name exceeds maximum string length LengthExceedException should be thrown', () => {
            assert.throws(() => {
                new Field(new DBTypes.TextType(15), 'A very very very very very very very very very very very very very long string')
            }, (e) => {
                return e instanceof LengthExceedException
            });
        });
        it('valid field should not throw exception', () => {
            assert.doesNotThrow(() => { new Field(new DBTypes.DoubleType(), 'simple name') });
        });
    });
    describe('#getter', () => {
        it('get type works', () => {
            let type = new DBTypes.DoubleType();
            let field = new Field(type, 'name');
            assert.equal(field.type, type);
        });
        it('get name works', () => {
            let type = new DBTypes.DoubleType();
            let name = 'name';
            let field = new Field(type, name);
            assert.equal(field.name, name);
        });
    });
});
