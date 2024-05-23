'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../core/errorHandler');
const accessController = require('../../controllers/access.controller');
//singUp
router.post('/shop/signup', asyncHandler(accessController.signUp));

module.exports = router;
