const jwt = require('jwt-simple');
const config = require('../../../config/index').project;
const assert = require('../../utils/assert');

module.exports = function (ctx) {
    if (!ctx.socket.token) {
        ctx.res(401, 'no authorization token');
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

    assert(payload.expires < Date.now(), 403, 'token expires over');
    ctx.user = payload.userId;

    return true;
};
