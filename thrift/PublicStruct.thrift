namespace java com.alone.dts.thrift.struct
struct JobStruct {
    1: required string taskId,
    2: required string type,
    3: optional i32 maxRetryTimes = 10,
    5: optional i32 retryTimes = 0,
    6: required string nodeGroup,
    7: required string action,
    8: optional string params,
    9: optional bool feedback = false,
    10: optional string cron,
    11: optional i64 triggerTime,
    12: optional i32 repeatCount = 0,
    13: optional i32 repeatInterval = 1000,
    14: optional bool relyOnPrevCycle = false,
    15: required string submitHost,
    16: required i32 submitPid
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

struct ExecuteResult {
    1: optional string msg,
    2: required HostInfo info
}

const string CRON = 'CRON';
const string REAL_TIME = 'REAL_TIME';
const string TIMER = 'TIMER';
const string REPEAT = 'REPEAT';