import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import { validId } from '../middlewares/global.middlewares.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.post("/create", userController.createUserController)

userRouter.use(authMiddleware)
userRouter.get("/", userController.findAllUserController)

userRouter.use(validId)
userRouter.get("/findById/:id", userController.findUserByIdController)
userRouter.patch("/update/:id", userController.updateUserController)

export default userRouter