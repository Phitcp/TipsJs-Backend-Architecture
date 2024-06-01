'use strict';

const KeyTokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            const filter = { user: userId };
            const update = {
                privateKey,
                publicKey,
                refreshToken,
            };
            const options = {
                upsert: true,
                new: true,
            };
            const tokens = await KeyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        return await KeyTokenModel.findOne({
            user: new Types.ObjectId(userId),
        }).lean();
    };

    static removeKeyById = async (keyId) => {
        return await KeyTokenModel.deleteOne({
            _id: new Types.ObjectId(keyId),
        });
    };
}

module.exports = KeyTokenService;
