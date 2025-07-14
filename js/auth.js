// auth.js
const API_URL = 'http://localhost:3000';

// Registrar usuario
async function registerUser(username, password, role = 'visitor') {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    return response.ok;
  } catch (error) {
    console.error('Error al registrar:', error);
    return false;
  }
}

// Iniciar sesión
async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_URL}/users?username=${username}&password=${password}`);
    const users = await response.json();
    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return null;
  }
}

// Obtener usuario actual
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('user');
  navigateTo('/dashboard');
}

// Formularios de registro e inicio de sesión
function renderLogin() {
  return `
    <div class="form-container">
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input type="text" class="form-control" id="username" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
      </form>
      <p class="mt-3">¿No tienes cuenta? <a href="#/register">Regístrate</a></p>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="form-container">
      <h2>Registrarse</h2>
      <form id="register-form">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input type="text" class="form-control" id="username" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
      </form>
      <p class="mt-3">¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
    </div>
  `;
}

// Manejo de eventos para formularios
function setupAuthListeners() {
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'login-form') {
      e.preventDefault();
      const username = e.target.querySelector('#username').value;
      const password = e.target.querySelector('#password').value;
      const user = await loginUser(username, password);
      if (user) {
        navigateTo('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    } else if (e.target.id === 'register-form') {
      e.preventDefault();
      const username = e.target.querySelector('#username').value;
      const password = e.target.querySelector('#password').value;
      const success = await registerUser(username, password);
      if (success) {
        alert('Registro exitoso. Por favor, inicia sesión.');
        navigateTo('/login');
      } else {
        alert('Error al registrarse');
      }
    }
  });
}

// Hacer logout accesible globalmente
window.logout = logout;