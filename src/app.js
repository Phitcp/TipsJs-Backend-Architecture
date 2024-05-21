require('dotenv').config();
const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const router = require('./routes');
// #region middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// #endregion middleware

// #region db
require('./dbs/init.mongodb');
// #endregion db

// #region routes
app.use('/', router);
// #endregion routes
module.exports = app;
