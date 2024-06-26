'use strict';
const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const saltRound = 10;
const SHOP_ROLE = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Check email exist
            const shopHolder = await shopModel.findOne({ email }).lean();

            if (shopHolder) {
                return {
                    code: '123',
                    message:
                        'Shop has already been created, please create another',
                };
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
                // create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    'rsa',
                    {
                        modulusLength: 4096,
                        publicKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem',
                        },
                        privateKeyEncoding: {
                            type: 'pkcs1',
                            format: 'pem',
                        },
                    }
                );

                // save public key to db
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                });

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error',
                    };
                }
                console.log('publicKeyString', publicKeyString);

                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                console.log('publicKeyObject', publicKeyObject);
                // create token pair for user
                const tokens = await createTokenPair({
                    payload: {
                        userId: newShop._id,
                        email,
                    },
                    publicKey: publicKeyObject,
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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            };
        }
    };
}

module.exports = AccessService;
