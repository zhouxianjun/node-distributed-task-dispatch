'use strict';
const trc = require('trc');
const logger = require('tracer-logger');
const instance = Symbol();
const ServerRegister = trc.ServerRegister;
const PublicStruct = require('../gen-nodejs/PublicStruct_types');
class TaskProcessor {
    static get thrift() {
        return require('../gen-nodejs/TaskProcessor');
    }
    static get version() {
        return '1.0.0';
    }
    async execute(job){
        throw new Error(`this is interface function`);
    }
}
const ACTIONS = new Map();
class TaskTracker {
    constructor(symbol, zk, group, config = {}) {
        if (!symbol || symbol !== instance)
            throw new ReferenceError('Cannot be instantiated, please use static instance function');

        const self = this;
        let server = new ServerRegister(zk, config);
        Reflect.defineProperty(TaskProcessor, 'attr', {writable: false, configurable: false, value: `{"nodeGroup": "${group}"}`});
        Reflect.defineProperty(TaskProcessor.prototype, 'execute', {
            writable: false, configurable: false,
            async value(job) {
                logger.debug(`RECEIVE JOB ${job.taskId}`);
                try {
                    return await self.handler(job);
                } catch (err) {
                    logger.error(`job ${job.taskId} handler error`, err);
                    throw err;
                }
            }
        });
        this.host = server.config.host;
        this.port = server.config.port;
        server.loadObject(TaskProcessor, 'TaskProcessor').then(() => logger.info(`TaskProcessor auto loaded`));
        server.on('ready', () => this.ready = true);
    }

    static instance(zk, group, config) {
        if (!this._instance) {
            this._instance = Reflect.construct(this, [instance, zk, group, config]);
        }
        return this._instance;
    }

    async handler(job) {
        if (!ACTIONS.has(job.action)) {
            throw new Error(`job ${job.taskId} action ${job.action} is not found`);
        }
        let result = await Reflect.apply(ACTIONS.get(job.action), this, [job]);
        if (result !== true) {
            throw new Error(`execute fail`);
        }
        return new PublicStruct.HostInfo({host: this.host, port: this.port, pid: process.pid});
    }

    action(action, handler) {
        ACTIONS.set(action, handler);
        return this;
    }
}
module.exports = TaskTracker;