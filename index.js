const express=require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
const ObjectId = require('mongodb').ObjectId
const app=express();
const port= process.env.PORT || 4000;

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
            const cursor=packageCollection.find({})
            const package= await cursor.toArray();
            res.send(package)
        
        });
        app.get('/packages/:id', async(req,res) => {
            const id =req.params.id;
            const query={_id: ObjectId(id)};
            const service= await packageCollection.findOne(query);
            res.json(service);
        })
        

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})