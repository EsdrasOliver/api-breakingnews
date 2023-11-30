import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import { validUser, validId } from '../middlewares/global.middlewares.js'

const route = Router()

route.post("/", userController.create)
route.get("/", userController.findAllUser)
route.get("/:id", validId, validUser, userController.findById)
route.patch("/:id", validId, validUser, userController.update)

export default route