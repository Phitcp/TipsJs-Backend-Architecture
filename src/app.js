const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// #region middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
// #endregion middleware

// #region db
require('./dbs/init.mongodb');
// #endregion db

// #region routes
// #endregion routes
module.exports = app;
