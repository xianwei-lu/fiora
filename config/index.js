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
        database: 'localhost:27017/fiora',
        testDatabase: 'localhost:27017/fiora-new-test',

        // jwt encryption secret
        jwtSecret: '$2a$10$2PcdOiDdZZVK4g80kei.Fiora',

        // qiniu CDN config.
        // this is not necessary. if you not modify this config. image will save to local disk.
        accessKey: 'buwVgnvm96NuWhRSFXj8AgtWcGyhQqCOze64-QaQ',
        secretKey: '0pe_6YeIhjCDVzWDvvWt-UZm24C7Op_wBXUc_-68',
        bucket: 'fiora-user-data',
        bucketUrl: 'cdn.suisuijiang.com',

        // max message lenght. for both backend and frontend
        maxMessageLength: 1024,

        // default group avatar
        defaultGroupAvatar: 'https://assets.suisuijiang.com/group_avatar_default.jpeg',
    },
};
