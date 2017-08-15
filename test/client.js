/**
 * Created with JetBrains Idea.
 * User: Along(Gary)
 * Date: 3/17/17
 * Time: 9:36 PM
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
const zookeeper = require('node-zookeeper-client');
const Client = require('../lib/Client');
let zk = zookeeper.createClient('127.0.0.1:2181');
zk.connect();
Client.instance(zk, 'test');
Client.instance().addJob({
    taskId: "1111",
    type: 'REAL_TIME',
    action: 'say'
}).catch(err => {
    console.log(err.stack);
});

// task processor
const TaskTracker = require('../lib/TaskTracker');
TaskTracker.instance(zk, 'test', {port: 9080});
TaskTracker.instance().action('say', async job => {
    console.log(`job ${job.taskId} say ok`);
    return true;
});