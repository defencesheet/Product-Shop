function validationErrorResponse(errors) {
    const fields = {};

    for (const error of errors) {
        if (!fields[error.path]) {
            fields[error.path] = error.msg;
        }
    }

    return {
        message: "Validation failed",
        errors: fields
    };
}

module.exports = { validationErrorResponse };
