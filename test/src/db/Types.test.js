const assert = require('assert');
const { describe, it } = require("mocha");

const { InvalidTypeException } = require('../../../src/db/exception');
const Types = require('../../../src/db/Types');
const DBTypes = require('../../../src/db/type');
const BaseType = require('../../../src/db/type/BaseType');

describe('Types', () => {
    describe('#isValidType', () => {
        it('BaseType is not a valid type', () => {
            assert.equal(Types.isValidType(new BaseType()), false);
        });
    });
    describe('#forId', () => {
        it('TextType', () => {
            const type = Types.forId(1, 15);
            assert.equal(type instanceof DBTypes.TextType, true);
        });
        it('Int32Type', () => {
            const type = Types.forId(2);
            assert.equal(type instanceof DBTypes.Int32Type, true);
        });
        it('DoubleType', () => {
            const type = Types.forId(3);
            assert.equal(type instanceof DBTypes.DoubleType, true);
        });
        it('unknown type', () => {
            assert.throws(() => {Types.forId(null)}, (e) => {return e instanceof InvalidTypeException});
        });
    });
});
