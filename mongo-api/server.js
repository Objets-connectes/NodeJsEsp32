const express = require('express');
const { MongoClient } = require('mongodb');

// URL de connexion interne de Docker
const url = 'mongodb://mongo:27017';
const client = new MongoClient(url);

const app = express();
app.use(express.json());

// Point d'entrée pour Grafana
app.post('/query', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(req.body.database); // Grafana enverra le nom de la BDD
    const collection = db.collection(req.body.collection); // et de la collection

    // Grafana enverra le pipeline d'agrégation
    const pipeline = req.body.pipeline || [];

    const results = await collection.aggregate(pipeline).toArray();
    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(8080, () => {
  console.log('Mongo-API (traducteur) démarrée sur le port 8080');
});