const Koa = require('koa');
const Json = require('koa-json');
const Logger = require('koa-logger');
const IO = require('koa-socket');
const applyRoutes = require('./routes');

const app = new Koa();
const io = new IO();

app.use(Logger());
app.use(Json());
applyRoutes(app);

io.attach(app);
io.use(async (ctx, next) => {
    console.log('before next');
    await next();
    console.log('end next');
});

app.io.on('connection', (ctx) => {
    console.log('连接成功', ctx.socket.id);
});
app.io.on('disconnect', (ctx) => {
    console.log('连接断开', ctx.socket.id);
});
app.io.on('message', (ctx, data) => {
    console.log('receive message', data);
    ctx.acknowledge({ status: 200, content: 'welcome friends!' });
});

app.use(async (ctx) => {
    ctx.body = 'welcome friends!';
});

module.exports = app;
