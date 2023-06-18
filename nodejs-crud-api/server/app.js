import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import models,{sequelize} from './models/init-models'
import routes from './routes/allRoutes'

const port = process.env.PORT || 3300
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(async(req,res,next)=> {
    req.context = {models}
    next()
})

app.use('/user',routes.usersRoute)
app.use('/customer',routes.customersRoute)
app.use('/product',routes.productsRoute)


const dropDatabaseSync = false
sequelize.sync({force : dropDatabaseSync}).then(async()=>{
    app.listen(port,()=>{console.log(`Server is listening on port ${port}`)})
})

export default app