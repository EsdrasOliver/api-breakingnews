import express from 'express'
import connectDatabase from './src/database/db.js'
import cors from 'cors'
import 'dotenv/config'
import router from './src/routes/index.js'

/* import userRoute from './src/routes/user.route.js'
import authRoute from './src/routes/auth.route.js'
import newsRoute from './src/routes/news.route.js'
import swaggerRoute from './src/routes/swagger.route.js' */

/* const port = process.env.PORT || 3001 */
const app = express()

connectDatabase()
app.use(cors())
app.use(express.json())
app.use(router)


export default app

/* app.listen(port, () => console.log(`Server open in port ${port}.`)) */