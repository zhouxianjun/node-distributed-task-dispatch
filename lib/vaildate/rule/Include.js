/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const NullSuccess = require('./NullSuccess');
module.exports = class Include extends NullSuccess {
    constructor(include) {
        super();
        if (!Array.isArray(include)) throw new Error('Must be array');
        this.include = include;
    }
    get message() {
        return 'Must be within include';
    }

    valid(val, field) {
        return this.include.includes(val);
    }
};