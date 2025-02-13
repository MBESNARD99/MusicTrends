// auth.js

window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        // Redirige vers la route d'auth côté serveur
        window.location.href = '/login';
      });
    }
  });
  