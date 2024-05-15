'use strict';
const mongoose = require('mongoose');
const os = require('os');
const _SECONDS = 5;
const countConnect = () => {
    const numbConnection = mongoose.connections.length;
    console.log('Number of connections::', numbConnection);
    return numbConnection;
};

// check over load connect

const checkOverLoad = () => {
    setInterval(() => {
        const numbConnection = countConnect();
        const numbCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numbCore * 5;
        console.log(`active connection: ${numbConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        if (numbConnection > maxConnections) {
            console.log('Server overloaded');
        }
    }, _SECONDS * 1000);
};
module.exports = {
    countConnect,
    checkOverLoad,
};
