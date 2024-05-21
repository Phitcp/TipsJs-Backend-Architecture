'use strict';
const JWT = require('jsonwebtoken');
const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });
        // verify token of user whenever user access a service
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('err verify:::', err);
            } else {
                console.log('Decode:::', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};

module.exports = {
    createTokenPair,
};
