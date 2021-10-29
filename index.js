const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvih6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('tour_x');
        const packageCollection = database.collection('package');
        const orderCollection = database.collection('orders');




        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({})
            const package = await cursor.toArray();
            res.send(package)

        });
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders)

        });
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.json(package);
        })

        app.get("/orders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });
        app.get("/addnew/:newpackage", async (req, res) => {
            const result = await packageCollection.find({
                newpackage: req.params.newpackage,
            }).toArray();
            res.send(result);
        });


        app.post("/packages", async (req, res) => {
            const result = await orderCollection.insertOne(req.body);

        });
        app.post("/addpackages", async (req, res) => {
            const result = await packageCollection.insertOne(req.body);
            res.send(result);
          });

        app.delete('/orders/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result);

        })
        app.delete('/packages/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await packageCollection.deleteOne(query)
            res.json(result);

        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})