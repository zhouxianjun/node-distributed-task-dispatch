/**
 * Created by Alone on 2017/3/2.
 */
'use strict';
const path = require('path');
const watch = require('watch');
const walk = require('walk');
const logger = require('tracer-logger');
module.exports = class Utils {
    static objVal2Array(obj) {
        let array = [];
        Reflect.ownKeys(obj).forEach(key => {array.push(obj[key])});
        return array;
    }

    static load(root, fileStat) {
        let base = path.join(root, fileStat.name);
        if(fileStat.name.endsWith('.js')) {
            let pwd = path.relative(__dirname, base);
            if (!pwd.startsWith('.') && !pwd.startsWith('/')) {
                pwd = './' + pwd;
            }
            let indexOf = base.indexOf(':');
            if (!base.startsWith('/') && indexOf != -1) {
                base = base.substring(0, indexOf).toUpperCase() + base.substring(indexOf);
            }
            return {
                path: pwd,
                name: fileStat.name,
                basePath: base,
                object: require.cache[base] || require(pwd)
            };
        }
        return {};
    }

    static loadController(router, root, filter) {
        let walker = walk.walk(root, {
            followLinks: true,
            filters: filter || ['node_modules']
        });
        walker.on("file", (root, fileStat, next) => {
            try {
                let result = Utils.load(root, fileStat);
                let routers = result.object.routers;
                if (Array.isArray(routers) && routers.length > 0) {
                    for (let item of routers) {
                        Reflect.apply(router[item.method], router, [item.path, item.value]);
                        logger.info(`load web [${item.method}] ${item.path} for ${path.resolve(__dirname, result.path)}[${item.value.name}]`);
                    }
                }
            } catch (err) {
                logger.error('加载Controller:%s:%s异常.', fileStat.name, root, err);
            }
            next();
        });
        walker.on("errors", (root, nodeStatsArray, next) => {
            nodeStatsArray.forEach(n => {
                logger.error("[ERROR] ", n);
            });
            next();
        });
        walker.on("end", () => {
            logger.info('文件Controller加载完成!');
        });
    }
};