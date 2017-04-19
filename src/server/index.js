const mongoose = require('mongoose');

const app = require('./app');
const config = require('../../config').project;
const env = require('../utils/env');

mongoose.Promise = Promise;

mongoose.connect(config.database, (err) => {
    if (err) {
        console.log('connect database error!');
        console.log(err);
        return process.exit(1);
    }
});

const host = env.isDev() ? config.devServer : config.server;
const port = env.isDev() ? config.devPort : config.port;
app.listen(port, () => {
    console.log(` >>> server listen on http://${host}:${port}`);
});
