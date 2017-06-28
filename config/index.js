const path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        cssSourceMap: false,
    },
    project: {
        // release config.
        // you can use domain name, ip address or localhost.
        server: 'suisuijiang.com',
        port: 10615,

        // local dev config
        devServer: 'localhost',
        devPort: 9200,

        // database url and name
        database: 'database_name',
        testDatabase: 'test_database_name',

        // jwt encryption secret
        jwtSecret: 'jwt_token_secret',

        // qiniu CDN config.
        // this is not necessary. if you not modify this config. image will save to local disk.
        accessKey: 'qiniu_access_key',
        secretKey: 'qiniu_secret_key',
        bucket: 'bucket_name',
        bucketUrl: 'bucket_outside_url',

        // max message lenght. for both backend and frontend
        maxMessageLength: 1024,

        // max group number
        maxGroupNumber: 2,

        // default group avatar
        defaultGroupAvatar: 'https://assets.suisuijiang.com/group_avatar_default.jpeg',
    },
};
