// errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Convert duplicate key error (11000) to 409 Conflict
    if (err.code === 11000) {
        err.statusCode = 409;
        err.message =
            "User with the provided email or username already exists.";
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;
