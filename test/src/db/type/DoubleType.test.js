const assert = require('assert');
const { describe, it } = require("mocha");

const DoubleType = require('../../../../src/db/type/DoubleType');

describe('DoubleType', () => {
    describe('#ID', () => {
        it('is 3', () => {
            assert.equal(DoubleType.ID, 3);
        });
    });
});
