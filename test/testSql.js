/**
 * Created by Alone on 2017/3/1.
 */
const Sequelize = require('sequelize');
const co = require("co");
const sequelize = new Sequelize(
    'dts', // 数据库名
    'root',   // 用户名
    'abcd1234',   // 用户密码
    {
        'dialect': 'mysql',  // 数据库使用mysql
        'host': '192.168.1.114', // 数据库服务器ip
        'port': 3306,        // 数据库服务器端口
        'define': {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            'underscored': true
        }
    }
);

const Job = sequelize.import('../lib/entity/Job');
const JobLog = sequelize.import('../lib/entity/JobLog');
co(function *() {
    yield Job.sync({force: true});
    yield JobLog.sync({force: true});
    /*let job = yield Job.create({
        name: 'Alone'
    });
    console.log(job.id);*/
}).catch(err => {console.error(err)});