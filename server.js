// server.js
require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques (ex: index.html) depuis "public"
app.use(express.static('public'));

// Endpoint de test
app.get('/hello', (req, res) => {
  res.send('Hello World from Node.js!');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
