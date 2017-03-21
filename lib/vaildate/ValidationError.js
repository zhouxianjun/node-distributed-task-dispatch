/**
 * Created by Alone on 2017/3/21.
 */
const BasicRule = require('./BasicRule');
module.exports = class ValidationError {
    constructor(field, ...args) {
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
        return `field: ${this.field} validate fail${this.value && `,value: ${this.value}`}${this.rule && `,rule: ${this.rule.message}`},message: ${this._message}`;
    }
};