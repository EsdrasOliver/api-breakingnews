import { Router } from "express"
import userRouter from "./user.route.js"
import authRouter from "./auth.route.js"
import newsRoute from "./post.route.js"
import swaggerRoute from "./swagger.route.js"

const router = Router()

router.use("/user", userRouter)
router.use("/auth", authRouter)
router.use("/news", newsRoute)
router.use("/doc", swaggerRoute)

export default router