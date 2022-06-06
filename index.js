const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000



// middleware
app.use(express.json());
app.use(cors());

// Connect with MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcspy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
          await client.connect();

          const serviceCollection = client.db('lotus').collection('services');
          const bookingCollection = client.db('lotus').collection('bookings')

        //   Service API

          app.get('/services', async(req, res) => {
              const services = await serviceCollection.find().toArray();
              res.send(services)
          })

        //   API for single service
          app.get('/service/:id', async(req, res) => {
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const service = await serviceCollection.findOne(query);
              res.send(service);
          })
        
        //   Add new booking to database

        app.post('/booking', async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })
    }

    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Lotus Server')
})

app.listen(port, () => {
  console.log(`Listening to lotus server ${port}`)
})