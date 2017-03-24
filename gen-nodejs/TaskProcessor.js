//
// Autogenerated by Thrift Compiler (0.10.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;

var PublicStruct_ttypes = require('./PublicStruct_types');


var ttypes = require('./TaskProcessor_types');
//HELPER FUNCTIONS AND STRUCTURES

var TaskProcessor_execute_args = function(args) {
  this.job = null;
  this.body = null;
  this.protoName = null;
  this.action = null;
  if (args) {
    if (args.job !== undefined && args.job !== null) {
      this.job = new PublicStruct_ttypes.JobStruct(args.job);
    }
    if (args.body !== undefined && args.body !== null) {
      this.body = args.body;
    }
    if (args.protoName !== undefined && args.protoName !== null) {
      this.protoName = args.protoName;
    }
    if (args.action !== undefined && args.action !== null) {
      this.action = args.action;
    }
  }
};
TaskProcessor_execute_args.prototype = {};
TaskProcessor_execute_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.job = new PublicStruct_ttypes.JobStruct();
        this.job.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.body = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.protoName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.action = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

TaskProcessor_execute_args.prototype.write = function(output) {
  output.writeStructBegin('TaskProcessor_execute_args');
  if (this.job !== null && this.job !== undefined) {
    output.writeFieldBegin('job', Thrift.Type.STRUCT, 1);
    this.job.write(output);
    output.writeFieldEnd();
  }
  if (this.body !== null && this.body !== undefined) {
    output.writeFieldBegin('body', Thrift.Type.STRING, 2);
    output.writeString(this.body);
    output.writeFieldEnd();
  }
  if (this.protoName !== null && this.protoName !== undefined) {
    output.writeFieldBegin('protoName', Thrift.Type.STRING, 3);
    output.writeString(this.protoName);
    output.writeFieldEnd();
  }
  if (this.action !== null && this.action !== undefined) {
    output.writeFieldBegin('action', Thrift.Type.STRING, 4);
    output.writeString(this.action);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var TaskProcessor_execute_result = function(args) {
  this.success = null;
  this.ex = null;
  if (args instanceof PublicStruct_ttypes.InvalidOperation) {
    this.ex = args;
    return;
  }
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = new PublicStruct_ttypes.HostInfo(args.success);
    }
    if (args.ex !== undefined && args.ex !== null) {
      this.ex = args.ex;
    }
  }
};
TaskProcessor_execute_result.prototype = {};
TaskProcessor_execute_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new PublicStruct_ttypes.HostInfo();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.ex = new PublicStruct_ttypes.InvalidOperation();
        this.ex.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

TaskProcessor_execute_result.prototype.write = function(output) {
  output.writeStructBegin('TaskProcessor_execute_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  if (this.ex !== null && this.ex !== undefined) {
    output.writeFieldBegin('ex', Thrift.Type.STRUCT, 1);
    this.ex.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var TaskProcessorClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this._seqid = 0;
    this._reqs = {};
};
TaskProcessorClient.prototype = {};
TaskProcessorClient.prototype.seqid = function() { return this._seqid; };
TaskProcessorClient.prototype.new_seqid = function() { return this._seqid += 1; };
TaskProcessorClient.prototype.execute = function(job, body, protoName, action, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_execute(job, body, protoName, action);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_execute(job, body, protoName, action);
  }
};

TaskProcessorClient.prototype.send_execute = function(job, body, protoName, action) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('execute', Thrift.MessageType.CALL, this.seqid());
  var args = new TaskProcessor_execute_args();
  args.job = job;
  args.body = body;
  args.protoName = protoName;
  args.action = action;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

TaskProcessorClient.prototype.recv_execute = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new TaskProcessor_execute_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.ex) {
    return callback(result.ex);
  }
  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('execute failed: unknown result');
};
var TaskProcessorProcessor = exports.Processor = function(handler) {
  this._handler = handler;
}
;
TaskProcessorProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}
;
TaskProcessorProcessor.prototype.process_execute = function(seqid, input, output) {
  var args = new TaskProcessor_execute_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.execute.length === 4) {
    Q.fcall(this._handler.execute, args.job, args.body, args.protoName, args.action)
      .then(function(result) {
        var result_obj = new TaskProcessor_execute_result({success: result});
        output.writeMessageBegin("execute", Thrift.MessageType.REPLY, seqid);
        result_obj.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result;
        if (err instanceof PublicStruct_ttypes.InvalidOperation) {
          result = new TaskProcessor_execute_result(err);
          output.writeMessageBegin("execute", Thrift.MessageType.REPLY, seqid);
        } else {
          result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
          output.writeMessageBegin("execute", Thrift.MessageType.EXCEPTION, seqid);
        }
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.execute(args.job, args.body, args.protoName, args.action, function (err, result) {
      var result_obj;
      if ((err === null || typeof err === 'undefined') || err instanceof PublicStruct_ttypes.InvalidOperation) {
        result_obj = new TaskProcessor_execute_result((err !== null || typeof err === 'undefined') ? err : {success: result});
        output.writeMessageBegin("execute", Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("execute", Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};
