import { Router } from "express";
import allController from "../controller/allController";
import {authenticateUser} from "../../auth/auth.js"

const route = Router()
route.post('/create',allController.customersController.createCustomer);
route.get('/account',authenticateUser,allController.customersController.getCustomerAccount);
route.get('/order', authenticateUser, allController.customersController.getCustomerOrders);

export default route