class Config {
    constructor() {
        this._schemaDir = './';
        this._dataDir = './';
    }

    get schemaDir() {
        return this._schemaDir;
    }

    set schemaDir(schemaDir) {
        this._schemaDir = schemaDir;
    }

    get dataDir() {
        return this._dataDir;
    }

    set dataDir(dataDir) {
        this._dataDir = dataDir;
    }
}

module.exports = Config;
