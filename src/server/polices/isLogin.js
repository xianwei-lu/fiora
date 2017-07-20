const jwt = require('jwt-simple');
const config = require('../../../config/server');
const assert = require('../../utils/assert');

module.exports = function (ctx) {
    if (!ctx.socket.token) {
        ctx.res(401, '你没有登录');
        return false;
    }

    let payload = null;
    try {
        payload = jwt.decode(ctx.socket.token, config.jwtSecret);
    } catch (err) {
        if (err.message === 'Signature verification failed') {
            ctx.res(401, 'invalid token');
            return false;
        }
        ctx.res(500, 'server error when run police isLogin');
        return false;
    }

    assert(payload.expires < Date.now(), 403, 'token过期了');
    ctx.user = payload.userId;

    return true;
};
