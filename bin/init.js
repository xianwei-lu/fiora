const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const config = require('../config/server');
const Group = require('../src/server/models/group');

mongoose.Promise = Promise;

function createDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(path);
        console.log(`create ${directoryPath} directory success`);
    } else {
        console.log(`${directoryPath} directory already exist`);
    }
}

async function init() {
    await mongoose.connect(config.database);
    const group = await Group.findOne({ isDefault: true });
    if (!group) {
        const defaultGroup = await Group.create({
            name: 'fiora',
            announcement: '欢迎各位来到fiora',
            isDefault: true,
        });
        if (!defaultGroup) {
            throw Error('create default group fail');
        }
        console.log('create default group success');
    } else {
        console.log('default group already exists');
    }

    createDirectory(path.join(__dirname, '../temp'));
    createDirectory(path.join(__dirname, '../public'));
    createDirectory(path.join(__dirname, '../public/data'));
}

init()
.then(() => {
    process.exit(0);
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
});
