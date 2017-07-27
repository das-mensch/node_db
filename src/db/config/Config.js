class Config {
    constructor() {
        this._schemaDir = './';
    }

    get schemaDir() {
        return this._schemaDir;
    }
}

module.exports = Config;
