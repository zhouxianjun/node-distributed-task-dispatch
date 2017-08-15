'use strict';
const path = require('path');
const BasicDao = require('./BasicDao');
class JobLogDao extends BasicDao {
}
module.exports = new JobLogDao('JobLog', path.resolve(__dirname, '../../test/art.xml'));