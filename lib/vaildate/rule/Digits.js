/**
 * Created by Alone on 2017/3/22.
 */
'use strict';
const NullSuccess = require('./NullSuccess');
module.exports = class Digits extends NullSuccess {
    constructor(...args) {
        super();
        if (args.length == 2) {
            this.min = args[0];
            this.max = args[1];
        } else if (Array.isArray(args[0])) {
            this.include = args[0];
            this.min = Number.MIN_VALUE;
            this.max = Number.MAX_VALUE;
        }
    }
    get message() {
        return 'Must be a number whose value must be within acceptable limits';
    }

    valid(val, field) {
        if (Number.isNaN(val)) return false;
        try {
            let value = Number(val);
            if (!Number.isInteger(value.valueOf())) return false;
            return value >= this.min && value <= this.max && (!this.include || this.include.includes(value));
        } catch (err) {
            return false;
        }
    }
};