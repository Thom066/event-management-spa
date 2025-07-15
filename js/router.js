// router.js
import { getCurrentUser } from "./auth.js";
import { renderHome } from "./main.js";
import { renderCreateEvent } from "./events.js";
import { renderNotFound } from "./not-found.js";

export function router(path) {
  const app = document.getElementById("app");
  const user = getCurrentUser();

  const routes = {
    "/dashboard": renderHome,
    "/dashboard/events/create": renderCreateEvent,
  };

  const publicPaths = ["/login", "/register"];

  // Protección
  if (!user && !publicPaths.includes(path)) {
    window.history.pushState({}, "", "/login");
    return location.reload();
  }

  if (user && publicPaths.includes(path)) {
    window.history.pushState({}, "", "/dashboard");
    return location.reload();
  }

  if (routes[path]) {
    app.innerHTML = routes[path]();
  } else {
    app.innerHTML = renderNotFound();
  }
}

// Inicializar router
window.onpopstate = () => router(location.pathname);
document.addEventListener("DOMContentLoaded", () => {
  router(location.pathname);
});
