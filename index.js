const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());










const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ull5nsx.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
        await client.connect();
        const carCollection = client.db('carDB').collection('car');
        const cartCollection = client.db('carDB').collection('cart');

        app.get('/cars', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query);
            res.send(result);
        })

        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const result = await carCollection.insertOne(newCar);
            res.send(result);

        })
        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCar = req.body;
            const car = {
                $set: {
                    name: updatedCar.name,
                    brand: updatedCar.brand,
                    image: updatedCar.image,
                    type: updatedCar.type,
                    price: updatedCar.price,
                    rating: updatedCar.rating,
                    description: updatedCar.description,
                }
            }

            const result = await carCollection.updateOne(filter, car, options);
            res.send(result);

        });


        app.get('/cart', async(req, res) =>{
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result); 
        });


        

        app.post('/cart', async(req, res) => {
            const MyCart = req.body;
            console.log(MyCart);
            const result = await cartCollection.insertOne(MyCart);
            res.send(result);

        } );


        app.delete('/cart/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await cartCollection.deleteOne(query);
            res.send(result);

        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('velocity autos server running ')
})

app.listen(port, () => {
    console.log(`velocity autos server is running on port ${port}`)
})
