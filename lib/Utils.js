/**
 * Created by Alone on 2017/3/2.
 */
'use strict';
module.exports = class Utils {
    static objVal2Array(obj) {
        let array = [];
        Reflect.ownKeys(obj).forEach(key => {array.push(obj[key])});
        return array;
    }
};