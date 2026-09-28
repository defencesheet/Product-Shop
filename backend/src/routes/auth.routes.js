const express = require("express");
const {
    register,
    login,
    refreshToken,
    logout,
    me
} = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");
const validateRequest = require("../middleware/validate");
const {
    registerValidator,
    loginValidator
} = require("../validators/auth.validators");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;
