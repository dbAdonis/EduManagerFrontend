document.addEventListener("DOMContentLoaded", () => {
  const timestamp = new Date().getTime(); // Para evitar caché

  // Cargar el header con la prevención de caché
  fetch(`templates/header.html?ts=${timestamp}`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-include").innerHTML = data;

      // Esperamos un poco para que el DOM se actualice
      setTimeout(() => {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Para depurar

        if (token) {
          // Cambiar los enlaces de Vehículos y Oficinas si el usuario es admin
          const vehiculoLink = document.getElementById("vehiculos-link");
          const reservaLink = document.getElementById("reservas-link");
          const oficinaLink = document.getElementById("oficinas-link");

          if (vehiculoLink) {
            vehiculoLink.setAttribute("href", "../views/vehiculoAdmin.html");
          }
          if (reservaLink) {
            reservaLink.setAttribute("href", "../views/reservasAdmin.html");
          }
          if (oficinaLink) {
            oficinaLink.setAttribute("href", "../views/oficinaAdmin.html");
          }

          // Agregar un botón de "Cerrar sesión" al navbar
          const infoPanel = document.createElement("div");
          infoPanel.className = "info-panel d-flex align-items-center";

          const logoutButton = document.createElement("button");
          logoutButton.className = "btn btn-outline-light";
          logoutButton.textContent = "Cerrar sesión";
          logoutButton.onclick = () => {
            localStorage.removeItem("token"); // Eliminar el token
            window.location.href = "../views/index.html"; // Redirigir al inicio
          };

          infoPanel.appendChild(logoutButton);

          // Insertar el botón de cerrar sesión en el navbar
          const collapseNavbar = document.getElementById("mainNavbar");
          if (collapseNavbar) {
            document.getElementById("logout-container")?.appendChild(infoPanel);
          }
        }
      }, 50);
    });

  // Cargar el footer
  fetch(`templates/footer.html?ts=${timestamp}`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-include").innerHTML = data;
    });
});

 // Al cargar la página, aplica el modo oscuro si está activado
 if (localStorage.getItem('modoOscuro') === 'activado') {
  document.body.classList.add('dark-mode');
}

// Función para cambiar el modo
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('modoOscuro', isDark ? 'activado' : 'desactivado');
}
