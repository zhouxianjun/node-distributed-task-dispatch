/**
 * Created by Alone on 2017/3/1.
 */
const DB = require('../lib/DB');
let Job = DB.sequelize.model('Job');
let job = Job.findOne({
    where:  {
        taskId: '11'
    }
});
console.log(job);