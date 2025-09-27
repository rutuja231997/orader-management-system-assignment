"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const adminRouter = express_1.default.Router();
adminRouter.post('/signup', adminController_1.default.signUp);
adminRouter.post('/signin', adminController_1.default.signIn);
adminRouter.post("/logout", adminMiddleware_1.default, adminController_1.default.logOut);
adminRouter.get('/orders', adminMiddleware_1.default, adminController_1.default.allOrders);
adminRouter.get('/ordersbyfilter', adminMiddleware_1.default, adminController_1.default.filterOrders);
adminRouter.get('/details/:id', adminController_1.default.getAdmin);
adminRouter.put('/edit-order/:id', adminMiddleware_1.default, adminController_1.default.editOrder);
adminRouter.delete('/order/:id', adminMiddleware_1.default, adminController_1.default.deleteOrder);
exports.default = adminRouter;
