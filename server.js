require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const querystring = require('querystring'); 
// ou bien : const { URLSearchParams } = require('url');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());

// TEST : http://localhost:3000/hello
app.get('/hello', (req, res) => {
  res.send('Hello from MusicTrends server!');
});

// 1) Route /login -> Construit l'URL d'authentification Spotify et redirige l'utilisateur
app.get('/login', (req, res) => {
  // Liste des scopes désirés (à ajuster selon les besoins)
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify'
  ].join(' ');

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI; 
  // ex: "http://localhost:3000/callback"

  // Construction des paramètres de la requête à Spotify
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: redirectUri
    // si tu veux un "state", tu peux l'ajouter ici : state: 'xyz'
  });

  // Redirection vers la page de login Spotify
  res.redirect('https://accounts.spotify.com/authorize?' + queryParams);
});

// 2) Route /callback -> Spotify nous renvoie ici avec ?code=... après l'autorisation
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  if (!code) {
    return res.status(400).send("Code d'autorisation manquant");
  }

  try {
    // Echange du "code" contre un "access_token" + "refresh_token"
    // via l'endpoint https://accounts.spotify.com/api/token
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Authentification via Basic <base64(client_id:client_secret)>
        Authorization: 'Basic ' + Buffer
          .from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
          .toString('base64')
      }
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Exemple : on renvoie l'utilisateur sur la page d'accueil 
    // en attachant les tokens dans l'URL (ou en session, au choix)
    const queryParams = querystring.stringify({
      access_token,
      refresh_token
    });
    res.redirect('/?' + queryParams);

    // Ou, si tu veux juste afficher un message :
    // res.send("Connexion Spotify réussie, access_token = " + access_token);

  } catch (error) {
    console.error('Erreur lors de la récupération du token :', error.response?.data || error.message);
    res.status(500).send('Erreur lors de la récupération du token');
  }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
