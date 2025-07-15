async function getEvents() {
  const response = await fetch(`${API_URL}/events`);
  return await response.json();
}

async function createEvent(event) {
  await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}

async function updateEvent(id, event) {
  await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}

async function deleteEvent(id) {
  await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
}

async function deleteRegistration(id) {
  await fetch(`${API_URL}/registrations/${id}`, { method: 'DELETE' });
}

async function registerToEvent(eventId, userId) {
  if (!userId) {
    localStorage.setItem('pendingEventId', eventId);
    alert('Debes iniciar sesión para registrarte');
    navigateTo('/login');
    return false;
  }

  const registrations = await fetch(`${API_URL}/registrations?eventId=${eventId}`);
  const registrationData = await registrations.json();
  if (registrationData.length >= 10) {
    alert('Evento lleno');
    return false;
  }

  await fetch(`${API_URL}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, userId })
  });

  return true;
}

async function getUserRegistrations(userId) {
  const response = await fetch(`${API_URL}/registrations?userId=${userId}`);
  return await response.json();
}

function renderDashboard() {
  const user = getCurrentUser();
  let content = '<h2>Eventos Disponibles</h2><div class="event-list">';

  Promise.all([
    getEvents(),
    user?.role === 'admin' ? fetch(`${API_URL}/registrations`).then(res => res.json()) : Promise.resolve([]),
    user?.role === 'admin' ? fetch(`${API_URL}/users`).then(res => res.json()) : Promise.resolve([])
  ]).then(([events, registrations, users]) => {
    events.forEach(event => {
      let actionButton = '';
      let registeredUsersList = '';

      if (user && user.role === 'admin') {
        const registered = registrations.filter(r => r.eventId === event.id);
        if (registered.length > 0) {
          registeredUsersList = `<p class="mt-2"><strong>Registrados:</strong></p><ul>`;
          registered.forEach(r => {
            const u = users.find(u => u.id === r.userId);
            registeredUsersList += `<li>${u?.username || 'Usuario desconocido'}</li>`;
          });
          registeredUsersList += `</ul>`;
        } else {
          registeredUsersList = `<p class="mt-2 text-muted">Sin registros aún</p>`;
        }

        actionButton = `
          <a href="#/dashboard/events/edit/${event.id}" class="btn btn-warning">Editar</a>
          <button class="btn btn-danger" onclick="deleteEvent('${event.id}').then(() => navigateTo('/dashboard'))">Eliminar</button>
        `;
      } else {
        actionButton = `
          <button class="btn btn-primary register-btn" data-event-id="${event.id}">Registrarse</button>
        `;
      }

      content += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">${event.description}</p>
            <p class="card-text"><small>${event.date}</small></p>
            ${actionButton}
            ${registeredUsersList}
          </div>
        </div>
      `;
    });

    content += '</div>';

    if (user && user.role === 'admin') {
      content += '<a href="#/dashboard/events/create" class="btn btn-success mt-3">Crear Evento</a>';
    }

    if (user && user.role !== 'admin') {
      content += '<h3 class="mt-4">Mis Registros</h3>';
      getUserRegistrations(user.id).then(regs => {
        getEvents().then(events => {
          regs.forEach(reg => {
            const event = events.find(e => e.id === reg.eventId);
            content += `
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${event?.name}</h5>
                  <p class="card-text">${event?.date}</p>
                  <button class="btn btn-danger btn-sm" onclick="deleteRegistration('${reg.id}').then(() => navigateTo('/dashboard'))">Eliminar Registro</button>
                </div>
              </div>
            `;
          });
          document.getElementById('app').innerHTML = content;
        });
      });
    } else {
      document.getElementById('app').innerHTML = content;
    }
  });

  return content;
}

function renderCreateEvent() {
  return `
    <div class="form-container">
      <h2>Crear Evento</h2>
      <form id="create-event-form">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" id="name" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción</label>
          <textarea class="form-control" id="description" required></textarea>
        </div>
        <div class="mb-3">
          <label for="date" class="form-label">Fecha</label>
          <input type="date" class="form-control" id="date" required>
        </div>
        <button type="submit" class="btn btn-primary">Crear</button>
      </form>
    </div>
  `;
}

function renderEditEvent(eventId) {
  getEvents().then(events => {
    const event = events.find(e => e.id == eventId);
    if (event) {
      document.getElementById('app').innerHTML = `
        <div class="form-container">
          <h2>Editar Evento</h2>
          <form id="edit-event-form">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" value="${event.name}" required>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Descripción</label>
              <textarea class="form-control" id="description" required>${event.description}</textarea>
            </div>
            <div class="mb-3">
              <label for="date" class="form-label">Fecha</label>
              <input type="date" class="form-control" id="date" value="${event.date}" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      `;
    }
  });
}

function setupEventListeners() {
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'create-event-form') {
      e.preventDefault();
      const event = {
        name: e.target.querySelector('#name').value,
        description: e.target.querySelector('#description').value,
        date: e.target.querySelector('#date').value
      };
      await createEvent(event);
      navigateTo('/dashboard');
    } else if (e.target.id === 'edit-event-form') {
      e.preventDefault();
      const event = {
        name: e.target.querySelector('#name').value,
        description: e.target.querySelector('#description').value,
        date: e.target.querySelector('#date').value
      };
      const eventId = window.location.hash.split('/').pop();
      await updateEvent(eventId, event);
      navigateTo('/dashboard');
    }
  });

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('register-btn')) {
      const eventId = e.target.dataset.eventId;
      const user = getCurrentUser();
      await registerToEvent(eventId, user?.id);
      navigateTo('/dashboard');
    }
  });
}
