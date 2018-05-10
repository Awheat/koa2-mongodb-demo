/*
*
*   @Description: 路由
*   @Author: WuWangCheng
*   @Date: 2018-05-08
*
* */
const router = require('koa-router')();


/*
*
* 上传图像storage配置
*
* */
const multer = require('koa-multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//加载配置
let upload = multer({storage: storage});

/*
*
* 控制器
*
* */
const index = require('../controllers/index');


/*
*
*
* 路由
*
* */

//render
router.get('/', index._renderIndex);
router.get('/add', index._renderAdd);
router.get('/update', index._renderUpdate);

//controller
router.post('/controller/add', index._controllerAdd);
router.post('/controller/delete', index._controllerDelete);
router.get('/controller/update', index._controllerUpdate);
router.post('/controller/upload', upload.single("file"), index._controllerUpload);
router.get('/controller/download', index._controllerDownLoad);
router.post('/controller/downloads', index._controllerDownLoads);


module.exports = router;
