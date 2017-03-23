/**
 * Created by Alone on 2017/3/21.
 */
'use strict';
const BasicRule = class BasicRule {
    get message() {return `validate fail`;}

    check(val, field) {return true;}

    validate(val, field) {
        if (!this.check(val, field)) {
            field = field.split('/').pop();
            throw new ValidationError(field, val, this);
        }
        return true;
    }
};

const ValidationError = class ValidationError extends Error {
    constructor(field, ...args) {
        super();
        for (let arg of args) {
            if (typeof arg === 'string') {
                this._message = arg;
            } else if (arg instanceof BasicRule) {
                this.rule = arg;
            } else {
                this.value = arg;
            }
        }
        this.field = field;
    }

    get message () {
        return `field: ${this.field}, value: ${this.value}${this.rule && `, rule: ${this.rule.message}`}, message: ${this._message || 'validate fail'}`;
    }
};

module.exports = BasicRule;
module.exports.ValidationError = ValidationError;