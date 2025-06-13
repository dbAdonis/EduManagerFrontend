const API_PROFESORES_URL = "http://localhost:8080/api/profesores";

let profesores = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarProfesores();

  document
    .getElementById("btnAgregarProfesor")
    ?.addEventListener("click", agregarProfesor);
});

/**
 * Obtener token JWT desde localStorage.
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Cargar profesores desde el backend.
 */
function cargarProfesores() {
  const token = getToken();

  fetch(API_PROFESORES_URL, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      profesores = data;
      renderizarTablaProfesores();
    })
    .catch((err) => console.error("🔴 Error cargando profesores:", err));
}

/**
 * Renderiza la tabla con los profesores.
 */
function renderizarTablaProfesores() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  profesores.forEach((prof) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${prof.id_profesor}</td>
      <td>${prof.nombre}</td>
      <td>${prof.correo}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="mostrarEditarProfesor(${prof.id_profesor})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarProfesor(${prof.id_profesor})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Agregar nuevo profesor.
 */
function agregarProfesor() {
  const token = getToken();

  const nombre = document.getElementById("inputNombre").value;
  const correo = document.getElementById("inputCorreo").value;

  const nuevo = { nombre, correo };

  fetch(API_PROFESORES_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(nuevo),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((profesorCreado) => {
      profesores.push(profesorCreado);
      renderizarTablaProfesores();
      limpiarFormularioProfesor();
    })
    .catch((err) => console.error("🔴 Error agregando profesor:", err));
}

/**
 * Mostrar formulario para editar un profesor.
 */
function mostrarEditarProfesor(id) {
  const prof = profesores.find((p) => p.id_profesor === id);
  if (!prof) return;

  const nombre = prompt("Editar nombre:", prof.nombre);
  const correo = prompt("Editar correo institucional:", prof.correo);

  if (nombre && correo) {
    const token = getToken();

    const actualizado = { ...prof, nombre, correo };

    fetch(`${API_PROFESORES_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(actualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cargarProfesores();
      })
      .catch((err) =>
        console.error("🔴 Error actualizando profesor:", err)
      );
  }
}

/**
 * Eliminar un profesor.
 */
function eliminarProfesor(id) {
  if (!confirm("¿Seguro que deseas eliminar este profesor?")) return;

  const token = getToken();

  fetch(`${API_PROFESORES_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      profesores = profesores.filter((p) => p.id_profesor !== id);
      renderizarTablaProfesores();
    })
    .catch((err) => console.error("🔴 Error eliminando profesor:", err));
}

/**
 * Limpia el formulario después de agregar.
 */
function limpiarFormularioProfesor() {
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputCorreo").value = "";
}
