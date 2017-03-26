function isDev() {
    return process.env.NODE_ENV === 'development';
}
function isProd() {
    return process.env.NODE_ENV === 'production';
}
function isTest() {
    return process.env.NODE_ENV === 'test';
}
function isRN() {
    return this.window && this.window.navigator.product === 'ReactNative';
}

module.exports = {
    isDev,
    isProd,
    isTest,
    isRN,
};
