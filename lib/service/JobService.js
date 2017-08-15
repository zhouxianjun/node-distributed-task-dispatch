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
const trc = require('trc');
const DistributedLock = require('distributed-lock');
const DistributedLockService = DistributedLock.ZKDistributedLockService;
const distributedLockService = new DistributedLockService();
const config = require('../../config.json');
const Utils = require('../Utils');
const RPC = require('../RPC');
const Constant = require('../Constant');
const JobDao = require('../dao/JobDao');
const JobLogDao = require('../dao/JobLogDao');
const taskProcessor = trc.ServerProvider.instance(require('../../gen-nodejs/TaskProcessor'));
const PublicStruct = require('../../gen-nodejs/PublicStruct_types');
const scheduleMap = new Map();
class JobService {
    static get thrift() {
        return require('../../gen-nodejs/JobService');
    }

    static get version() {
        return '1.0.0';
    }

    /**
     * 新增任务
     * @param job
     * @returns {Promise.<void>}
     */
    async add(job){
        // 验证cron表达式
        if (job.type === Constant.JOB_TYPE.CRON && !JobService.isCron(job.cron)) {
            throw new Error(`job: ${job.taskId} cron is error`);
        }
        // 设置触发时间
        job.triggerTime = job.triggerTime ? new Date(job.triggerTime) : Date.now();
        // 默认设置分发服务器为本机
        job.dispatch = `${RPC.server.config.host}:${RPC.server.config.port}`;
        // 设置任务状态
        job.status = Constant.JOB_STATUS.CREATE;
        logger.debug(`add job: ${util.inspect(job)}`);

        // 入库
        let result = await JobDao.save(job);
        let plain = result.get({plain: true});
        logger.info(`save job: ${util.inspect(plain)}`);

        // 添加分发定时器
        await JobService.addToSchedule(plain).catch(err => logger.error(`job ${plain.taskId} add schedule error`, err));
    }

    static async addToSchedule(job) {
        if (scheduleMap.has(job.taskId)) {
            logger.warn(`job ${job.taskId} is have schedule.`);
            return;
        }
        // 如果触发时间未到或者是cron模式则需要在本地创建定时器去派发任务
        let task = schedule.scheduleJob(job.type === Constant.JOB_TYPE.CRON ? {start: job.triggerTime, rule: job.cron} : job.triggerTime, async () => {
            await JobService.distribute(job.taskId).catch(err => logger.error(`distribute ${job.taskId} error`, e));
        });
        // 任务派发失败 则默认直接执行派发
        if (!task) {
            logger.info(`create schedule: ${job.taskId} fail distribute...`);
            await this.distribute(job.taskId);
            return;
        }
        scheduleMap.set(job.taskId, task);
    }

    static async distribute(taskId) {
        // 分布式锁
        let reentrantLock = await distributedLockService.lock(taskId, 30000);
        try {
            let job = await JobDao.findOne({taskId});
            if (!job) {
                logger.warn(`job: ${job.taskId} is not found`);
                return;
            }
            let plain = job.get({plain: true});
            // 获取执行服务器配置
            let dispatch = `${RPC.server.config.host}:${RPC.server.config.port}`;
            if (dispatch !== plain.dispatch) {
                logger.warn(`job: ${plain.taskId} dispatch: ${plain.dispatch} not equal local host`);
                return;
            }
            // 更新任务状态为运行中
            await job.update({status: Constant.JOB_STATUS.RUNNING});
            // 保存任务日志
            let record = {
                type: Constant.JOB_LOG_TYPE.COMPLETE,
                taskId: plain.taskId,
                jobId: plain.id,
                nodeGroup: plain.nodeGroup,
                success: true
            };
            try {
                let result = await JobService.execute(plain);
                record.operationHost = result.host;
                record.operationPort = result.port;
                record.operationPid = result.pid;
            } catch (err) {
                logger.error(`job ${job.taskId} execute error`, err);
                record.msg = util.inspect(err);
                record.success = false;
            }
            await JobLogDao.save(record);

            switch (job.type) {
                case Constant.JOB_TYPE.REAL_TIME:
                case Constant.JOB_TYPE.TIMER:
                    if (record.success !== true && job.retryTimes >= job.maxRetryTimes) {
                        await job.update({status: Constant.JOB_STATUS.FAILED});
                    }
                    if (record.success === true) {
                        await job.update({status: Constant.JOB_STATUS.SUCCESS});
                    }
                    break;
                case Constant.JOB_TYPE.REPEAT:
                    if (record.success !== true && job.retryTimes >= job.maxRetryTimes && job.repeatedCount >= job.repeatCount) {
                        await job.update({status: Constant.JOB_STATUS.FAILED});
                    }
                    if (record.success === true) {
                        await job.update({status: Constant.JOB_STATUS.SUCCESS});
                    }
                    break;
            }
        } finally {
            reentrantLock.unlockSync();
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

    static async execute(job) {
        Reflect.deleteProperty(job, 'triggerTime');
        return await taskProcessor.execute(new PublicStruct.JobStruct(job), job.nodeGroup);
    }
}
module.exports = JobService;