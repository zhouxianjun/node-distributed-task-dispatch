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
const cronParser = require('cron-parser');
const schedule = require('node-schedule');
const util = require('util');
const DB = require('../DB');
const RPC = require('../RPC');
const Constant = require('../Constant');
const TaskProcessor = require('../client/TaskProcessor');
const scheduleMap = new Map();
module.exports = class JobService {
    static get thrift() {
        return require('../../gen-nodejs/JobService');
    }
    static get version() {
        return '1.0.0';
    }
    async add(job){
        job.triggerTime = job.triggerTime ? new Date(job.triggerTime) : Date.now();
        job.dispatch = `${RPC.server.config.host}:${RPC.server.config.port}`;
        logger.debug(`add job: ${util.inspect(job)}`);
        let Job = DB.sequelize.model('Job');
        let result = await Job.create(job);
        JobService.execute(result.get({plain: true})).catch(err => {
            logger.error(`execute job: ${job.taskId} error`, err);
        });
    }

    static async execute(job) {
        let task;
        if (job.type === Constant.JOB_TYPE.CRON) {
            if (!JobService.isCron(job.cron)) {
                logger.warn(`job: ${job.taskId} cron is error`);
                return false;
            }
            task = schedule.scheduleJob({start: job.triggerTime, rule: job.cron}, this.distribute.bind(this, job.taskId));
        } else {
            task = schedule.scheduleJob(job.triggerTime, this.distribute.bind(this, job.taskId));
        }
        if (!task) {
            logger.info(`create schedule: ${job.taskId} fail distribute...`);
            return await this.distribute(job.taskId);
        }
        scheduleMap.set(job.taskId, task);
    }

    static async distribute(taskId) {
        let Job = DB.sequelize.model('Job');
        let taskProcessor = TaskProcessor.instance();
        await taskProcessor.execute(job);
    }

    static isCron(cron) {
        if (cron && typeof cron === 'string') {
            try {
                cronParser.parseExpression(cron);
                return true;
            } catch (err) {return false;}
        }
        return false;
    }
};