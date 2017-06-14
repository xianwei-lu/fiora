const pathToRegexp = require('path-to-regexp');
const isLogin = require('./isLogin');

const allApplyPolices = [

];

function createRouterMatch(method, path) {
    const regexp = pathToRegexp(path);
    return function (ctx) {
        return ctx.data.method === method && regexp.test(ctx.data.path);
    };
}

let policeConfig = [
    {
        match: createRouterMatch('POST', '/messaage'),
        polices: [isLogin],
    },
];
policeConfig = policeConfig.map((police) => {
    police.polices.push(...allApplyPolices);
    return police;
});

module.exports = policeConfig;
