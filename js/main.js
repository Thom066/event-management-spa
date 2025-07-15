import { getCurrentUser, logout } from "./auth.js";

export function renderHome() {
  const user = getCurrentUser();

  return `
    <h1>Bienvenido, ${user.email} (${user.rol})</h1>
    <button id="logout">Cerrar sesión</button>
    ${
      user.rol === "admin"
        ? `<a href="/dashboard/events/create" data-link>Crear Evento</a>`
        : `<p>Ver eventos disponibles</p>`
    }
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.id === "logout") logout();

  if (e.target.dataset.link) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    history.pushState({}, "", path);
    location.reload();
  }
});
