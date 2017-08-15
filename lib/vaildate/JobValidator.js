/**
 * Created by alone on 17-6-20.
 */
'use strict';
const v = require('path-validator');
module.exports = {
    addJob(job) {
        let rule = new Map();
        rule.set(['/taskId', '/type', '/nodeGroup', '/action'], [v.rule.NotNull.default]);
    }
};