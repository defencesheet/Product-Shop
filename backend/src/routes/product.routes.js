const express = require("express");
const authenticate = require("../middleware/authenticate");
const validateRequest = require("../middleware/validate");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/product.controller");
const {
    createProductValidator,
    updateProductValidator,
    idValidator,
    listProductValidator
} = require("../validators/product.validators");

const router = express.Router();

router.post(
    "/",
    authenticate,
    createProductValidator,
    validateRequest,
    createProduct
);

router.get(
    "/",
    listProductValidator,
    validateRequest,
    getProducts
);

router.get(
    "/:id",
    idValidator,
    validateRequest,
    getProductById
);

router.put(
    "/:id",
    authenticate,
    updateProductValidator,
    validateRequest,
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    idValidator,
    validateRequest,
    deleteProduct
);

module.exports = router;
