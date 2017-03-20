include "PublicStruct.thrift"
namespace java com.alone.dts.thrift.service
service JobService {
    void execute(1: PublicStruct.JobStruct job) throws (1: PublicStruct.InvalidOperation ex);
}