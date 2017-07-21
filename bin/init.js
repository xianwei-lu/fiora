const mongoose = require('mongoose');
const bluebird = require('bluebird');
const path = require('path');
const fs = bluebird.promisifyAll(require('fs'));
const config = require('../config/server');
const Group = require('../src/server/models/group');

mongoose.Promise = Promise;

async function init() {
    await mongoose.connect(config.database);
    const group = await Group.findOne({ isDefault: true });
    if (group) {
        throw Error('default group already exists.');
    }

    const defaultGroup = await Group.create({
        name: 'fiora',
        announcement: '欢迎各位来到fiora',
        isDefault: true,
    });
    if (!defaultGroup) {
        throw Error('create default group fail.');
    }
    console.log('create default group success.');

    const tempDirectory = path.join(__dirname, '../temp/');
    if (!await fs.exists(tempDirectory)) {
        await fs.mkdir(tempDirectory);
        console.log('create temp directory success.');
    }
}

init()
.then(() => {
    process.exit(0);
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
});
