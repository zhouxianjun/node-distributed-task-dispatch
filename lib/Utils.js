/**
 * Created by Alone on 2017/3/2.
 */
'use strict';
const path = require('path');
const watch = require('watch');
const walk = require('walk');
const logger = require('./Logger');
module.exports = class Utils {
    static objVal2Array(obj) {
        let array = [];
        Reflect.ownKeys(obj).forEach(key => {array.push(obj[key])});
        return array;
    }

    static loadController(router, root, filter) {
        let walker = walk.walk(root, {
            followLinks: true,
            filters: filter || ['node_modules']
        });
        walker.on("file", (root, fileStat, next) => {
            try {
                let result = Utils.fileChange(root, fileStat);
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
                logger.error("[ERROR] " + n);
            });
            next();
        });
        walker.on("end", () => {
            logger.info('文件Controller加载完成!');
        });
    }

    static watch(dir, onChange, onDelete){
        watch.watchTree(dir, (f, curr, prev) => {
            if(!(typeof f == "object" && prev === null && curr === null) && curr != null && (curr.isFile() || curr.nlink === 0)){
                let resolve = path.resolve(f);
                if(!curr.name)curr.name = path.basename(resolve);
                if(curr.nlink === 0){
                    if(typeof onDelete === 'function'){
                        Reflect.apply(onDelete, onDelete, [curr, resolve, prev]);
                    }
                    return;
                }
                if(typeof onChange === 'function'){
                    Reflect.apply(onChange, onChange, [curr, resolve, prev]);
                }
            }
        });
    }

    static fileChange(root, fileStat) {
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
            if (require.cache[base]) {
                Reflect.deleteProperty(require.cache, base);
                console.log(`reload file: ${fileStat.name}:${base}`);
            }
            let service = require(pwd);
            return {
                path: pwd,
                object: service,
                basePath: base
            };
        }
        return null;
    }
};