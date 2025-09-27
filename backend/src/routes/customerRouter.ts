import express from 'express';
import upload from '../middlewares/upload';

import customerController from '../controllers/customerController';

const customerRouter = express.Router();

customerRouter.post('/orders', upload.single("product_image"), customerController.createOrder );

customerRouter.get('/details/:id', customerController.getCustomer)

export default customerRouter;