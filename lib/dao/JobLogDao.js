'use strict';
const DB = require('../DB');
const SequelizeDao = require('sequelize-dao');
class JobLogDao extends SequelizeDao {
}
module.exports = new JobLogDao(DB.sequelize, 'JobLog');