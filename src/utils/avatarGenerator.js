const avatar = require('avatar-generator')();
const path = require('path');
const uploadFile = require('./qiniu').uploadFile;

const tempDir = path.join(__dirname, '../../temp');

function generate(key, gender, size) {
    const file = path.join(tempDir, key);
    return new Promise((resolve, reject) => {
        avatar(key, gender, size)
        .write(file, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(file);
        });
    });
}

module.exports = async (key, gender, size = 64) => {
    const avatarFile = await generate(`${key}.jpg`, gender, size);
    const avatarUrl = await uploadFile(`user_default_avatar_${Date.now().toString()}.jpg`, avatarFile);
    return avatarUrl;
};

