/**
 * Created with JetBrains Idea.
 * User: Along(Gary)
 * Date: 3/17/17
 * Time: 7:55 PM
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
const logger = require('tracer-logger');
const util = require('util');
const DB = require('../DB');
module.exports = class JobService {
    static get thrift() {
        return require('../../gen-nodejs/JobService');
    }
    static get version() {
        return '1.0.0';
    }
    async add(job){
        logger.debug(`add job: ${util.inspect(job)}`);
        let Job = DB.sequelize.model('Job');
        return await Job.create(job);
    }
};