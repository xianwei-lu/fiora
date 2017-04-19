const Koa = require('koa');
const IO = require('koa-socket');
const applyRoutes = require('./routes');
const addMethods = require('./middlewares/addMethods');
const log = require('./middlewares/log');
const close = require('./middlewares/close');
const notFound = require('./middlewares/notFound');
const police = require('./middlewares/police');
const catchError = require('./middlewares/catchError');

const policeConfig = require('./polices/index');

const app = new Koa();
const io = new IO();

// 注入应用
io.attach(app);

app._io.set('heartbeat interval', 60000);
app._io.set('heartbeat timeout', 5000);

// 中间件
io.use(close());
io.use(log());
io.use(catchError());
io.use(addMethods(io, app._io));
io.use(police(policeConfig));

// 注册路由
applyRoutes(io);

// 必须放在路由后面
io.use(notFound());

app.io.on('connection', () => {
    // console.log('连接成功', ctx.socket.id);
});
app.io.on('disconnect', () => {
    // console.log('连接断开', ctx.socket.id);
});
app.io.on('message', () => {

}); // 不能去掉

app.use(async (ctx) => {
    ctx.body = 'welcome friends!';
});

module.exports = app;
