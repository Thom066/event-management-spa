// auth.js
const API_URL = "http://localhost:3000/users";

// Referencias
const form = document.querySelector("form");
const isLogin = window.location.pathname === "/login";
const isRegister = window.location.pathname === "/register";

// Evento
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const rol = form.rol ? form.rol.value : null;

    if (!email || !password || (isRegister && !rol)) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const res = await fetch(API_URL);
    const users = await res.json();
    const user = users.find((u) => u.email === email);

    if (isRegister) {
      if (user) return alert("Este correo ya está registrado");
      await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password, rol }),
      });
      alert("Usuario registrado con éxito");
      window.location.href = "/login";
    } else {
      if (!user || user.password !== password)
        return alert("Credenciales inválidas");
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/dashboard";
    }
  });
}

// Función de logout
export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Utilidad para obtener usuario actual
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}
