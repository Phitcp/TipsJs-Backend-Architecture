'use strict';

const express = require('express');
const router = express.Router();

const accessRouter = require('./access');

router.use('/v1/api', accessRouter);

// router.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message:'Hello'
//     })
// });

module.exports = router;
