function isDev() {
    return process.env.NODE_ENV === 'development';
}
function isProd() {
    return process.env.NODE_ENV === 'production';
}
function isTest() {
    return process.env.NODE_ENV === 'test';
}

module.exports = {
    isDev,
    isProd,
    isTest,
};
