/**
 * Created by Alone on 2017/3/1.
 */
"use strict";
const assert = require('assert');
const schedule = require('node-schedule');

let distribute = taskId => {
    console.log(taskId);
    assert(taskId, 'error');
};

let task = schedule.scheduleJob('*/2 * * * * *', distribute.bind(this));
console.log(task);