const AccessService = require('../sevices/access.sevice');

class AccessController {
    signUp = async (req, res, next) => {
        try {
            const payload = req.body;
            console.log(`[P]::signUp::`, payload);
            const result = await AccessService.signUp(payload);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessController();
