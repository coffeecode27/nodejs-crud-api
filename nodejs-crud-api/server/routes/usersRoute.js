import { Router } from "express";
import allController from "../controller/allController";
import loginController from "../controller/login/loginController"

const route = Router()
route.post('/signup',allController.usersController.createUser)
route.post('/login',loginController.loginUser)


export default route