"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const customerController_1 = __importDefault(require("../controllers/customerController"));
const customerRouter = express_1.default.Router();
customerRouter.post('/orders', upload_1.default.single("product_image"), customerController_1.default.createOrder);
customerRouter.get('/details/:id', customerController_1.default.getCustomer);
exports.default = customerRouter;
