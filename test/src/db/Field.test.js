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
    describe('#construct', () => {
        it('missing type should throw InvalidArgumentException', () => {
            const obj = {
                name: 'A name'
            };
            assert.throws(() => { new Field(obj) }, (e) => { return e instanceof InvalidArgumentException });
        });
        it('type not string should throw InvalidArgumentException', () => {
            const obj = {
                name: 'A name',
                type: 1
            };
            assert.throws(() => { new Field(obj) }, (e) => { return e instanceof InvalidArgumentException });
        });
        it('name missing should throw InvalidArgumentException', () => {
            const obj = {
                type: 'int32'
            };
            assert.throws(() => { new Field(obj) }, (e) => { return e instanceof InvalidArgumentException });
        });
        it('name not string should throw InvalidArgumentException', () => {
            const obj = {
                name: 1,
                type: 'int32'
            };
            assert.throws(() => { new Field(obj) }, (e) => { return e instanceof InvalidArgumentException });
        });
        it('if name exceeds maximum string length LengthExceedException should be thrown', () => {
            const obj = {
                name: 'A very very very very very very very very very very very very very long string',
                type: 'int32'
            };
            assert.throws(() => {
                new Field(obj)
            }, (e) => {
                return e instanceof LengthExceedException
            });
        });
        it('valid field should not throw exception', () => {
            const obj = {
                name: 'myInt32',
                type: 'int32'
            };
            assert.doesNotThrow(() => { new Field(obj) });
        });
    });
    describe('#getter', () => {
        it('get type works', () => {
            const obj = {
                name: 'myInt32',
                type: 'int32'
            };
            let field = new Field(obj);
            assert.equal(field.type instanceof DBTypes.Int32Type, true);
        });
        it('get name works', () => {
            const obj = {
                name: 'myInt32',
                type: 'int32'
            };
            let field = new Field(obj);
            assert.equal(field.name, obj.name);
        });
    });
});
