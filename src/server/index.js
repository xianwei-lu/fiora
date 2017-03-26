const app = require('./app');
const config = require('../../config').project;
const env = require('../utils/env');

const host = env.isDev() ? config.devServer : config.server;
const port = env.isDev() ? config.devPort : config.port;
app.listen(port, () => {
    console.log(` >>> server listen on http://${host}:${port}`);
});
