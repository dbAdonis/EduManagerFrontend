const API_CALIFICACIONES_URL = "http://localhost:8080/api/calificaciones";
const API_ESTUDIANTES_URL = "http://localhost:8080/api/estudiantes";
const API_CURSOS_URL = "http://localhost:8080/api/cursos";

let calificaciones = [];
let estudiantes = [];
let cursos = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarEstudiantes();
  cargarCursos();
  cargarCalificaciones();

  document
    .getElementById("btnAgregarCalificacion")
    .addEventListener("click", agregarCalificacion);
});

function cargarEstudiantes() {
  fetch(API_ESTUDIANTES_URL)
    .then(res => res.json())
    .then(data => {
      estudiantes = data;
      const select = document.getElementById("inputEstudiante");
      select.innerHTML = '<option value="">Seleccione un estudiante</option>';
      estudiantes.forEach(est => {
        const option = document.createElement("option");
        option.value = est.id_estudiante;
        option.textContent = est.nombre;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("🔴 Error cargando estudiantes:", err));
}

function cargarCursos() {
  fetch(API_CURSOS_URL)
    .then(res => res.json())
    .then(data => {
      cursos = data;
      const select = document.getElementById("inputCurso");
      select.innerHTML = '<option value="">Seleccione un curso</option>';
      cursos.forEach(curso => {
        const option = document.createElement("option");
        option.value = curso.id_curso;
        option.textContent = curso.nombre;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("🔴 Error cargando cursos:", err));
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
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  calificaciones.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id_calificacion}</td>
      <td>${c.matricula?.estudiante?.nombre ?? "Sin estudiante"}</td>
      <td>${c.matricula?.curso?.nombre ?? "Sin curso"}</td>
      <td>${c.tipo_evaluacion ?? ""}</td>
      <td>${c.nota ?? ""}</td>
      <td>${new Date(c.fecha_registro).toLocaleDateString() ?? ""}</td>
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
  const idEstudiante = document.getElementById("inputEstudiante").value;
  const idCurso = document.getElementById("inputCurso").value;
  const tipoEvaluacion = document.getElementById("inputTipoEvaluacion").value;
  const nota = document.getElementById("inputNota").value;
  const fecha = document.getElementById("inputFecha").value;

  if (!idEstudiante || !idCurso || !tipoEvaluacion || !nota || !fecha) {
    alert("Por favor complete todos los campos.");
    return;
  }

  if (nota < 0 || nota > 100) {
    alert("La nota debe estar entre 0 y 100.");
    return;
  }

  const estudiante = estudiantes.find(e => e.id_estudiante == idEstudiante);
  const curso = cursos.find(c => c.id_curso == idCurso);

  if (!estudiante || !curso) {
    alert("Datos inválidos.");
    return;
  }

  // Debemos enviar la matrícula que une estudiante y curso, así que buscamos la matrícula correspondiente
  fetch(`http://localhost:8080/api/matriculas?estudianteId=${idEstudiante}&cursoId=${idCurso}`)
    .then(res => res.json())
    .then(matriculasEncontradas => {
      if (!matriculasEncontradas.length) {
        alert("No se encontró matrícula para el estudiante y curso seleccionados.");
        return;
      }

      const matricula = matriculasEncontradas[0]; // Suponemos 1 matrícula única

      const nuevaCalificacion = {
        matricula,
        tipo_evaluacion: tipoEvaluacion,
        nota: Number(nota),
        fecha_registro: fecha,
      };

      return fetch(API_CALIFICACIONES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCalificacion)
      });
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

function mostrarEditarCalificacion(id) {
  const cal = calificaciones.find(c => c.id_calificacion === id);
  if (!cal) return;

  const tipoEvaluacion = prompt("Editar tipo de evaluación:", cal.tipo_evaluacion);
  const nota = prompt("Editar nota (0-100):", cal.nota);
  const fecha = prompt("Editar fecha (YYYY-MM-DD):", new Date(cal.fecha_registro).toISOString().slice(0,10));

  if (!tipoEvaluacion || nota === null || nota === "" || !fecha) {
    alert("Campos incompletos, no se actualizó.");
    return;
  }

  if (nota < 0 || nota > 100) {
    alert("La nota debe estar entre 0 y 100.");
    return;
  }

  const actualizado = {
    ...cal,
    tipo_evaluacion: tipoEvaluacion,
    nota: Number(nota),
    fecha_registro: fecha,
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

function limpiarFormulario() {
  document.getElementById("inputEstudiante").value = "";
  document.getElementById("inputCurso").value = "";
  document.getElementById("inputTipoEvaluacion").value = "";
  document.getElementById("inputNota").value = "";
  document.getElementById("inputFecha").value = "";
}
