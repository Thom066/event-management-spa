# Gestión de Eventos SPA

Una Single Page Application para gestionar eventos con autenticación, rutas protegidas y persistencia de sesión.

## Instalación
1. Instala Node.js.
2. Instala json-server: `npm install -g json-server`.
3. Inicia el servidor: `json-server --watch db.json --port 3000`.
4. Instala live-server: `npm install -g live-server`.
5. Inicia la aplicación: `live-server`.

## Estructura
- `index.html`: Página principal.
- `css/styles.css`: Estilos personalizados.
- `js/`: Lógica de la aplicación.
- `db.json`: Base de datos simulada.

## Funcionalidades
- Registro e inicio de sesión con roles (admin/visitante).
- Persistencia de sesión con Local Storage.
- CRUD de eventos para administradores.
- Registro a eventos para visitantes (máximo 10 por evento).
- Rutas protegidas y redirecciones.
- Interfaz responsiva con Bootstrap.

## Credenciales por defecto
- Admin: `admin` / `admin123`