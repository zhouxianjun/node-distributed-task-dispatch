/**
 * Created by Alone on 2017/3/3.
 */
'use strict';
const logger = require('tracer-logger');
const util = require('util');
module.exports = class JobController {
    static get routers() {
        return [{
            method: 'post',
            path: '/job/add',
            value: JobController.add
        }];
    }
    static async add(ctx) {
        logger.debug(`add job: ${util.inspect(ctx.request.body)}`);
        ctx.body = {};
    }
};