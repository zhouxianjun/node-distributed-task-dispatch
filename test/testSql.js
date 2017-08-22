/**
 * Created by Alone on 2017/3/1.
 */
const SequelizeDao = require('sequelize-dao');
const DB = require('../lib/DB');
const Paging = SequelizeDao.Paging;
(async() => {
    await SequelizeDao.loadEntity(DB.sequelize, '../lib/entity');
    const JobLogDao = require('../lib/dao/JobLogDao');
    let paging = new Paging();
    paging.num = 1;
    paging.size = 10;
    await JobLogDao.selectByPage('select * from dts_job_log order by created_at desc', paging);
    console.log(paging);
    try {
        let result = await JobLogDao.template('selectByTest', {
            id: 1
        });
        console.log(result);
        result = await JobLogDao.template('updateById', {id: 1, create: new Date()});
        console.log(result);
        let array = [null, 'RECEIVE', 'aaa', null, null, true, null, null, null, null, new Date(), new Date()];
        result = await JobLogDao.template('insertByObj', Object.assign({arr: array}, SequelizeDao.TemplateUtils.arrayToObj(array)));
        console.log(result);
        result = await JobLogDao.templateByPage('selectByPage', paging);
        console.log(result);
    } catch (e) {
        console.error(e.stack);
    }
})();