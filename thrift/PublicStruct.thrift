namespace java com.alone.dts.thrift.struct
struct JobStruct {
    1: string taskId,
    2: JobType type,
    3: optional i32 maxRetryTimes,
    5: optional i32 retryTimes,
    6: string nodeGroup,
    7: optional bool share,
    8: optional map<string, string> params,
    9: optional bool feedback,
    10: optional string cron,
    11: optional i64 triggerTime,
    12: optional i32 repeatCount,
    13: optional i32 repeatInterval,
    14: optional bool relyOnPrevCycle
}
exception InvalidOperation {
    1: i32 code,
    2: string msg
}

enum JobType {
    CRON,
    REAL_TIME,
    TIMER,
    REPEAT
}