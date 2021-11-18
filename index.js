const express = require('express')
const app = express()

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 7000;
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
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
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const staffCollection = database.collection("staff");

        const reviewCollection = database.collection('reviews');
        //user collection

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        // app.put('/users/admin', async (req, res) => {
        //     const email = req.params.email;
        //     const user = await usersCollection.findOneAndUpdate({ email: email }, {
        //         $set: {
        //             role: "admin",
        //         }
        //     })
        //     console.log(user);
        //     res.json(user);
        // });
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            console.log(user, "put");
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        });

        app.post('/addServices', async (req, res) => {
            const carDetails = req.body;
            const result = await carCollection.insertOne(carDetails);
            res.json(result)
        });
        //addstaff 
        app.post('/addstaff', async (req, res) => {
            const staffDetails = req.body;
            const result = await staffCollection.insertOne(staffDetails);
            res.json(result)
        });
        // get all staff
        app.get("/allstaff", async (req, res) => {
            const result = await staffCollection.find({}).toArray();
            res.send(result);
        });
        // get all services
        app.get("/allServices", async (req, res) => {
            const result = await carCollection.find({}).toArray();
            res.send(result);
        });
        // single service
        app.get("/singleService/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await carCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
            console.log(result);
        });
        // insert order and

        app.post("/addOrders", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });
        //  my order

        app.get("/myOrder/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        app.post("/addUserInfo", async (req, res) => {
            console.log("req.body");
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        });
        // review
        app.post("/addSReview", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
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