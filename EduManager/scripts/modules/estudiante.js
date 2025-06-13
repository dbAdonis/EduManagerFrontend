const API_ESTUDIANTES_URL = "http://localhost:8080/api/estudiantes";

let estudiantes = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarEstudiantes();

  document
    .getElementById("btnAgregarEstudiante")
    .addEventListener("click", agregarEstudiante);
});

/**
 * Obtener token JWT desde localStorage.
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Cargar estudiantes desde el backend.
 */
function cargarEstudiantes() {
  const token = getToken();

  fetch(API_ESTUDIANTES_URL, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      estudiantes = data;
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error cargando estudiantes:", err));
}

/**
 * Renderiza la tabla con los estudiantes.
 */
function renderizarTabla() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  estudiantes.forEach((est) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${est.id_estudiante}</td>
            <td>${est.nombre}</td>
            <td>${est.correo}</td>
            <td>${est.estado}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="mostrarEditar(${est.id_estudiante})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarEstudiante(${est.id_estudiante})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

/**
 * Agregar nuevo estudiante.
 */
function agregarEstudiante() {
  const token = getToken();

  const nombre = document.getElementById("inputNombre").value;
  const correo = document.getElementById("inputCorreo").value;
  const estado = document.getElementById("inputEstado").value;

  const nuevo = { nombre, correo, estado };

  fetch(API_ESTUDIANTES_URL, {
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
    .then((estudianteCreado) => {
      if (
        !estudianteCreado.id_estudiante ||
        estudianteCreado.id_estudiante === 0
      ) {
        console.warn("⚠️ El ID recibido es 0 o inválido:", estudianteCreado);
      }

      estudiantes.push(estudianteCreado);
      renderizarTabla();
      limpiarFormulario();
    })
    .catch((err) => console.error("🔴 Error agregando estudiante:", err));
}

/**
 * Mostrar formulario para editar un estudiante.
 */
function mostrarEditar(id) {
  const est = estudiantes.find((e) => e.id_estudiante === id);
  if (!est) return;

  const nombre = prompt("Editar nombre:", est.nombre);
  const correo = prompt("Editar correo:", est.correo);
  const estado = prompt("Editar estado:", est.estado);

  if (nombre && correo && estado) {
    const token = getToken();

    const actualizado = { ...est, nombre, correo, estado };

    fetch(`${API_ESTUDIANTES_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(actualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cargarEstudiantes();
      })
      .catch((err) => console.error("🔴 Error actualizando estudiante:", err));
  }
}

/**
 * Eliminar un estudiante.
 */
function eliminarEstudiante(id) {
  if (!confirm("¿Seguro que deseas eliminar este estudiante?")) return;

  const token = getToken();

  fetch(`${API_ESTUDIANTES_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      estudiantes = estudiantes.filter((e) => e.id_estudiante !== id);
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error eliminando estudiante:", err));
}

/**
 * Limpia el formulario después de agregar.
 */
function limpiarFormulario() {
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputCorreo").value = "";
  document.getElementById("inputEstado").value = "";
}
