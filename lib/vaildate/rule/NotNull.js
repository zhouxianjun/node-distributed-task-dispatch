/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const BasicRule = require('../BasicRule');
module.exports = class NotNull extends BasicRule {
    get message() {
        return 'cannot be empty';
    }

    check(val, field) {
        return !!val || typeof val === 'boolean';
    }
};