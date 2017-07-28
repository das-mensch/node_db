const assert = require('assert');
const { describe, it } = require("mocha");

const TextType = require('../../../../src/db/type/TextType');
const { InvalidArgumentException } = require('../../../../src/db/exception');

describe('TextType', () => {
    describe('#ID', () => {
        it('static id 1', () => {
            assert.equal(TextType.ID, 1);
        });
        it('id of new type is 1', () => {
            let type = new TextType(15);
            assert.equal(type.id, TextType.ID);
        });
    });
    describe('#size', () => {
        it('is correct', () => {
            let type = new TextType(15);
            assert.equal(type.size, 15);
        });
        it('must be numeric', () => {
            assert.throws(() => {
                new TextType('string');
            }, (e) => {
                return e instanceof InvalidArgumentException;
            });
        });
        it('must be greater than 0', () => {
            assert.throws(() => {
                new TextType(0);
            }, (e) => {
                return e instanceof InvalidArgumentException;
            });
        });
        it('must not be greater than 255', () => {
            assert.throws(() => {
                new TextType(256);
            }, (e) => {
                return e instanceof InvalidArgumentException;
            });
        });
    });
});
