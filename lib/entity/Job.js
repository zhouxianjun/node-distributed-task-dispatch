/**
 * Created by Alone on 2017/3/1.
 */
'use strict';
const Constant = require('../Constant');
const Utils = require('../Utils');
module.exports = function(sequelize, DataTypes) {
    console.log(Utils.objVal2Array(Constant.JOB_TYPE));
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
            defaultValue: 0
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
        share: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        params: DataTypes.TEXT,
        status: Reflect.apply(DataTypes.ENUM, DataTypes, Utils.objVal2Array(Constant.JOB_STATUS)),
        feedback: DataTypes.BOOLEAN,
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
            defaultValue: 0
        },
        relyOnPrevCycle: {
            field: 'rely_on_prev_cycle',
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        submitHost: {
            field: 'submit_host',
            type: DataTypes.STRING
        },
        submitPort: {
            field: 'submit_port',
            type: DataTypes.INTEGER
        },
        submitPid: {
            field: 'submit_pid',
            type: DataTypes.INTEGER
        }
    }, {
        underscored: true,
        tableName: 'dts_job'
    });
};