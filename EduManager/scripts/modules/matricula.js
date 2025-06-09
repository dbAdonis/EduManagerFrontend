const API_MATRICULAS_URL = "http://localhost:8080/api/matriculas";
const API_ESTUDIANTES_URL = "http://localhost:8080/api/estudiantes";
const API_CURSOS_URL = "http://localhost:8080/api/cursos";

let matriculas = [];
let estudiantes = [];
let cursos = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarEstudiantes();
  cargarCursos();
  cargarMatriculas();

  document
    .getElementById("btnAgregarMatricula")
    .addEventListener("click", agregarMatricula);
});

function cargarEstudiantes() {
  fetch(API_ESTUDIANTES_URL)
    .then((res) => res.json())
    .then((data) => {
      estudiantes = data;
      const select = document.getElementById("inputEstudiante");
      select.innerHTML = '<option value="">Seleccione un estudiante</option>';
      estudiantes.forEach((est) => {
        const option = document.createElement("option");
        option.value = est.id_estudiante;
        option.textContent = est.nombre;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("🔴 Error cargando estudiantes:", err));
}

function cargarCursos() {
  fetch(API_CURSOS_URL)
    .then((res) => res.json())
    .then((data) => {
      cursos = data;
      const select = document.getElementById("inputCurso");
      select.innerHTML = '<option value="">Seleccione un curso</option>';
      cursos.forEach((curso) => {
        const option = document.createElement("option");
        option.value = curso.id_curso;
        option.textContent = curso.nombre;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("🔴 Error cargando cursos:", err));
}

function cargarMatriculas() {
  fetch(API_MATRICULAS_URL)
    .then((res) => res.json())
    .then((data) => {
      matriculas = data;
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error cargando matrículas:", err));
}

function renderizarTabla() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  matriculas.forEach((m) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.id_matricula}</td>
      <td>${m.estudiante?.nombre ?? "Sin estudiante"}</td>
      <td>${m.curso?.nombre ?? "Sin curso"}</td>
      <td>${m.fecha_matricula ?? ""}</td>
      <td>${m.estado ?? "Activo"}</td>
      <td>${m.promedio ?? "N/A"}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarMatricula(${
          m.id_matricula
        })">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarMatricula(${
          m.id_matricula
        })">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function agregarMatricula() {
  const idEstudiante = document.getElementById("inputEstudiante").value;
  const idCurso = document.getElementById("inputCurso").value;
  const fecha = document.getElementById("inputFecha").value;

  if (!idEstudiante || !idCurso || !fecha) {
    alert("Por favor complete todos los campos.");
    return;
  }

  const estudiante = estudiantes.find((e) => e.id_estudiante == idEstudiante);
  const curso = cursos.find((c) => c.id_curso == idCurso);

  if (!estudiante || !curso) {
    alert("Datos inválidos.");
    return;
  }

  const nuevaMatricula = {
    estudiante,
    curso,
    fecha,
    estado: "Activo",
  };

  fetch(API_MATRICULAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaMatricula),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al agregar matrícula");
      return res.json();
    })
    .then(() => {
      limpiarFormulario();
      cargarMatriculas();
    })
    .catch((err) => console.error("🔴 Error agregando matrícula:", err));
}

function editarMatricula(id) {
  const mat = matriculas.find(m => m.id_matricula === id);
  if (!mat) return;

  const nuevoIdEstudiante = prompt("Editar ID estudiante:", mat.estudiante?.id_estudiante ?? "");
  const nuevoIdCurso = prompt("Editar ID curso:", mat.curso?.id_curso ?? "");
  const nuevaFecha = prompt("Editar fecha de matrícula (YYYY-MM-DD):", mat.fecha_matricula ?? "");
  const nuevoEstado = prompt("Editar estado:", mat.estado ?? "Activo");
  const nuevoPromedio = prompt("Editar promedio:", mat.promedio ?? "");

  if (!nuevoIdEstudiante || !nuevoIdCurso || !nuevaFecha) {
    alert("Estudiante, curso y fecha son obligatorios.");
    return;
  }

  // Buscar el estudiante y curso en los arrays para validar y enviar la estructura correcta
  const estudiante = estudiantes.find(e => e.id_estudiante == nuevoIdEstudiante);
  const curso = cursos.find(c => c.id_curso == nuevoIdCurso);

  if (!estudiante || !curso) {
    alert("Estudiante o curso no válidos.");
    return;
  }

  const matriculaActualizada = {
    id_matricula: id,
    estudiante,
    curso,
    fecha_matricula: nuevaFecha,
    estado: nuevoEstado,
    promedio: nuevoPromedio || null,
  };

  fetch(`${API_MATRICULAS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(matriculaActualizada),
  })
  .then(res => {
    if (!res.ok) throw new Error("Error actualizando matrícula");
    cargarMatriculas();
  })
  .catch(err => console.error("🔴 Error actualizando matrícula:", err));
}


function eliminarMatricula(id) {
  if (!confirm("¿Seguro que deseas eliminar esta matrícula?")) return;

  fetch(`${API_MATRICULAS_URL}/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error eliminando matrícula");
      matriculas = matriculas.filter((m) => m.id_matricula !== id);
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error eliminando matrícula:", err));
}

function limpiarFormulario() {
  document.getElementById("inputEstudiante").value = "";
  document.getElementById("inputCurso").value = "";
  document.getElementById("inputFecha").value = "";
}
