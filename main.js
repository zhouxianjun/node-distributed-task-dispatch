/**
 * Created with JetBrains Idea.
 * User: Along(Gary)
 * Date: 3/15/17
 * Time: 9:02 PM
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
const path = require('path');
const SequelizeDao = require('sequelize-dao');
const config = require('./config.json');

(async () => {
    // 初始化数据库
    const DB = require('./lib/DB');
    await SequelizeDao.loadEntity(DB.sequelize, './lib/entity');
    // 初始化RPC
    const RPC = require('./lib/RPC');
    await RPC.client.loadType(path.resolve(__dirname, './gen-nodejs'));
    await RPC.server.load('./lib/service');

    const JobDao = require('./lib/dao/JobDao');
    const JobService = require('./lib/service/JobService');

    // 定时扫描 需要被分发的任务
    setInterval(async () => {
        try {
            let jobs = await JobDao.template('selectByAddToSchedule', {dispatch: `${RPC.server.config.host}:${RPC.server.config.port}`});
            for(let job of jobs) {
                if (JobService.hasSchedule(job.taskId)) continue;
                await JobService.addToSchedule(job);
            }
        } catch (err) {
            console.error(err.stack);
        }
    }, config.scan_interval || 1000);

    // 定时扫描 需要重试的任务
    setInterval(async () => {
        try {
            let jobs = await JobDao.template('selectByRetry', {dispatch: `${RPC.server.config.host}:${RPC.server.config.port}`});
            for(let job of jobs) {
                await JobService.addToSchedule(job, job.nextTime);
            }
        } catch (err) {
            console.error(err.stack);
        }
    }, config.scan_interval || 1000);
})();