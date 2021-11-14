const express = require('express')
const app = express()

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 7000;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njfp6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('royal_motors');
        // const servicesCollection = client.db("royalMotors").collection("services");
        const carCollection = database.collection('car');

        const reviewCollection = database.collection('reviews');
        app.post('/addServices', async (req, res) => {
            const carDetails = req.body;
            const result = await carCollection.insertOne(carDetails);
            res.json(result)
        });
        // get all services
        app.get("/allServices", async (req, res) => {
            const result = await carCollection.find({}).toArray();
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})