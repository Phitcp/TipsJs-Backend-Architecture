'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/errorHandler');
const accessController = require('../../controllers/access.controller');
const { authentication } = require('../../auth/authUtils');
// singUp
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication (make sure correct user)

router.use(authentication);
// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
