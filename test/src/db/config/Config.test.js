const assert = require('assert');
const { describe, it } = require("mocha");

const Config = require('../../../../src/db/config');

describe('Config', () => {
    it('#schemaDir', () => {
        let config = new Config();
        assert.equal(config.schemaDir, './');
    });
});
