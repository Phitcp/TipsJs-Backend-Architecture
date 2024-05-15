'use strict';

const env = 'dev';
const mongoose = require('mongoose');
const {
    countConnect,
    checkOverLoad,
} = require('../helpers/dbsHelpers/check.connect');
const connectString = 'mongodb://localhost:27017/shopDev';
if (env === 'dev') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

class DataBase {
    constructor(type = 'mongo') {
        this.type = type;
        this.connect();
    }
    // connect
    connect() {
        if (this.type === 'mongo') {
            if (env === 'dev') {
                mongoose.set('debug', true);
                mongoose.set('debug', { color: true });
            }

            mongoose
                .connect(connectString)
                .then((_) => {
                    console.log('Connect to mongo successfully');
                    countConnect();
                    checkOverLoad();
                })
                .catch((err) =>
                    console.log(
                        'Something wrong happen when connect to db',
                        err
                    )
                );
        }
    }

    static getInstance(dbType) {
        if (!this.instance) {
            this.instance = new DataBase(dbType);
        }
        return this.instance;
    }
}

const instanceMongoDb = DataBase.getInstance('mongo');

module.exports = instanceMongoDb;
