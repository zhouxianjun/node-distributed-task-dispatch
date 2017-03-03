/**
 * Created by Alone on 2017/3/3.
 */
'use strict';
module.exports = class JobController {
    static get routers() {
        return [{
            method: 'get',
            path: '/say/:name',
            value: JobController.say
        }];
    }
    static say(ctx) {
        console.log(`say hello ${ctx.params.name}`);
        ctx.body = {};
    }
};