namespace java com.alone.dts.thrift.struct
struct JobStruct {
    1: required string taskId,
    2: required string type,
    3: optional i32 maxRetryTimes,
    5: optional i32 retryTimes,
    6: required string nodeGroup,
    7: required string action,
    8: optional string params,
    9: optional string protoName,
    10: optional bool feedback,
    11: optional string cron,
    12: optional i64 triggerTime,
    13: optional i32 repeatCount,
    14: optional i32 repeatInterval,
    15: optional bool relyOnPrevCycle,
    16: required string submitHost,
    17: required i32 submitPid
}
exception InvalidOperation {
    1: i32 code,
    2: string msg
}

struct HostInfo {
    1: required string host,
    2: required i32 port,
    3: required i32 pid
}

const string CRON = 'CRON';
const string REAL_TIME = 'REAL_TIME';
const string TIMER = 'TIMER';
const string REPEAT = 'REPEAT';