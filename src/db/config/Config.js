class Config {
    constructor() {
        this._schemaDir = './';
    }

    get schemaDir() {
        return this._schemaDir;
    }

    set schemaDir(schemaDir) {
        this._schemaDir = schemaDir;
    }
}

module.exports = Config;
