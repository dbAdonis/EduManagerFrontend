document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");
  
    if (!token) {
      console.log("No hay token. Redirigiendo al login...");
      window.location.href = "/admin.html";
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rol = payload.rol || payload.role || payload.authorities?.[0] || "USER";
  
      console.log("Rol detectado:", rol);
  
      if (rol === "ADMIN") {
        mostrarVistaAdmin();
      } else {
        ocultarVistaAdmin();
      }
  
    } catch (e) {
      console.error("Token inválido", e);
      window.location.href = "/admin.html";
    }
  });
  
  function mostrarVistaAdmin() {
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
      adminPanel.style.display = "block";
    }
  }
  
  function ocultarVistaAdmin() {
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
      adminPanel.style.display = "none";
    }
  }
  