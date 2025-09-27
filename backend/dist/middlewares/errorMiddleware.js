"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errors: err.details || null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.globalErrorHandler = globalErrorHandler;
