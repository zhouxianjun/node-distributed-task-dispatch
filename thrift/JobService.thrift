include "PublicStruct.thrift"
namespace java com.alone.dts.thrift.service
service JobService {
    void add(1: PublicStruct.JobStruct job) throws (1: PublicStruct.InvalidOperation ex);
    void addList(1: list<PublicStruct.JobStruct> jobs) throws (1: PublicStruct.InvalidOperation ex);
    void pause(1: string taskId, 2: string msg, 3: PublicStruct.HostInfo hostInfo) throws (1: PublicStruct.InvalidOperation ex);
    void recovery(1: string taskId, 2: string msg, 3: PublicStruct.HostInfo hostInfo) throws (1: PublicStruct.InvalidOperation ex);
    void cancel(1: string taskId, 2: string msg, 3: PublicStruct.HostInfo hostInfo) throws (1: PublicStruct.InvalidOperation ex);
}