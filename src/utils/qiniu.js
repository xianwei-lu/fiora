const qiniu = require('qiniu');
const config = require('../../config/server');

const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
const putPolicy = new qiniu.rs.PutPolicy({ scope: config.bucket, expires: 60 * 60 * 24 * 30 });
const qiniuConfig = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const putExtra = new qiniu.form_up.PutExtra();

function getToken() {
    return putPolicy.uploadToken(mac);
}

let token = getToken();
// update token
setInterval(() => {
    token = getToken();
}, 1000 * 60 * 60 * 24 * 20);

function uploadFile(key, localFile) {
    return new Promise((resolve, reject) => {
        formUploader.putFile(token, key, localFile, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                reject(respErr);
            }
            if (respInfo.statusCode === 200) {
                resolve(`${config.bucketUrl}/${respBody.key}`);
            } else {
                reject({
                    code: respInfo.statusCode,
                    body: respBody,
                });
            }
        });
    });
}
function uploadBytes(key, bytes) {
    return new Promise((resolve, reject) => {
        formUploader.put(token, key, bytes, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                reject(respErr);
                return;
            }
            if (!respInfo) {
                console.log(respErr, respBody, respInfo);
                reject();
                return;
            }
            if (respInfo.statusCode === 200) {
                resolve(`${config.bucketUrl}/${respBody.key}`);
            } else {
                reject({
                    code: respInfo.statusCode,
                    body: respBody,
                });
            }
        });
    });
}

module.exports = {
    uploadFile,
    uploadBytes,
};
