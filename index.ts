import dotenv from 'dotenv'
import 'reflect-metadata'
import express from 'express'
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
dotenv.config()
import { AppDataSource } from './db'
import path from 'path'
import ApiControllers from './controllers/router'



const server = express()

server.use(express.json())

server.use(express.static('app'))
server.get('/',(req,res)=>{
    return res.sendFile(path.join(__dirname,'app','index.html'))
})
server.use('/api',ApiControllers)

server.listen(+process.env.PORT!,()=>{
    AppDataSource.initialize().then(()=>{
        console.log('DATABASE OPEN')
        console.log('SERVER RUNNING IN PORT ',process.env.PORT)
    })
})