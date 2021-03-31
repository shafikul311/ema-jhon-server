
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 5000


app.use(express.json());
app.use(cors());
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywwhy.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER)






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonDb").collection("products");
  const ordersCollection = client.db("emaJhonDb").collection("order");



  app.post('/addProduct',(req ,res) =>{
    const product = req.body;
   
    productsCollection.insertOne(product)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })

  })

  app.get('/products',(req ,res)=>{
    productsCollection.find({})
    .toArray((err ,documents)=>{
      res.send(documents)
    })
  })


  app.get('/products/:key',(req ,res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err ,documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys',(req ,res)=>{
    const productKeys = req.body;
    productsCollection.find({key:{$in:productKeys }})
    .toArray((err , documents)=>{
      res.send(documents);
    })

  })


  app.post('/addOrder',(req ,res) =>{
    const order = req.body;
   
   ordersCollection.insertOne(order)
    .then(result =>{
      // console.log(result.insertedCount)
      res.send(result.insertedCount)
    })

  })


});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


