/*
*
*   @Description: Index控制器
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const ObjectId = require('mongoose').Types.ObjectId;
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
*   @Description: 根据id查找
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const getUserById = async (id) => {
    console.log(id);
    if (!ObjectId.isValid(id)) {
        return;
    }
    const result = await User.findById({_id: id});

    return result;
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
*   @Description: 渲染add页面
*   @Author: WuWangCheng
*   @Date: 2018-05-09
*
* */
const _renderUpdate = async (ctx, next) => {
    const id = ctx.query.id;
    const result = await getUserById(id);
    console.log(result);
    await ctx.render('update', {
        user: result
    });
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
    let id = ctx.request.body.id;
    let result = await User.update({_id: id}, {
        $set: {
            status: 0,
            updatedAt: new Date()
        }
    });
    if (result) {
        ctx.success({msg: "删除成功!"});
    } else {
        ctx.error({msg: "删除失败!"});
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

};


/*
*
*   @Description: 下载
*   @Author: WuWangCheng
*   @Date: 2018-05-10
*
* */

const imageMagick = require('gm').subClass({imageMagick: true, appPath: "C:\\ImageMagick-7.0.7-Q16\\"});

const _controllerDownLoad = async (ctx, next) => {
    const name = ctx.query.name;
    const file = path.join(__dirname, '../public/uploads', name);


    const _font = path.join(__dirname, '../public/static/fonts/simfang.ttf');
    const _logo = path.join(__dirname, '../public/static/images/logo.jpg');

    //let text = new Buffer('刘德华', 'utf8').toString();

    //文字水印
    await imageMagick(file)
        .fill('#000')
        .font(_font, 24)
        .drawText(50, 50, '小明', "SouthEast")
        .write(__dirname + '/public/uploads/' + name, function (err) {
            if (err) {
                return res.end('error|' + err.message);
            }
        });


    /*await imageMagick()
        .in('-page', '+0+0')
        .in(file)
        .in('-page', '+10+20') // location of smallIcon.jpg is x,y -> 10, 20
        .in(logo)
        //.resize(32, 32)
        .mosaic()
        .write(process.cwd() + '/public/new.jpg', function (err) {
            if (err) console.log(err);
        });*/

    //logo水印
    await imageMagick()
        .command("composite")
        .in("-gravity", 'SouthEast')
        .in("-geometry", '+10+10')
        .in(_logo)
        .in(file)
        .write(__dirname + '/public/uploads/' + name, function (err) {
            if (!err)
                console.log(' hooray! ');
            else
                console.log(err);
        });


    ctx.status = 200;
    ctx.set('Content-disposition', 'attachment; filename=' + name);
    ctx.set('Content-type', 'image/jpeg');
    ctx.body = fs.createReadStream(file);
};

/*
*
*   @Description: 批量下载
*   @Author: WuWangCheng
*   @Date: 2018-05-10
*
* */

const _controllerDownLoads = async (ctx, next) => {
    try {
        let names = ctx.request.body.names;
        let files = [];
        for (let i = 0; i < names.length; i++) {
            files.push({
                path: path.join(__dirname, '../public/uploads/', names[i]),
                name: names[i]
            })
        }

        let date = new Date();
        let zipname = date.getFullYear() + '' + date.getMonth() + '' + date.getDay() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();

        //延时1秒调用
        await setTimeout(async () => {
            let zipPath = path.join(__dirname, '../public/', zipname + '.zip');
            let output = fs.createWriteStream(zipPath);
            let zip = archiver('zip');
            //将打包对象与输出流关联
            zip.pipe(output);
            for (let i = 0; i < files.length; i++) {
                console.log(files[i].path);
                zip.append(fs.createReadStream(files[i].path), {'name': files[i].name});
            }
            //打包
            await zip.finalize();

        }, 1000);

        ctx.success({"msg": "success", data: ['/' + zipname + '.zip']});
    } catch (e) {
        ctx.error({msg: "图片下失败!", data: []})
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


const _controllerMeUpload = async (ctx, next) => {
    ctx.body = {
        url: "http://localhost:3000/uploads/1525850149626.jpg"
    }
}


module.exports = {
    _renderIndex,
    _renderAdd,
    _renderUpdate,
    _controllerAdd,
    _controllerDelete,
    _controllerUpdate,
    _controllerUpload,
    _controllerDownLoad,
    _controllerDownLoads,
    _controllerMeUpload
};
