module.exports = function (io, _io) {
    return async (ctx, next) => {
        ctx.res = function (status, data) {
            ctx.resData = { status, data };
            ctx.acknowledge({ status, data });
        };
        ctx.clients = function () {
            return Object.keys(_io.sockets.sockets);
        };
        await next();
    };
};
