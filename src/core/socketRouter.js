const pathToRegexp = require('path-to-regexp');

const defaultOpt = {
    prefix: '',
};

class SocketRouter {
    constructor(opt = defaultOpt) {
        this.registerRoutes = [];
        this.prefix = opt.prefix;
    }
    get(path, cb) {
        const regexp = pathToRegexp(this.prefix + path);
        this.registerRoutes.push({
            method: 'GET',
            regexp,
            cb,
        });
    }
    routes() {
        return async (ctx) => {
            for (const route of this.registerRoutes) {
                // 连接关闭消息
                if (ctx.data === 'transport close') {
                    return;
                }
                // 判断路由匹配
                const matchResult = route.regexp.exec(ctx.data.path);
                if (route.method === ctx.data.method.toUpperCase() && matchResult) {
                    const pathParams = {};
                    for (let i = 0; i < route.regexp.keys.length; i++) {
                        pathParams[route.regexp.keys[i].name] = matchResult[i + 1];
                    }
                    ctx.params = Object.assign(pathParams, ctx.data.params);

                    route.cb(ctx);
                }
            }
        };
    }
}

module.exports = SocketRouter;
