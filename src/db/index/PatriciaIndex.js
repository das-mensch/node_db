class Node {
    constructor() {
        this._keys = new Map();
        this._ids = new Set();
    }

    get keys() {
        return this._keys;
    }

    get ids() {
        return this._ids;
    }

    get allIds() {
        let ids = this._ids;
        for (const node of this._keys.values()) {
            let subIds = node.allIds;
            for (const id of subIds.values()) {
                ids.add(id);
            }
        }
        return ids;
    }

    addKey(key) {
        if (!this._keys.has(key)) {
            this._keys.set(key, new Node());
        }
    }

    addId(id) {
        this._ids.add(id);
    }
}

class PatriciaIndex {
    constructor() {
        this._root = new Node();
    }

    insert(string, id) {
        let buffer = Buffer.from(string);
        let node = this._root;
        for (const byte of buffer.values()) {
            node.addKey(byte);
            node = node.keys.get(byte);
        }
        node.addId(id);
    }

    find(string, exact) {
        let useExact = !!exact;
        let buffer = Buffer.from(string);
        let node = this._root;
        for (const byte of buffer.values()) {
            node = node.keys.get(byte);
            if (typeof node === 'undefined') {
                return new Set();
            }
        }
        if (useExact === true) {
            return node.ids;
        }
        return node.allIds;
    }
}

module.exports = PatriciaIndex;
