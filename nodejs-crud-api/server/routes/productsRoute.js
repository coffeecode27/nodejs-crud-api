import { Router } from "express";
import allController from "../controller/allController";

const route = Router()
route.get('/:category_id', allController.productsController.getProductsByCategory);
route.post('/order', allController.productsController.productOrder);

export default route