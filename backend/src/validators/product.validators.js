const { body, param, query } = require("express-validator");
const mongoose = require("mongoose");

const objectIdValidator = (field = "id") =>
    param(field)
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid product id");

const productBodyValidators = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Product name must be between 2 and 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 5, max: 1000 })
        .withMessage("Description must be between 5 and 1000 characters"),

    body("price")
        .exists()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a number greater than or equal to 0")
        .toFloat(),

    body("stock")
        .exists()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
        .toInt(),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Category must be between 2 and 50 characters"),

    body("image")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Image must be a valid URL")
];

const createProductValidator = productBodyValidators;

const updateProductValidator = [
    objectIdValidator(),
    ...productBodyValidators
];

const idValidator = [objectIdValidator()];

const listProductValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
        .toInt()
];

module.exports = {
    createProductValidator,
    updateProductValidator,
    idValidator,
    listProductValidator
};
