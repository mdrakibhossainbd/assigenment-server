const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ibnk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/',(req,res)=>{

    res.send("Server Works SuccessFully ") 
})

client.connect(err => {
    const creativityCollection = client.db("creativeAgencyDB").collection("creativity");
    const reviewCollection = client.db("creativeAgencyDB").collection("review");
    const productCollection = client.db("creativeAgencyDB").collection("product");
    const adminCollection = client.db("creativeAgencyDB").collection("admin");

    // Showing products
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    // add an admin
    app.post('/addAnAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.insertOne({ email })
            .then(res => {
                res.send(res.insertedCount > 0);
            })
    })

    // for admin login
    app.get('/isAdmin', (req, res) => {
        const email = req.query.email;
        adminCollection.find({ email })
            .toArray((err, collection) => {
                res.send(collection)
            })
    })

    // admin added product
    app.post('/addProduct', (req, res) => {
        const description = req.body.description;
        const service = req.body.service;
        const file = req.files.image;
        const Img = file.data;
        const encImg = Img.toString('base64');
        const image = {
            contentType: req.files.image.mimetype,
            size: req.files.image.size,
            img: Buffer.from(encImg, 'base64')
        };

        productCollection.insertOne({ description, service, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // order section
    app.post('/addOrder', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const description = req.body.description;
        const service = req.body.service;
        const price = req.body.price;
        const file = req.files.image;
        const Img = file.data;
        const encImg = Img.toString('base64');
        const image = {
            contentType: req.files.image.mimetype,
            size: req.files.image.size,
            img: Buffer.from(encImg, 'base64')
        };

        creativityCollection.insertOne({ name, email, description, service, price, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // users order
    app.get('/orders', (req, res) => {
        creativityCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // show all service in admin table
    app.get('/allService', (req, res) => {
        creativityCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // review section
    app.post('/addReview', (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
            .then(result => {
                res.status(200).send(result.insertedCount > 0)
            })
    })

    // add all review in home page
    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
});

app.listen(process.env.PORT || port)