const API_CALIFICACIONES_URL = "http://localhost:8080/api/calificaciones";
const API_MATRICULAS_URL = "http://localhost:8080/api/matriculas";

let calificaciones = [];
let matriculas = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarMatriculas();
  cargarCalificaciones();

  document
    .getElementById("btnAgregarCalificacion")
    .addEventListener("click", agregarCalificacion);
});

function cargarMatriculas() {
  fetch(API_MATRICULAS_URL)
    .then(res => res.json())
    .then(data => {
      matriculas = data;
      const select = document.getElementById("inputMatricula");
      select.innerHTML = '<option value="">Seleccione una matrícula</option>';
      data.forEach(mat => {
        const option = document.createElement("option");
        option.value = mat.id_matricula;
        option.textContent = `${mat.estudiante?.nombre ?? "?"} - ${mat.curso?.nombre ?? "?"}`;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("🔴 Error cargando matrículas:", err));
}

function cargarCalificaciones() {
  fetch(API_CALIFICACIONES_URL)
    .then(res => res.json())
    .then(data => {
      calificaciones = data;
      renderizarTabla();
    })
    .catch(err => console.error("🔴 Error cargando calificaciones:", err));
}

function renderizarTabla() {
  const tbody = document.getElementById("tablaCalificacionesBody");
  tbody.innerHTML = "";

  calificaciones.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id_calificacion}</td>
      <td>${c.matricula?.estudiante?.nombre ?? "?"}</td>
      <td>${c.matricula?.curso?.nombre ?? "?"}</td>
      <td>${c.nota ?? ""}</td>
      <td>${new Date(c.fecha_calificacion).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="mostrarEditarCalificacion(${c.id_calificacion})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarCalificacion(${c.id_calificacion})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function agregarCalificacion() {
  const idMatricula = document.getElementById("inputMatricula").value;
  const nota = parseFloat(document.getElementById("inputNota").value);
  const fecha = document.getElementById("inputFecha").value;

  if (!idMatricula || isNaN(nota) || !fecha) {
    alert("Por favor complete todos los campos.");
    return;
  }

  if (nota < 0 || nota > 100) {
    alert("La nota debe estar entre 0 y 100.");
    return;
  }

  const matricula = matriculas.find(m => m.id_matricula == idMatricula);
  if (!matricula) {
    alert("Matrícula no válida.");
    return;
  }

  const nuevaCalificacion = {
    matricula,
    nota,
    fecha_calificacion: fecha
  };

  fetch(API_CALIFICACIONES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaCalificacion)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al agregar calificación");
      return res.json();
    })
    .then(() => {
      limpiarFormulario();
      cargarCalificaciones();
    })
    .catch(err => console.error("🔴 Error agregando calificación:", err));
}

function mostrarEditarCalificacion(id) {
  const cal = calificaciones.find(c => c.id_calificacion === id);
  if (!cal) return;

  const nuevaNota = prompt("Editar nota:", cal.nota);
  const nuevaFecha = prompt("Editar fecha (YYYY-MM-DD):", new Date(cal.fecha_calificacion).toISOString().slice(0, 10));

  if (!nuevaNota || isNaN(nuevaNota) || !nuevaFecha) {
    alert("Datos inválidos.");
    return;
  }

  const actualizado = {
    ...cal,
    nota: parseFloat(nuevaNota),
    fecha_calificacion: nuevaFecha
  };

  fetch(`${API_CALIFICACIONES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error actualizando calificación");
      cargarCalificaciones();
    })
    .catch(err => console.error("🔴 Error actualizando calificación:", err));
}

function eliminarCalificacion(id) {
  if (!confirm("¿Seguro que deseas eliminar esta calificación?")) return;

  fetch(`${API_CALIFICACIONES_URL}/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error eliminando calificación");
      calificaciones = calificaciones.filter(c => c.id_calificacion !== id);
      renderizarTabla();
    })
    .catch(err => console.error("🔴 Error eliminando calificación:", err));
}

function limpiarFormulario() {
  document.getElementById("inputMatricula").value = "";
  document.getElementById("inputNota").value = "";
  document.getElementById("inputFecha").value = "";
}
