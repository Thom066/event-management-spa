import { getCurrentUser } from "./auth.js";

export function renderCreateEvent() {
  const user = getCurrentUser();
  if (user?.rol !== "admin") {
    return `<h2 class="text-danger">Acceso denegado</h2>`;
  }

  return `
    <h2>Crear Evento</h2>
    <form id="createEventForm">
      <input type="text" placeholder="Nombre del evento" id="name" required />
      <input type="date" id="date" required />
      <input type="number" id="capacity" placeholder="Capacidad" required />
      <button type="submit">Crear</button>
    </form>
  `;
}

document.addEventListener("submit", async (e) => {
  if (e.target.id === "createEventForm") {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const capacity = parseInt(document.getElementById("capacity").value);

    await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, date, capacity }),
    });

    alert("Evento creado");
    window.location.href = "/dashboard";
  }
});
