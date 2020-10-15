const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const companiesCollection = client.db("creativeAgencyDB").collection("companies");
    const feedbackCollection = client.db("creativeAgencyDB").collection("feedback");
    const servicesCollection = client.db("creativeAgencyDB").collection("services");
    const ordersCollection = client.db("creativeAgencyDB").collection("orders");


    app.get('/companies', (req, res) => {
        companiesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/feedback', (req, res) => {
        feedbackCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/feedback', (req, res) => {
        const orders = req.body;
        feedbackCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/services', (req, res) => {
        const services = req.body;
        servicesCollection.insertOne(services)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/target-orders', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/orders', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.delete('/delete/:id', (req, res) => {
        ordersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            });
    });
});

app.listen(process.env.PORT || port)