/**
 * Created by Alone on 2017/3/1.
 */
const Utils = require('../lib/Utils');
const DigitsRule = require('../lib/vaildate/rule/Digits');
let ruleMap = new Map();
ruleMap.set(['a.list[*].val'], [new DigitsRule(1, 10)]);
Utils.validate({
    a: {
        list: [{
            val: 1
        }]
    }
}, ruleMap);