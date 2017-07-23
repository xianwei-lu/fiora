module.exports = {
    // service port
    // 服务端端口号
    port: 9200,

    // mongodb config
    // mongodb数据库配置
    database: 'localhost:27017/fiora',

    // jwt encryption secret
    // jwt加密密钥
    jwtSecret: '$2a$10$2PcdOiDdZZVK4g80kei.Fiora',

    // qiniu CDN config.
    // 七牛CDN配置
    // optional, and if you do not have the configuration, the file will be saved on the local disk
    // 选填, 如果你没有配置, 文件会保存在本地磁盘上
    accessKey: 'buwVgnvm96NuWhRSFXj8AgtWcGyhQqCOze64-QaQ',
    secretKey: '0pe_6YeIhjCDVzWDvvWt-UZm24C7Op_wBXUc_-68',
    bucket: 'fiora-user-data',
    bucketUrl: 'cdn.suisuijiang.com',

    // maximum message length
    // 消息最大长度
    maxMessageLength: 1024,

    // maximum number of groups that can be created by each user
    // 每个用户最多可以创建的群组个数
    maxGroupNumber: 2,

    // default group avatar url
    // 默认群组头像链接
    defaultGroupAvatar: 'https://assets.suisuijiang.com/group_avatar_default.jpeg',
};
