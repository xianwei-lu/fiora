const qiniu = require('qiniu');
const config = require('../../config/server');

qiniu.conf.ACCESS_KEY = config.accessKey;
qiniu.conf.SECRET_KEY = config.secretKey;

function getToken(bucket, key) {
    return new qiniu.rs.PutPolicy(`${bucket}:${key}`).token();
}

function uploadFile(key, localFile) {
    const extra = new qiniu.io.PutExtra();
    return new Promise((resolve, reject) => {
        qiniu.io.putFile(getToken(config.bucket, key), key, localFile, extra, (err, ret) => {
            if (err) {
                reject(err);
            } else {
                resolve(ret);
            }
        });
    });
}

module.exports = {
    getToken,
    uploadFile,
};
