import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors' 
import authRoute from './routes/auth.js'
import PostRoute from './routes/posts.js'
import fileUpload from 'express-fileupload';



const app = express()
dotenv.config()
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.static('uploads'))

app.use('/auth',authRoute)
app.use('/posts',PostRoute)




const PORT = process.env.PORT || 3002
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME 



async function start(){
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.quc32yu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)

        app.listen(PORT,()=>console.log('сервер запущен'))
    }
    catch (error){
        console.log(error)
    }
}

start()