const assert = require('assert');
const { describe, it } = require("mocha");

const Int32Type = require('../../../../src/db/type/Int32Type');

describe('Int32Type', () => {
    describe('#ID', () => {
        it('is 2', () => {
            assert.equal(Int32Type.ID, 2);
        });
        it('id of new type is 1', () => {
            let type = new Int32Type();
            assert.equal(type.id, Int32Type.ID);
        });
    });
    describe('#size', () => {
        it('is correct', () => {
            let type = new Int32Type();
            assert.equal(type.size, 4);
        });
    });
});
