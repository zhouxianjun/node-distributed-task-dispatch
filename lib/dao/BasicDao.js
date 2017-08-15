'use strict';
const fs = require('fs');
const assert = require('assert');
const DB = require('../DB');
const logger = require('tracer-logger');
const xml2js = require('xml2js');
const art = require('art-template');
const Utils = require('../Utils');
const util = require('util');
art.defaults.imports.Utils = Utils.template;
const Types = ['SELECT', 'RAW'];
class BasicDao {
    constructor(model, template) {
        this.Model = DB.sequelize.model(model);
        this.mapper = null;
        if (template) {
            xml2js.parseString(fs.readFileSync(template), {explicitArray: false, trim: true, mergeAttrs: true, explicitRoot: false}, async (err, res) => {
                if (err) console.error(err.stack);
                if (res) {
                    await this.parseTemplate(res);
                } else {
                    this.mapper = false;
                }
            });
        } else {
            this.mapper = false;
        }
    }

    /**
     * 保存实体
     * @param record
     * @param fields
     * @returns {Promise.<*>}
     */
    async save(record, fields) {
        Reflect.ownKeys(record).forEach(key => {record[key] === null && Reflect.deleteProperty(record, key)});
        return await this.Model.create(record, {fields});
    }

    /**
     * 根据ID查询
     * @param id
     * @returns {Promise.<void>}
     */
    async selectById(id) {
        return await this.Model.findById(id);
    }

    /**
     * 查询单个
     * @param where
     * @returns {Promise.<*>}
     */
    async findOne(where) {
        return await this.Model.findOne({where});
    }

    async findAll(where) {
        return await this.Model.findAll({where});
    }

    /**
     * 更新数据
     * @param record
     * @param where
     * @param fields
     * @returns {Promise.<Array.<affectedCount, affectedRows>>}
     */
    async update(record, where = {}, fields) {
        return await this.Model.update(record, {fields, where});
    }

    /**
     * 删除
     * @param where
     * @returns {Promise.<Integer>}
     */
    async remove(where = {}) {
        return await this.Model.destroy({where});
    }

    /**
     * 分页查询
     * @param sql
     * @param paging
     * @param params
     * @returns {Promise.<*>}
     */
    async selectByPage(sql, paging, params) {
        sql = sql.toLowerCase();
        let countSql = sql.replace(/select([\s\S]*)from/, 'select count(1) `count` from ');
        let orderByIndex = countSql.indexOf('order by');
        if (orderByIndex >= 0 && countSql.indexOf('?', orderByIndex) === -1) {
            countSql = countSql.substring(0, orderByIndex);
        }
        let countResult = await this.execSql(countSql, DB.sequelize.QueryTypes.SELECT, params);
        let count = countResult[0]['count'];
        paging.count = count;
        if (count && count > 0) {
            paging.items = await this.execSql(`${sql} limit ${paging.index},${paging.size}`, DB.sequelize.QueryTypes.SELECT, params);
        }
        return paging;
    }

    /**
     * 执行SQL
     * @param sql
     * @param type
     * @param params
     * @returns {Promise.<*>}
     */
    async execSql(sql, type, params) {
        assert(DB.sequelize.QueryTypes[type], `不支持的类型 ${type}`);
        return await DB.sequelize.query(sql, {replacements: params, type});
    }

    /**
     * 调用模板函数
     * @param name
     * @param params
     * @returns {Promise.<*>}
     */
    async template(name, params) {
        let mapper = await this.getMapper();
        assert(mapper[name], `模板没有找到 ${name} 这个方法`);
        let sql = mapper[name].render(params);
        logger.log(`exec template ${name}: ${sql}`);
        let result = await this.execSql(sql, mapper[name].type, params);
        if ((mapper[name].single === true || mapper[name].type === 'RAW') && Array.isArray(result)) {
            return result[0];
        }
        return result;
    }

    /**
     * 调用模板分页
     * @param name
     * @param paging
     * @param params
     * @returns {Promise.<*>}
     */
    async templateByPage(name, paging, params) {
        let mapper = await this.getMapper();
        assert(mapper[name], `模板没有找到 ${name} 这个方法`);
        assert(mapper[name].type === 'SELECT', `模板 ${name} 不是查询类型`);
        let sql = mapper[name].render(params);
        logger.log(`exec template page ${name}: ${sql}`);
        return this.selectByPage(sql, paging, params);
    }

    async getMapper() {
        if (this.mapper === null) {
            Utils.sleep(500);
            return await this.getMapper();
        }
        if (this.mapper === false)
            throw new Error(`no template`);
        return this.mapper;
    }

    async parseTemplate(res) {
        try {
            this.mapper = {};
            logger.log(`加载模板: ${util.inspect(res)}`);
            Reflect.ownKeys(res).forEach(key => {
                let type = key.toUpperCase();
                if (!Types.includes(type)) {
                    logger.warn(`template not support type ${key}`);
                    return;
                }
                let items = res[key];
                if (!Array.isArray(items)) items = [items];

                items.forEach(item => this.mapper[item.id] = {
                    type,
                    render: art.compile(item._.replace(/\n/g, ' ')),
                    single: !!item.single
                });
            });
        } catch (e) {
            logger.error('解析模板异常', e);
        }
    }
}
module.exports = BasicDao;