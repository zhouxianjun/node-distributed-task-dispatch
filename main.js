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
const config = require('./config.json');
const Utils = require('./lib/Utils');
const Constant = require('./lib/Constant');

(async () => {
    // 初始化数据库
    const DB = require('./lib/DB');
    await Utils.loadEntity(DB.sequelize, './lib/entity');
    // 初始化RPC
    const RPC = require('./lib/RPC');
    RPC.client.loadType(path.resolve(__dirname, './gen-nodejs'));
    RPC.client.on('ready', async () => {
        RPC.server.load('./lib/service');
        const JobDao = require('./lib/dao/JobDao');
        const JobService = require('./lib/service/JobService');

        // 定时扫描
        /*setInterval(async () => {
            try {
                let jobs = await JobDao.findAll({
                    status: Constant.JOB_STATUS.CREATE,
                    dispatch: `${RPC.server.config.host}:${RPC.server.config.port}`
                });
                for(let job of jobs) {
                    await JobService.addToSchedule(job.get({plain: true}));
                }
            } catch (err) {
                console.error(err.stack);
            }
        }, config.scan_interval || 1000);*/
    });
})();