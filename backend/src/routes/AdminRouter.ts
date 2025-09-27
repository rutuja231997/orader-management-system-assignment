import express from 'express';

import adminController from "../controllers/adminController";
import authMiddleware from '../middlewares/adminMiddleware';

const adminRouter = express.Router();

adminRouter.post('/signup', adminController.signUp);
adminRouter.post('/signin', adminController.signIn);
adminRouter.post("/logout", authMiddleware, adminController.logOut)

adminRouter.get('/orders', authMiddleware, adminController.allOrders);
adminRouter.get('/ordersbyfilter', authMiddleware, adminController.filterOrders);
adminRouter.get('/details/:id', adminController.getAdmin)

adminRouter.put('/edit-order/:id', authMiddleware, adminController.editOrder);

adminRouter.delete('/order/:id', authMiddleware, adminController.deleteOrder)

export default adminRouter;