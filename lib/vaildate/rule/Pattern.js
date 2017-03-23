/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const NullSuccess = require('./NullSuccess');
module.exports = class Pattern extends NullSuccess {
    constructor(regexp) {
        super();
        this.regexp = regexp;
    }

    get message() {
        return 'Not consistent with regular expressions';
    }

    valid(val, field) {
        return this.regexp.test(val);
    }
};