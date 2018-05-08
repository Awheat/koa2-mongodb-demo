const router = require('koa-router')();

//跳转首页
router.get('/', async (ctx, next) => {
    const msg = 'Hello World...';
    await ctx.render('index', {
        msg
    });
});


module.exports = router;
