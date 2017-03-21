/**
 * Created by Alone on 2017/3/21.
 */
'use strict';
const ValidationError = require('./ValidationError');
module.exports = class BasicRule {
    get message() {return `validate fail`;}

    check(val, field) {return true;}

    validate(val, field) {
        if (!this.check(val, field)) {
            throw new ValidationError(field, val, this);
        }
        return true;
    }
};