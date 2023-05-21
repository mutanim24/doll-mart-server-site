const express = require('express');
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.z12trsh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const dollsCollection = client.db("dollMart").collection("products");

        // find all products
        app.get('/products', async (req, res) => {
            const result = await dollsCollection.find().toArray();
            res.send(result);
        })

        // find single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await dollsCollection.findOne(query);
            res.send(result);
        });


        // get my-toys
        app.get('/my-toys', async (req, res) => {
            let query = {}; 
            if (req.query?.email) {
                query = { "seller.email": req.query.email }
            }
            const result = await dollsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await dollsCollection.findOne(query);
            res.send(result);
        })


        app.post('/add-product', async (req, res) => {
            const body = req.body;
            const result = await dollsCollection.insertOne(body);
            res.send(result)
        })

        app.put('/update/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const option = {upsert: true};
            const updatedData = req.body;
            const updateDoc = {
                $set: {
                    name: updatedData.name,
                    img: updatedData.img,
                    price: updatedData.price,
                    quantity: updatedData.quantity,
                    description: updatedData.description
                }
            }
            const result = await dollsCollection.updateOne(filter, updateDoc, option);
            res.send(result)
        })

        app.delete('/my-toys/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await dollsCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("doll mart is running")
})


app.listen(port, () => {
    console.log(`port is running on ${port}`)
})