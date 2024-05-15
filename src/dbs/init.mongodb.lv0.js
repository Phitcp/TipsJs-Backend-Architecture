'use strict';
const env = 'dev';
const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/shopDev';
mongoose
    .connect(connectString)
    .then((_) => console.log('Connect to mongo successfully'))
    .catch((err) =>
        console.log('Something wrong happen when connect to db', err)
    );

if (env === 'dev') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}
