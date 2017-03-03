/**
 * Created by Alone on 2017/3/2.
 */
'use strict';
const FileRouter = require('./FileRouter');
const Utils = require('./Utils');
const logger = require('./Logger');
const Result = require('./dto/Result');
const config = require('../config.json');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();
const router = new Router(config.base_path);

//body
app.use(bodyParser());
//logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.debug(`Web Method: ${ctx.method} Url: ${ctx.url} Time: ${ms}`);
});

app.use(async (ctx, next) => {
    await next();
    if (404 != ctx.status) return;
    ctx.body = new Result(Result.CODE.NOT_FOUND).json;
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = new Result(false, err.msg || err.message || '操作失败').json;
        logger.error('router error', err, this);
    }
});

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

process.on('uncaughtException', err => {logger.error('uncaughtException', err)});

Utils.loadController(router, './controller');
app.use(router.routes()).use(router.allowedMethods());

app.listen(config.web_port, '0.0.0.0');