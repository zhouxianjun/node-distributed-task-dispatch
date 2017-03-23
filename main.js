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
const config = require('./config.json');
const Utils = require('./lib/Utils');
// 初始化数据库
const DB = require('./lib/DB');
Utils.loadEntity(DB.sequelize, './lib/entity');

// 初始化RPC
const RPC = require('./lib/RPC');
RPC.server.load('./lib/service');
// RPC.client.load('./lib/client');
