/**
 * Created by Alone on 2017/3/3.
 */
'use strict';
const config = require('../config.json');
const merge = require('merge');
const defaultLogConfig = {
    root:'../logs',
    format : [
        "{{timestamp}} <{{title}}>  [{{file}}:{{line}}:{{pos}}] - {{message}}", //default format
        {
            error : "{{timestamp}} <{{title}}>  [{{file}}:{{line}}:{{pos}}] - {{message}}\nCall Stack:\n{{stack}}" // error format
        }
    ],
    dateformat : "HH:MM:ss.L",
    preprocess :  function(data){
        data.title = data.title.toUpperCase();
    },
    transport: function(data){
        console.log(data.output);
    }
};

module.exports = require('tracer').dailyfile(merge(config.log || {}, defaultLogConfig));