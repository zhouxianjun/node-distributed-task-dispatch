/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const NullSuccess = require('./NullSuccess');
module.exports = class Boolean extends NullSuccess {
    get message() {
        return 'Must be a Boolean value';
    }

    valid(val, field) {
        if (typeof val === 'boolean') return true;
        if (typeof val === 'string') return val === 'true' || val === 'false';
        return false;
    }
};