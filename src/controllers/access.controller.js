const AccessService = require('../services/access.sevice');
const { CREATED, SuccessResponse } = require('../core/success.response');
class AccessController {
    signUp = async (req, res, next) => {
        const payload = req.body;
        console.log(`[P]::signUp::`, payload);
        const result = await AccessService.signUp(payload);
        new CREATED({
            message: 'Register successfully',
            metadata: result,
            options: {
                limit: 10,
            },
        }).send(res);
    };
    login = async (req, res, next) => {
        const loginResult = await AccessService.login(req.body);
        new SuccessResponse({
            metadata: loginResult,
        }).send(res);
    };

    logout = async (req, res, next) => {
        const result = await AccessService.logout({ keyStore: req.keyStore });
        return new SuccessResponse({
            message: 'Log out successfully',
            metadata: result,
        }).send(res);
    };
}

module.exports = new AccessController();
