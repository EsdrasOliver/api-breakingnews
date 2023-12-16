import express from 'express'
import connectDatabase from './src/database/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import userRoute from './src/routes/user.route.js'
import authRoute from './src/routes/auth.route.js'
import newsRoute from './src/routes/post.route.js'
import swaggerRoute from './src/routes/swagger.route.js'

const port = process.env.PORT || 3001
const app = express()

connectDatabase()
app.use(cors())
app.use(express.json())
app.use("/user", userRoute)
app.use("/auth", authRoute)
app.use("/news", newsRoute)
app.use("/doc", swaggerRoute)

app.listen(port, () => console.log(`Server open in port ${port}.`))