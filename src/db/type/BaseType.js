class Type {
    constructor(id, size, defaultValue) {
        this._id = id;
        this._size = size;
        this._defaultValue = defaultValue;
    }

    get id() {
        return this._id;
    }

    get size() {
        return this._size;
    }

    get defaultValue() {
        return this._defaultValue;
    }
}

module.exports = Type;
