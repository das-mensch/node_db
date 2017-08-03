const PatriciaIndex = require('./PatriciaIndex');
const SuffixArrayIndex = require('./SuffixArrayIndex');

const { InvalidArgumentException } = require('../exception');

const PATRICIA_INDEX = 1;
const SUFFIX_ARRAY_INDEX = 2;

class Indexes {
    static forId(id) {
        switch (id) {
            case PATRICIA_INDEX:
                return new PatriciaIndex();
            case SUFFIX_ARRAY_INDEX:
                return new SuffixArrayIndex();
            default:
                throw new InvalidArgumentException();
        }
    }
}
