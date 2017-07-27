class Type {
    constructor(id, size) {
        this._id = id;
        this._size = size;
    }

    get id() {
        return this._id;
    }

    get size() {
        return this._size;
    }
}

module.exports = Type;
