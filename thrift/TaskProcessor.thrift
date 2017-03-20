include "PublicStruct.thrift"
namespace java com.alone.dts.thrift.service
service TaskProcessor {
    void execute(1: PublicStruct.JobStruct job, 2: string body) throws (1: PublicStruct.InvalidOperation ex);
}