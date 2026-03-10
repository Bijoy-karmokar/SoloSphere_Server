const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const corsOptions={
    origin:['http://localhost:5173'],
    credentials:true,
}
app.use(cors(corsOptions))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4imj4lo.mongodb.net/?appName=Cluster0`;

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
    
    const jobsCollection = client.db("SoloSphereDB").collection('jobs');
    const bidsCollection = client.db("SoloSphereDB").collection('bids');

    app.get('/jobs',async(req,res)=>{
          const result = await jobsCollection.find().toArray();
          // console.log(result);
          res.send(result);
    })

    app.get('/jobs/:id',async(req,res)=>{
       const id = req.params.id;
       const filter = {_id : new ObjectId(id)};
       const result = await jobsCollection.findOne(filter);
      //  console.log(result);
       res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("SoloSphere search jobs");
})

app.listen(port,()=>{
    console.log(`Server is running on : http://localhost:${port}`);
    
})