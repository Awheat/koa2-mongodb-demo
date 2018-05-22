/*
* author: WuWangCheng
* date: 2018-05-08
* email: 395212731@qq.com
*
**/
const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const koaStatic = require('koa-static');
const router = require('./routers/index');
const mongoose = require('mongoose');
const cors = require('koa2-cors');
const database = require('./configs/database');
const response = require('./middlewares/resp');

//实例
const app = new Koa();


//mongodb连接
mongoose.connect(database.url);
mongoose.connection.on('error', console.error);

//允许跨域
app.use(cors());

//配置静态资源目录
app.use(koaStatic(path.join(__dirname, './public')));

//配置模板
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

// 使用表单解析中间件
app.use(bodyParser());

app.use(response);

//加载路由
app.use(router.routes(), router.allowedMethods());

//监听端口
app.listen(3000);
console.log('the server is start at port 3000 ~');
