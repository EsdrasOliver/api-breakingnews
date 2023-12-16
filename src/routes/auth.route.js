/* import { Router } from 'express'
const router = Router()

import { login } from '../controllers/auth.controller.js'

router.post('/', login)

export default router */

import authController from "../controllers/auth.controller.js";

import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", authController.loginController);

export default authRouter;