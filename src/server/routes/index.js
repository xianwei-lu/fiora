const routers = require('require-dir')();

module.exports = (io) => {
    for (const route of Object.keys(routers)) {
        io.use(routers[route].routes());
    }
};
