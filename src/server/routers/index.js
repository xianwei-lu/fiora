const routers = require('require-dir')();

module.exports = (app) => {
    for (const route of Object.keys(routers)) {
        app.use(routers[route].routes());
        app.use(routers[route].allowedMethods());
    }
};
