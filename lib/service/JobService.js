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
const pify = require('pify');
const DistributedLock = require('distributed-lock');
const DistributedLockService = DistributedLock.ZKDistributedLockService;
const distributedLockService = new DistributedLockService();
const util = require('util');
const config = require('../../config.json');
const DB = require('../DB');
const RPC = require('../RPC');
const Constant = require('../Constant');
const TaskProcessor = require('../client/TaskProcessor');
const PublicStruct = require('../../gen-nodejs/PublicStruct_types');
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
        let plain = result.get({plain: true});
        logger.info(`save job: ${util.inspect(plain)}`);
        JobService.execute(plain).catch(err => {
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
        let reentrantLock = distributedLockService.lock(taskId);
        try {
            let job = await Job.findOne({
                where: {
                    taskId: taskId
                }
            });
            if (!job) {
                logger.warn(`job: ${job.taskId} is not found`);
                return false;
            }
            job = job.get({plain: true});
            let dispatch = `${RPC.server.config.host}:${RPC.server.config.port}`;
            if (dispatch !== job.dispatch) {
                logger.warn(`job: ${job.taskId} dispatch: ${job.dispatch} not equal local host`);
                return false;
            }
            let JobLog = DB.sequelize.model('JobLog');
            let log = await JobLog.save({
                type: Constant.JOB_LOG_TYPE.DISTRIBUTE,
                taskId: job.taskId,
                jobId: job.id,
                nodeGroup: job.nodeGroup,
                success: false,
                operationHost: RPC.server.config.host,
                operationPort: RPC.server.config.port,
                operationPid: process.pid
            });
            await JobService.send(job, log, 0);
        } finally {
            await reentrantLock.unlockSync();
        }
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

    static async send(job, log, retry) {
        let taskProcessor = TaskProcessor.instance();
        try {
            await taskProcessor.execute(new PublicStruct(job));
            await log.update({
                success: true
            });
        } catch (err) {
            logger.error(`job: ${job.taskId} distribute fail`, err);
            if (retry < (config.distributeRetry || 3)) {
                return await JobService.send(job, log, ++retry);
            }
            await log.update({
                msg: util.inspect(err)
            });
            return false;
        }
    }
};