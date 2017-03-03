/**
 * Created with JetBrains WebStorm.
 * User: Gary
 * Date: 14-8-21
 * Time: 下午12:28
 * To change this template use File | Settings | File Templates.
 *                 _ooOoo_
 *                o8888888o
 *                88" . "88
 *                (| -_- |)
 *                O\  =  /O
 *             ____/`---'\____
 *           .'  \\|     |//  `.
 *           /  \\|||  :  |||//  \
 *           /  _||||| -:- |||||-  \
 *           |   | \\\  -  /// |   |
 *           | \_|  ''\---/''  |   |
 *           \  .-\__  `-`  ___/-. /
 *         ___`. .'  /--.--\  `. . __
 *      ."" '<  `.___\_<|>_/___.'  >'"".
 *     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *     \  \ `-.   \_ __\ /__ _/   .-` /  /
 *======`-.____`-.___\_____/___.-`____.-'======
 *                   `=---='
 *^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *           佛祖保佑       永无BUG
 */
'use strict';
const merge = require('merge');
const ErrorCodeDesc = require('./ErrorCodeDesc');
const _ = require('underscore');
module.exports = class Result {
    constructor(...args) {
        this.$prop = {
            success: false,
            data: {},
            msg: ErrorCodeDesc.errorDesc.FAIL,
            code: ErrorCodeDesc.errorCode.FAIL
        };
        if(args && args.length){
            args.forEach(arg => {
                if (_.isBoolean(arg)) {
                    this.$prop.success = arg;
                    if (this.$prop.success)
                        this.setResultCode(ErrorCodeDesc.errorCode.SUCCESS);
                    else
                        this.setResultCode(ErrorCodeDesc.errorCode.FAIL);
                } else if (_.isObject(arg) && Reflect.has(arg, 'key') && typeof arg['key'] === 'string' && Reflect.has(arg, 'value')) {
                    this.$prop.data[arg.key] = arg.value;
                } else if (typeof arg === 'string') {
                    this.$prop.msg = arg;
                } else if (_.isObject(arg)) {
                    this.$prop = merge(arg || {}, this.$prop);
                } else if (!_.isNaN(arg)) {
                    this.setResultCode(arg);
                }
            });
        }
    }
    get isSuccess() {
        return this.$prop.success;
    }
    setResultCode(code) {
       if (!_.isNaN(code)) {
            this.$prop.code = code;
            this.$prop.msg = ErrorCodeDesc.getDesc(code);
        }
        this.$prop.success = this.$prop.code == ErrorCodeDesc.errorCode.SUCCESS;
        return this;
    }
    addData(key, value) {
        this.$prop.data[key] = value;
    }
    getData(key) {
        return this.$prop.data[key];
    }
    get json() {
        return this.$prop;
    }
    static get CODE() {
        return ErrorCodeDesc.errorCode;
    }
};