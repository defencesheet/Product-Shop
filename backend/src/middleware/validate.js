const { validationResult } = require("express-validator");
const { validationErrorResponse } = require("../utils/response");

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(validationErrorResponse(errors.array()));
    }

    next();
}

module.exports = validateRequest;
