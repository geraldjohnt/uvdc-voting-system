// auth.js

function isLoggedIn() {
  return !!localStorage.getItem('idNumber');
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

function login(idNumber) {
  localStorage.setItem('idNumber', idNumber);
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('idNumber');
  window.location.href = 'login.html';
}
