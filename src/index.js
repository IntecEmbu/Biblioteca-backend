import { config } from 'dotenv'
import express from 'express'
import routes from './routes.js'
import cors from 'cors'

config() // Load .env file

const api = express()
const port = process.env.PORT || 3333

api.use(cors())
api.use(express.json())

api.use('/', routes)

api.listen(port, () =>{
  console.log(`server is running in ${port}`)
})