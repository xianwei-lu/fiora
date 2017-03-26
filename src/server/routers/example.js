const Router = require('koa-router');

const Example = new Router({ prefix: '/example' });
Example
.get('/', (ctx) => {
    ctx.body = 'GET /example';
})
.post('/', (ctx) => {
    ctx.status = 201;
    ctx.body = 'POST /example';
});

module.exports = Example;
