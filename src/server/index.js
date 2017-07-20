const mongoose = require('mongoose');

const app = require('./app');
const config = require('../../config/server');

const Socket = require('./models/socket');

mongoose.Promise = Promise;

mongoose.connect(config.database, (err) => {
    if (err) {
        console.log('connect database error!');
        console.log(err);
        return process.exit(1);
    }
});

app.listen(config.port, async () => {
    await Socket.remove({});
    console.log(` >>> server listen on http://localhost:${config.port}`);
});
