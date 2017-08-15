'use strict';
const path = require('path');
const trc = require('trc');
const thrift = require('thrift');
const logger = require('tracer-logger');
const Utils = require('./Utils');
const instance = Symbol();
const ServerProvider = trc.ServerProvider;
const PublicStruct = require('../gen-nodejs/PublicStruct_types');
class Client {
    constructor(symbol, zk, group, config = {}) {
        if (!symbol || symbol !== instance)
            throw new ReferenceError('Cannot be instantiated, please use static instance function');
        let provider = new ServerProvider(zk, Object.assign({
            invoker: new trc.invoker.factory.PoolInvokerFactory({
                transport: thrift.TFramedTransport,
                protocol: thrift.TCompactProtocol
            }),
            loadBalance: new trc.loadBalance.RoundRobinLoadBalance(),
        }, config));
        provider.loadType(path.resolve(__dirname, '../client-thrift'));
        provider.on('ready', () => this.ready = true);
        this.group = group;
        this.host = provider.config.host;
    }

    static instance(zk, group, config) {
        if (!this._instance) {
            this._instance = Reflect.construct(this, [instance, zk, group, config]);
        }
        return this._instance;
    }

    async addJob(job) {
        job.nodeGroup = this.group;
        job.submitHost = this.host;
        job.submitPid = process.pid;
        let jobService = await this.getService();
        try {
            await jobService.add(new PublicStruct.JobStruct(job));
        } catch (e) {
            logger.error(`job ${job.taskId} add fail, save local store`, e);
        }
    }

    async getService() {
        if (this.jobService) return this.jobService;
        if (this.ready !== true && !this.jobService) {
            await Utils.sleep(500);
            return this.getService();
        }
        this.jobService = trc.ServerProvider.instance(require('../client-thrift/JobService'));
        return this.jobService;
    }
}
module.exports = Client;