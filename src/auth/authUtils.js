'use strict';
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/errorHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
};

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
    /**
      1 - Check userId missing?
      2 - get Access token by userId
      3 - verify token
      4 - check user in db is correct
      5 - check keyStore with userId
      6 - If all is pass -> return next
     */

    // .1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError('Invalid request');
    }

    // .2
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Key store not found');
    }

    // .3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new AuthFailureError('Invalid Token');
    }
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid User');
        }
        req.keyStore = keyStore;
        return next();
    } catch (err) {
        throw err;
    }
});
module.exports = {
    createTokenPair,
    authentication,
};
