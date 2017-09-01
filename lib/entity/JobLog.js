/**
 * Created by Alone on 2017/3/1.
 */
'use strict';
const Constant = require('../Constant');
const SequelizeDao = require('sequelize-dao');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('JobLog', {
        type: Reflect.apply(DataTypes.ENUM, DataTypes, SequelizeDao.objVal2Array(Constant.JOB_LOG_TYPE)), // 类型
        taskId: {
            field: 'task_id',
            type: DataTypes.STRING
        },
        jobId: {
            field: 'job_id',
            type: DataTypes.INTEGER
        },
        nodeGroup: {
            field: 'node_group',
            type: DataTypes.STRING
        },
        success: DataTypes.BOOLEAN,
        msg: DataTypes.TEXT,
        action: DataTypes.STRING,
        operationHost: {
            field: 'operation_host',
            type: DataTypes.STRING
        },
        operationPort: {
            field: 'operation_port',
            type: DataTypes.INTEGER
        },
        operationPid: {
            field: 'operation_pid',
            type: DataTypes.INTEGER
        }
    }, {
        underscored: true,
        tableName: 'dts_job_log'
    });
};