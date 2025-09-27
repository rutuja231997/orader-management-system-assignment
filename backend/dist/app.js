"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AdminRouter_1 = __importDefault(require("./routes/AdminRouter"));
const customerRouter_1 = __importDefault(require("./routes/customerRouter"));
const AppError_1 = require("./utils/AppError");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const app = (0, express_1.default)();
const allowedOrigins = ["http://localhost:3000"];
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
//routers
app.use("/api/v1/admin", AdminRouter_1.default);
app.use("/api/v1/customer", customerRouter_1.default);
//handle unknown routes (404)
app.use((req, res, next) => {
    next(new AppError_1.AppError(`can't find ${req.originalUrl} on this server`, 404));
});
//Global error handle Last
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
