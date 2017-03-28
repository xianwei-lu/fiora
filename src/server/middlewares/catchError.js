module.exports = function () {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            console.log(err);
            ctx.res(500, err.toString());
        }
    };
};
