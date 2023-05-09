import dotenv from 'dotenv'
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
dotenv.config()
import { AppDataSource } from './db'
import path from 'path'
import ApiControllers from './controllers/router'

const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vm-shein.onrender.com',
]

const server = express()

server.use(cors({
    origin:(origin,cb)=>{
        if(!origin) return cb(null,true)
        if(origins.indexOf(origin)===-1){
            return cb(new Error('CORS no valido'),false)
        }
        return cb(null,true)
    },
    credentials:true
}))

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