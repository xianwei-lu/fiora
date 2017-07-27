const avatar = require('avatar-generator')();
const path = require('path');
const uploadFile = require('./qiniu').uploadFile;

const avatarDir = path.join(__dirname, '../../public/data');

function generate(key, gender, size) {
    const file = path.join(avatarDir, key);
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
    const fileName = `${key}_${Date.now().toString()}.jpg`;
    const avatarFile = await generate(fileName, gender, size);
    const avatarUrl = await uploadFile(fileName, avatarFile);
    return avatarUrl;
};

