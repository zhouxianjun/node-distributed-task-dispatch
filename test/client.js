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
const thrift = require('thrift');
const zookeeper = require('node-zookeeper-client');
const trc = require('trc');
let client = zookeeper.createClient('127.0.0.1:2181');
client.connect();
const ServerProvider = trc.ServerProvider;
let provider = new ServerProvider(client, {
    invoker: new trc.invoker.factory.PoolInvokerFactory({
        transport: thrift.TFramedTransport,
        protocol: thrift.TCompactProtocol
    }),
    loadBalance: new trc.loadBalance.RoundRobinLoadBalance(),
});
const ReferenceBean = require('./service/JobService');
const PublicStruct = require('../gen-nodejs/PublicStruct_types');
provider.load('./service/');
provider.on('ready', () => {
    console.log('ready.....');
    let jobService = ReferenceBean.instance();
    jobService.add(new PublicStruct.JobStruct({
        taskId: "1111"
    })).then(result => {
        console.log('result', result);
    }).catch(err => {
        console.log(err.stack);
    });
});