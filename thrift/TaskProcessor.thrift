include "PublicStruct.thrift"
namespace java com.alone.dts.thrift.service
service TaskProcessor {
    PublicStruct.ExecuteResult execute(1: PublicStruct.JobStruct job) throws (1: PublicStruct.InvalidOperation ex);
}