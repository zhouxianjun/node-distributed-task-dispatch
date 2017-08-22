'use strict';
const DB = require('../DB');
const SequelizeDao = require('sequelize-dao');
const path = require("path");
class JobDao extends SequelizeDao {
}
module.exports = new JobDao(DB.sequelize, 'Job', path.resolve(__dirname, '../mapper/job.xml'));