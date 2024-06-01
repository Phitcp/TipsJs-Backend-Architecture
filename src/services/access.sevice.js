'use strict';
const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const saltRound = 10;
const SHOP_ROLE = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
    static signUp = async ({ name, email, password }) => {
        // Check email exist
        const shopHolder = await shopModel.findOne({ email }).lean();

        if (shopHolder) {
            throw new BadRequestError('Error: Shop has already be registered');
        }
        // hash password: prevent database leaking or db injection
        const passwordHash = await bcrypt.hash(password, saltRound);

        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            role: [SHOP_ROLE.SHOP],
        });

        if (newShop) {
            // create privateKey, publicKey to create token
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            // create token for user
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            });

            if (!keyStore) {
                throw new BadRequestError('Error: Key store error');
            }

            // create token pair
            const tokens = await createTokenPair({
                payload: {
                    userId: newShop._id,
                    email,
                },
                publicKey,
                privateKey,
            });
            console.log('Create token success:::', tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        } else {
            return {
                code: 200,
                metadata: null,
            };
        }
    };
    static login = async ({ email, password, refreshToken = null }) => {
        /**
    1 - Check email
    2 - match password
    3 - Create Access Token and Refresh Token and save to db
    4 - generate tokens
    5 - get data return for login
     */
        // .1
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Can not find any shop');
        }
        // .2
        const matchPassword = await bcrypt.compare(
            password,
            foundShop?.password
        );
        if (!matchPassword) {
            throw new AuthFailureError('Authentication error');
        }

        // .3
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // .4
        const userId = foundShop._id;
        const tokens = await createTokenPair({
            payload: {
                userId,
                email,
            },
            publicKey,
            privateKey,
        });

        await KeyTokenService.createKeyToken({
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
            userId,
        });
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens,
        };
    };
    static logout = async ({ keyStore }) => {
        return await KeyTokenService.removeKeyById(keyStore._id);
    };
}

module.exports = AccessService;
