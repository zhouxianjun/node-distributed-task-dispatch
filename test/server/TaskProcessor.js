/**
 * Created by alone on 17-6-21.
 */
const PublicStruct = require('../../gen-nodejs/PublicStruct_types');
module.exports = class TaskProcessor {
    static get thrift() {
        return require('../../gen-nodejs/TaskProcessor');
    }
    static get version() {
        return '1.0.0';
    }
    static get attr() {
        return '{"nodeGroup": "test"}';
    }
    async execute(job){
        console.log(job);
        return new PublicStruct.HostInfo({host: '127.0.0.1', port: 0, pid: process.pid});
    }
};