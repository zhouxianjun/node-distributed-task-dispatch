/**
 * Created by Alone on 2017/3/20.
 */
'use strict';
const logger = require('tracer-logger');
const util = require('util');
const DB = require('../DB');
const trc = require('trc');
module.exports = class TaskProcessor extends trc.ReferenceBean {
    static get type() {
        return require('../../gen-nodejs/TaskProcessor');
    }
    static get version() {
        return '1.0.0';
    }
    get service() {
        return 'TaskProcessor';
    }
    async execute(job){}
};