'use strict';

const KeyTokenModel = require('../models/keytoken.model');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await KeyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
