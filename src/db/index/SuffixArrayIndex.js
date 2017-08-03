class SuffixArrayIndex {
    constructor() {
        this._suffixArray = [];
        this._suffixMap = new Map();
    }

    get suffixArray() {
        return this._suffixArray;
    }

    insert(string, id) {
        let buffer = Buffer.from(string.split("").reverse().join(""));
        for (let i = 0; i < buffer.length; i++) {
            let suffix = buffer.slice(i);
            let hex = suffix.toString('hex');
            if (!this._suffixMap.has(hex)) {
                this._suffixMap.set(hex, new Set());
            }
            this._suffixMap.get(hex).add(id);
        }
    }

    sort() {
        let array = [];
        for (const key of this._suffixMap.keys()) {
            array.push(Buffer.from(key, 'hex'));
        }
        this._suffixArray = array.sort(Buffer.compare);
    }

    find(string) {
        console.log(string);
        let reversedString = Buffer.from(string.split("").reverse().join(""));
        let result = new Set();
        this.findInRange(0, this._suffixArray.length, reversedString, result);
        return result;
    }

    findInRange(start, end, string, result) {
        let mid = Math.ceil((start + end) / 2);
        if (mid === start || mid === end) {
            return;
        }
        if (this._suffixArray[mid].indexOf(string) === 0) {
            this.findNeighboursAddIds(mid, string, result);
            return;
        }
        if (this._suffixArray[mid].compare(string) > 0) {
            return this.findInRange(start, mid, string, result);
        }
        this.findInRange(mid, end, string, result);
    }

    findNeighboursAddIds(idx, string, result) {
        this.addIndexesToResult(idx, result);
        let lowerIdx = idx - 1;
        let upperIdx = idx + 1;
        while (lowerIdx >= 0 && this._suffixArray[lowerIdx].indexOf(string) !== -1) {
            this.addIndexesToResult(lowerIdx--, result);
        }
        while (upperIdx < this._suffixArray.length && this._suffixArray[upperIdx].indexOf(string) !== -1) {
            this.addIndexesToResult(upperIdx++, result);
        }
    }

    addIndexesToResult(idx, result) {
        let ids = this._suffixMap.get(this._suffixArray[idx].toString('hex'));
        for (const id of ids.values()) {
            result.add(id);
        }
    }

}

module.exports = SuffixArrayIndex;
