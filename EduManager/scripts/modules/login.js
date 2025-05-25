let token = "";

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.token) {
    // Si existe el token, se guarda y redirige
    token = data.token;
    localStorage.setItem("token", token);

    // Verificar si el usuario es 'admin' (esto debe ser una validación adicional según lo que retorne tu backend)
    if (username === "admin" && password === "admin") {
      // Si es admin, redirige al dashboard o la vista correspondiente
      window.location.href = "../views/index.html";
    } else {
      // Si no es admin, mostramos un mensaje adecuado
      alert("Solo los administradores pueden acceder a esta área.");
    }
  } else {
    // Si no se recibe token, se muestra un mensaje de error
    alert("Usuario o contraseña incorrectos.");
  }
}

async function getProtectedData() {
  const res = await fetch("http://localhost:8080/products", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const json = await res.json();
  document.getElementById("result").innerText = JSON.stringify(json, null, 2);
}
