import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient (process.env.DATABASE_URL);
let db


mongoClient.connect()
.then(()=>{
    db = mongoClient.db();
})

//.catch()

const PORT = process.env.PORT_SEVER
app.listen(PORT,()=>{
    console.log(`servidor rodando na porta ${PORT}`)
})