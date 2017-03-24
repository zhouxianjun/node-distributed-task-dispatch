include "PublicStruct.thrift"
namespace java com.alone.dts.thrift.service
service TaskProcessor {
    PublicStruct.HostInfo execute(1: PublicStruct.JobStruct job, 2: string body, 3: string protoName, 4: string action) throws (1: PublicStruct.InvalidOperation ex);
}