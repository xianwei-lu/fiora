const mongoose = require('mongoose');
const config = require('../config/index');
const Group = require('../src/server/models/group');

mongoose.Promise = Promise;
mongoose.connect(config.project.database, async (err) => {
    if (err) {
        console.log('connect database error!');
        console.log(err);
        return process.exit(1);
    }

    const group = await Group.findOne({ isDefault: true });
    if (group) {
        console.log('default group already exists.');
        return process.exit(0);
    }

    const defaultGroup = await Group.create({
        name: 'fiora',
        announcement: '欢迎各位来到fiora',
        isDefault: true,
    });
    if (!defaultGroup) {
        console.log('create default group fail');
        return process.exit(1);
    }
    console.log('create default group success');
});
