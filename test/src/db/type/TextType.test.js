const assert = require('assert');
const { describe, it } = require("mocha");

const TextType = require('../../../../src/db/type/TextType');

describe('TextType', () => {
    describe('#ID', () => {
        it('is 1', () => {
            assert.equal(TextType.ID, 1);
        });
    });
});
