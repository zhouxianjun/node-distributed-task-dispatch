/**
 * Created by Alone on 2017/3/3.
 */
'use strict';
const Init = require('../Init');
const Job = Init.sequelize.import('../entity/Job');
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
        await Job.create(ctx.request.body);
        ctx.body = {};
    }
};