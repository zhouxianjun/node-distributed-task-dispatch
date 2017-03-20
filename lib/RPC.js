/**
 * Created with JetBrains Idea.
 * User: Along(Gary)
 * Date: 3/16/17
 * Time: 7:52 PM
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
const config = require('../config.json');
const zookeeper = require('node-zookeeper-client');
const thrift = require('thrift');
const trc = require('trc');
const ServerRegister = trc.ServerRegister;
exports.zkClient = zookeeper.createClient(config.zookeeper);
exports.zkClient.connect();
exports.server = new ServerRegister(exports.zkClient);

const ServerProvider = trc.ServerProvider;
// 任务处理器
exports.client = new ServerProvider(exports.zkClient, {
    invoker: new trc.invoker.factory.PoolInvokerFactory({
        transport: thrift.TFramedTransport,
        protocol: thrift.TCompactProtocol
    }),
    loadBalance: new trc.loadBalance.RoundRobinLoadBalance()
});