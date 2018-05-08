/*
*
*   @Description: User-Controller
*   @Author: WuWangCheng
*   @Date: 2018-04-25
*
* */


//获取用户列表
const getUsers = async (ctx, next) => {
    ctx.body = "获取所有用户...";
};

module.exports = {
    getUsers
};
