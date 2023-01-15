import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dayjs from 'dayjs'
import joi from 'joi'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db

mongoClient.connect()
    .then(() => {
        db = mongoClient.db()
    })

app.get("/participants", async (req, res) => {

    try {
        const participants = await db.collection("participants").find().toArray();
        res.send(participants);

    } catch (err) { return res.status(500).send(err.message) }
})

app.get("/messages", async (req, res) => {
    const { user } = req.headers
    const limit = Number(req.query.limit)

    try {
        const messages = await db.collection("messages").find({
            $or:
                [
                    { to: user, type: "private_message" },
                    { type: "message" },
                    { type: "status" },
                    {from:user}
                ]
        }).sort({time:-1}).limit(limit).toArray();

        res.send(messages);

    } catch (err) { return res.status(500).send(err.message) }
})

app.post("/participants", async (req, res) => {
    const { name } = req.body;

    const nameSchema = joi.object({
        name: joi.string().required()
    })

    try {

        const validation = nameSchema.validate({ name }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }

        const user = await db.collection('participants').findOne({ name: name })
        if (user) { return res.status(409).send("usuario já existe na sala") }

        await db.collection("participants").insertOne({
            name: name,
            lastStatus: Date.now()
        })

        await db.collection("messages").insertOne({
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })

        return res.sendStatus(201)
    } catch (err) { return res.status(500).send(err.message) }
});

app.post("/messages", async (req, res) => {
    const { to, text, type } = req.body
    const { user } = req.headers

    const messageSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: joi.string().valid("message", "private_message").required(),
        user: joi.required()
    })
    try {

        const validation = messageSchema.validate({ to, text, type, user }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }

        const user1 = await db.collection('participants').findOne({ user: user.user })
        console.log(user1)
        if (!user1) { return res.status(422).send("usuario não cadastrado") }

        await db.collection("messages").insertOne({
            from: user,
            to: to,
            text: text,
            type: type,
            time: dayjs().format('HH:mm:ss')
        })

        return res.sendStatus(201)
    } catch (err) { return res.status(500).send(err.message) }
});

const PORT = process.env.PORT_SERVER
app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`)
})