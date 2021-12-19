const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const port = process.env.PROT || 4000
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qjvlr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("booking")
        const bookinCollaction = database.collection("userBooking")
        const userCollaction = database.collection("users")


        app.get("/appointment", async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = bookinCollaction.find(query)
            const result = await cursor.toArray()
            res.send(result)


        })
        // delete apponimnet 
        app.delete("/appointment/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookinCollaction.deleteOne(query)
            res.json(result)

        })

        // appointment post api

        app.post("/appointment", async (req, res) => {
            const booking = req.body
            const result = await bookinCollaction.insertOne(booking)
            res.json(result)

        })

        // save user 
        app.post("/users", async (req, res) => {
            const saveUser = req.body
            const result = await userCollaction.insertOne(saveUser)
            res.json(result)
        })


        // seve user google
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollaction.updateOne(filter, updateDoc, options);
            res.json(result);
        })



    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Jerins plour server site')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})