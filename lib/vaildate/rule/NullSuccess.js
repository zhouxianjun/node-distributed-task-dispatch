/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const NotNull = require('./NotNull');
module.exports = class NullSuccess extends NotNull {
    get message() {
        return 'empty is success';
    }

    check(val, field) {
        if (!super.check(val, field)) return true;
        return this.valid(val, field);
    }

    valid(val, field) {return true;}
};