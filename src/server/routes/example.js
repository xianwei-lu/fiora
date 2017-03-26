const Router = require('../../core/socketRouter');

const Example = new Router({ prefix: '/example' });
Example
.get('/:id', (ctx) => {
    ctx.acknowledge({ status: 200, data: ctx.params });
});

module.exports = Example;
