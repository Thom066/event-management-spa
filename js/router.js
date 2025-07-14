// router.js
function navigateTo(path) {
    window.location.hash = path;
  }
  
  function updateNav() {
    const user = getCurrentUser();
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = `
      ${user ? `
        <li class="nav-item">
          <span class="nav-link">Bienvenido, ${user.username}</span>
        </li>
        <li class="nav-item">
          <button class="nav-link btn btn-link" onclick="logout()">Cerrar Sesión</button>
        </li>
      ` : `
        <li class="nav-item">
          <a class="nav-link" href="#/login">Iniciar Sesión</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/register">Registrarse</a>
        </li>
      `}
    `;
  }
  
  function router() {
    const user = getCurrentUser();
    const hash = window.location.hash || '#/dashboard';
    const routes = {
      '#/dashboard': renderDashboard,
      '#/login': renderLogin,
      '#/register': renderRegister,
      '#/dashboard/events/create': renderCreateEvent,
      '#/dashboard/events/edit/:id': (id) => renderEditEvent(id)
    };
  
    // Redirecciones según estado de autenticación
    if (user && (hash === '#/login' || hash === '#/register')) {
      navigateTo('/dashboard');
      return;
    }
    if (!user && (hash.startsWith('#/dashboard/events'))) {
      navigateTo('/not-found');
      return;
    }
    if (user && user.role !== 'admin' && (hash.startsWith('#/dashboard/events/create') || hash.startsWith('#/dashboard/events/edit'))) {
      navigateTo('/not-found');
      return;
    }
  
    // Renderizar vista
    const routeKey = Object.keys(routes).find(key => {
      if (key.includes(':id')) {
        const base = key.split(':id')[0];
        return hash.startsWith(base);
      }
      return key === hash;
    });
  
    if (routeKey) {
      const route = routes[routeKey];
      if (routeKey.includes(':id')) {
        const id = hash.split('/').pop();
        document.getElementById('app').innerHTML = route(id);
      } else {
        document.getElementById('app').innerHTML = route();
      }
    } else {
      document.getElementById('app').innerHTML = renderNotFound();
    }
  
    updateNav();
  }
  
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);