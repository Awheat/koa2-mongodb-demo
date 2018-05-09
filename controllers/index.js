/*
*
*   @Description: Index控制器
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */

//实体
const User = require('../models/user');

/*
*
*   @Description: 获取列表根据分页
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */

const getListByPage = async (index = 1) => {
    let pageIndex = index;
    let pageSize = 5;

    const count = await User.count({"status": 1});
    const result = await User.find({"status": 1}).sort({"createdAt": -1}).limit(Number(pageSize)).skip((Number(pageIndex) - 1) * pageSize);
    const total = Math.ceil(count / pageSize);
    return {
        total: total,
        list: result
    }
};


/*
*
*   @Description: 渲染index页面
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _renderIndex = async (ctx, next) => {
    const index = ctx.query.page || 1;
    const result = await getListByPage(index);
    console.log(result);
    await ctx.render('index', {
        total: result.total,
        list: result.list
    });
};

/*
*
*   @Description: 渲染add页面
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _renderAdd = async (ctx, next) => {
    await ctx.render('add', {});
};


/*
*
*   @Description: 添加用户
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _controllerAdd = async (ctx, next) => {
    const params = ctx.request.body;
    //类型转换
    params.gender = parseInt(params.gender);
    //保存
    const result = await new User(params).save();

    if (result) {
        ctx.redirect('/');
    } else {
        ctx.error({msg: "添加失败!"});
    }
};

/*
*
*   @Description: 删除
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _controllerDelete = async (ctx, next) => {
    const res = ctx.req.file.filename;
    console.log(res);
    if (res) {
        ctx.success({
            msg: "上传成功!",
            data: [res]
        })
    }
};

/*
*
*   @Description: 更新
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _controllerUpdate = async (ctx, next) => {
    const res = ctx.req.file.filename;
    console.log(res);
    if (res) {
        ctx.success({
            msg: "上传成功!",
            data: [res]
        })
    }
};

/*
*
*   @Description: 获取列表
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _controllerList = async (ctx, next) => {
    let pageIndex = ctx.request.body.index || 1;
    console.log(pageIndex);
    const result = await getListByPage(pageIndex);
    console.log(result);
    ctx.success({
        msg: "success",
        data: {
            total: result.total,
            list: result.list
        }
    });
};


/*
*
*   @Description: 上传图像
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _controllerUpload = async (ctx, next) => {
    const res = ctx.req.file.filename;
    console.log(res);
    if (res) {
        ctx.success({
            msg: "上传成功!",
            data: [res]
        })
    }
};


module.exports = {
    _renderIndex,
    _renderAdd,
    _controllerAdd,
    _controllerDelete,
    _controllerUpdate,
    _controllerList,
    _controllerUpload
};
