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
*   @Description: 渲染index页面
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _renderIndex = async (ctx, next) => {
    const result = await User.find();
    ctx.render('index', {
        list: result
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
    ctx.render('add', {});
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
    _controllerUpload
};
