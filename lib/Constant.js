/**
 * Created by Alone on 2017/3/2.
 */
// 任务类型
exports.JOB_TYPE = {
    CRON: 'CRON',
    REAL_TIME: 'REAL_TIME',
    TIMER: 'TIMER',
    REPEAT: 'REPEAT'
};

// 任务状态
exports.JOB_STATUS = {
    CREATE: 'CREATE',
    RUNNING: 'RUNNING',
    PAUSE: 'PAUSE',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCEL: 'CANCEL'
};

// 任务日志类型
exports.JOB_LOG_TYPE = {
    DISTRIBUTE: 'DISTRIBUTE',
    COMPLETE: 'COMPLETE',
    RECEIVE: 'RECEIVE',
    PAUSE: 'PAUSE',
    RECOVERY: 'RECOVERY',
    CANCEL: 'CANCEL'
};