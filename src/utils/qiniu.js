const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');
const config = require('../../config/server');

const useQiniu = config.accessKey !== 'qiniu_access_key' && config.secretKey !== 'qiniu_secret_key';
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
        if (useQiniu) {
            formUploader.putFile(token, key, localFile, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
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
        } else {
            if (/public\/data/.test(localFile)) {
                resolve(`/data/${key}`);
                return;
            }
            fs.rename(localFile, path.resolve(__dirname, `../../public/data/${key}`), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(`/data/${key}`);
            });
        }
    });
}
function uploadBytes(key, bytes) {
    return new Promise((resolve, reject) => {
        if (useQiniu) {
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
        } else {
            const data = new Buffer(new Uint8Array(bytes));
            fs.writeFile(path.resolve(__dirname, `../../public/data/${key}`), data, 'binary', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(`/data/${key}`);
            });
        }
    });
}

module.exports = {
    uploadFile,
    uploadBytes,
};
