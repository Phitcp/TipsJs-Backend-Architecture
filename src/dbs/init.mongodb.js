'use strict';

const mongoose = require('mongoose');
const {
    countConnect,
    checkOverLoad,
} = require('../helpers/dbsHelpers/check.connect');

const config = require('../config/config.mongo');
const { db } = config;
const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;

const connectToMongo = () => {
    if (process.env.ENV === 'dev') {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true });
    }

    mongoose
        .connect(connectString)
        .then((_) => {
            console.log('Connect to mongo successfully, key', connectString);
            countConnect();
        })
        .catch((err) =>
            console.log('Something wrong happen when connect to db', err)
        );
};

const connecter = {
    mongo: connectToMongo,
};
class DataBase {
    constructor(type = 'mongo') {
        this.type = type;
        this.connect();
    }
    // connect
    connect() {
        connecter[this.type]();
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
