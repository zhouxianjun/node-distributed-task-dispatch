/**
 * Created with JetBrains Idea.
 * User: Gary
 * Date: 2016/6/30
 * Time: 12:50
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
const walk = require('walk');
const logger = require('./Logger');
const Utils = require('./Utils');
const config = require('../config.json');
module.exports = class FileRouter {
    constructor(router) {
        this.router = router;
    }
    auto(root, filter) {
        let walker = walk.walk(root, {
            followLinks: true,
            filters: filter || ['node_modules']
        });
        walker.on("file", (root, fileStat, next) => {
            this.onFile(root, fileStat);
            next();
        });
        walker.on("errors", (root, nodeStatsArray, next) => {
            nodeStatsArray.forEach(n => {
                logger.error("[ERROR] " + n);
            });
            next();
        });
        walker.on("end", () => {
            logger.info('文件Controller加载完成!');
        });
        Utils.watch(root, (curr, f, prev) => {
            this.onFile(path.dirname(f), curr);
        }, (curr, f, prev) => {
            if(require.cache[f]){
                this.delRouter(require.cache[f], curr.name.substring(0, curr.name.length - '.js'.length));
                Reflect.deleteProperty(require.cache, f);
            }
        });
    }
    onFile(root, fileStat) {
        try {
            Utils.fileChange(root, fileStat, (pwd, obj, base) => {
                let simpleName = fileStat.name.substring(0, fileStat.name.length - '.js'.length);
                this.addRouter(obj, simpleName);
            });
        } catch (err) {
            logger.error('加载Controller:%s:%s异常.', fileStat.name, root, err);
        }
    }
    addRouter(obj, simpleName) {
        let fKey = `${config.base_path || ''}${obj.path || '/' + simpleName.substring(0, 1).toLowerCase() + simpleName.substring(1)}`;
        let tmp = Reflect.construct(obj.prototype.constructor, [this.router]);
        this.delRouter(obj, simpleName);
        Reflect.ownKeys(obj.prototype).forEach(method => {
            let descriptor = Reflect.getOwnPropertyDescriptor(obj.prototype, method);
            if (method != 'constructor' &&
                descriptor.get === undefined &&
                descriptor.set === undefined &&
                typeof descriptor.value == 'function') {
                let name = descriptor.value.name;
                let url;
                if(name === '$'){
                    url = fKey;
                }else {
                    url = fKey + '/' + name;
                }

                if (descriptor.value.constructor.name == 'GeneratorFunction') {
                    this.router.all(url, descriptor.value);
                } else {
                    this.router[tmp.type || 'all'](url, function *(next) {
                        Reflect.apply(tmp[method], tmp, [this, next]);
                    });
                }
                logger.info('注册Controller<%s>:%s = %s', simpleName, url, simpleName + '.' + name);
            }
        });
    }
    delRouter(obj, name) {
        let fKey = `${config.base_path || ''}${obj.path || '/' + name.substring(0, 1).toLowerCase() + name.substring(1)}`;
        Reflect.ownKeys(obj.prototype).forEach(method => {
            let descriptor = Reflect.getOwnPropertyDescriptor(obj.prototype, method);
            if (method != 'constructor' &&
                descriptor.get === undefined &&
                descriptor.set === undefined &&
                typeof descriptor.value == 'function') {
                let url;
                if(method === '$'){
                    url = fKey;
                }else {
                    url = fKey + '/' + method;
                }
                this.removeIfRouter(url);
            }
        });
    }
    removeIfRouter(url){
        this.router.stack.forEach((r, i, routes) => {
            if (r.path == url) {
                routes.splice(i, 1);
                logger.info('删除 Router<%s>', url);
            }
        });
    }
};