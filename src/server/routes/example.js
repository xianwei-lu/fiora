const Router = require('../../core/socketRouter');

const Example = new Router({ prefix: '/example' });
Example
.get('/:id', (ctx) => {
    ctx.res(200, ctx.params);
})
.post('/:name', (ctx) => {
    ctx.res(300, 'hehe');
})
.delete('/', (ctx) => {
    ctx.res(204);
});

module.exports = Example;
