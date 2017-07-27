const assert = require('assert');
const { describe, it } = require("mocha");

const Int32Type = require('../../../../src/db/type/Int32Type');

describe('Int32Type', () => {
    describe('#ID', () => {
        it('is 2', () => {
            assert.equal(Int32Type.ID, 2);
        });
    });
});
