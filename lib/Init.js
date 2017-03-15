/**
 * Created with JetBrains Idea.
 * User: Along(Gary)
 * Date: 3/15/17
 * Time: 8:59 PM
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
const Sequelize = require('sequelize');
exports.sequelize = new Sequelize(
    'dts', // 数据库名
    'root',   // 用户名
    'woaini',   // 用户密码
    {
        'dialect': 'mysql',  // 数据库使用mysql
        'host': '127.0.0.1', // 数据库服务器ip
        'port': 3306,        // 数据库服务器端口
        'define': {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            'underscored': true
        }
    }
);
const Job = exports.sequelize.import('../lib/entity/Job');
const JobLog = exports.sequelize.import('../lib/entity/JobLog');
(async () => {
    await Job.sync({force: true});
    await JobLog.sync({force: true});
})();

exports.app = require('./WebServer');