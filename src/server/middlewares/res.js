module.exports = function () {
    return async (ctx, next) => {
        ctx.res = function (status, data) {
            ctx.resData = { status, data };
            ctx.acknowledge({ status, data });
        };
        await next();
    };
};
