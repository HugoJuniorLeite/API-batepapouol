import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dayjs from 'dayjs'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient (process.env.DATABASE_URL)
let db


mongoClient.connect()
.then(()=>{
    db = mongoClient.db()
})


app.post("/participants",async (req, res) => {
    const {name} = req.body;
    
    try{
   //     const user = await db.collection('participants').findOne({name:name}) 
     //   if(user){return res.status(422).send("usuario já existe na sala")}

        if(!name) return  res.status(422).send("O campo nome é obrigatorio")
    
 await	db.collection("/participants").insertOne({
		name: name,
		lastStatus: Date.now()
	})
    
    return res.sendStatus(201)
	} catch(err){return res.status(500).send(err.message)}
});


const PORT = process.env.PORT_SEVER
app.listen(PORT,()=>{
    console.log(`servidor rodando na porta ${PORT}`)
})