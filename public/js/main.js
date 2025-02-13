// main.js

// Exemple : récupérer un paramètre 'access_token' depuis l'URL
const params = new URLSearchParams(window.location.search);
const accessToken = params.get('access_token');

// Sélecteurs DOM
const releasesContainer = document.getElementById('releasesContainer');
const favoritesContainer = document.getElementById('favoritesContainer');

// Afficher les nouveautés (si on a un token)
async function fetchNewReleases() {
  if (!accessToken) {
    releasesContainer.innerHTML = '<p>Connectez-vous à Spotify pour voir les nouveautés.</p>';
    return;
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    const albums = data.albums.items;

    releasesContainer.innerHTML = '';
    albums.forEach(album => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${album.images[0]?.url}" alt="cover" />
        <h3>${album.name}</h3>
        <p>${album.artists.map(a => a.name).join(', ')}</p>
        <p>Sortie : ${album.release_date}</p>
      `;
      releasesContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fetchNewReleases();
});
