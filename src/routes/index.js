'use strict';

const express = require('express');
const router = express.Router();
const { apiKey, checkPermission } = require('../auth/checkAuth');
const accessRouter = require('./access');

// check apiKey
// router.use(apiKey);
// check permissions
// router.use(checkPermission('0000'));

router.use('/v1/api', accessRouter);

module.exports = router;
