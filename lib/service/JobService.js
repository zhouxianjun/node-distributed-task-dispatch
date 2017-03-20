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
const TaskProcessor = require('../client/TaskProcessor');
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
        await Job.create(job);
        await this.queue(job);
    }

    async queue(job) {
        this.data = this.data || [];
        if (job) {
            this.data.push(job);
        }
        if (this.data.length) {
            try {
                await this.execute(this.data.shift());
                logger.info(`execute job ${job.taskId} success`);
                await this.queue();
            } catch (err) {
                logger.error(`execute job ${job.taskId} fail`, err);
                await this.queue(job);
            }
        }
    }

    async execute(job) {
        let taskProcessor = TaskProcessor.instance();
        await taskProcessor.execute(job);
    }
};