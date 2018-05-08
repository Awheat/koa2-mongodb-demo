/*
* author: WuWangCheng
* date: 2018-05-08
* email: 395212731@qq.com
*
**/
const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const koaStatic = require('koa-static');
const router = require('./routers/index');
const mongoose = require('mongoose');
const database = require('./configs/database');
//实例
const app = new Koa();

//mongodb连接
mongoose.connect(database.url);
mongoose.connection.on('error', console.error);


//配置静态资源目录
app.use(koaStatic(path.join(__dirname, './public')));

//配置模板
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

//加载路由
app.use(router.routes(), router.allowedMethods());

//监听端口
app.listen(3000);
console.log('the server is start at port 3000 ~');
