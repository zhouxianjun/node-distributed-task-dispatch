/**
 * Created by Alone on 2017/3/2.
 */
'use strict';
class Utils {
    static objDate2Number(obj) {
        Reflect.ownKeys(obj).forEach(key => {
            if (obj[key] instanceof Date) obj[key] = obj[key].getTime();
        });
    }
}
module.exports = Utils;