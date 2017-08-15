/**
 * Created by Alone on 2017/3/1.
 */
'use strict';
const Constant = require('../Constant');
const Utils = require('../Utils');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Job', {
        type: Reflect.apply(DataTypes.ENUM, DataTypes, Utils.objVal2Array(Constant.JOB_TYPE)), // 类型
        retryTimes: {
            field: 'retry_times',
            type: DataTypes.INTEGER,
            defaultValue: 0
        },//重试次数
        maxRetryTimes: {
            field: 'max_retry_times',
            type: DataTypes.INTEGER,
            defaultValue: 10
        }, //最大重试次数
        taskId: {
            field: 'task_id',
            type: DataTypes.STRING,
            unique: 'task_id'
        },
        nodeGroup: {
            field: 'node_group',
            type: DataTypes.STRING
        },
        params: DataTypes.TEXT,
        status: Reflect.apply(DataTypes.ENUM, DataTypes, Utils.objVal2Array(Constant.JOB_STATUS)),
        feedback: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        cron: DataTypes.STRING,
        triggerTime: {
            field: 'trigger_time',
            type: DataTypes.DATE
        },
        repeatCount: {
            field: 'repeat_count',
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        repeatedCount: {
            field: 'repeated_count',
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        repeatInterval: {
            field: 'repeat_interval',
            type: DataTypes.INTEGER,
            defaultValue: 1000
        },
        relyOnPrevCycle: {
            field: 'rely_on_prev_cycle',
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        submitHost: {
            field: 'submit_host',
            type: DataTypes.STRING
        },
        submitPid: {
            field: 'submit_pid',
            type: DataTypes.INTEGER
        },
        action: DataTypes.STRING,
        dispatch: DataTypes.STRING
    }, {
        underscored: true,
        tableName: 'dts_job'
    });
};