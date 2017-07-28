const assert = require('assert');
const { describe, it } = require("mocha");

const DoubleType = require('../../../../src/db/type/DoubleType');

describe('DoubleType', () => {
    describe('#ID', () => {
        it('is 3', () => {
            assert.equal(DoubleType.ID, 3);
        });
        it('id of new type is 3', () => {
            let type = new DoubleType();
            assert.equal(type.id, DoubleType.ID);
        });
    });
    describe('#size', () => {
        it('is correct', () => {
            let type = new DoubleType();
            assert.equal(type.size, 8);
        });
    });
});
