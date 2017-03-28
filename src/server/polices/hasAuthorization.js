module.exports = function (ctx) {
    if (!ctx.data.header.token) {
        ctx.res(401, 'no authorization');
        return false;
    }
    return true;
};
