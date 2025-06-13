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

function getToken() {
  return localStorage.getItem("token");
}

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
  const token = getToken();

  fetch(API_CURSOS_URL, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
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
  const token = getToken();

  fetch(API_MATRICULAS_URL, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
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
      <td>${m.estado}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarMatricula(${m.id_matricula})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarMatricula(${m.id_matricula})">
          <i class="bi bi-trash"></i>
        </button>
        <button onclick="cancelarMatricula(${m.id_matricula})" class="btn btn-success">
        ❌ Cancelar
      </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function agregarMatricula() {
  const token = getToken();

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
    fecha_matricula: fecha,
  };

  fetch(API_MATRICULAS_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
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
  const token = getToken();

  const mat = matriculas.find((m) => m.id_matricula === id);
  if (!mat) return;

  const nuevoIdEstudiante = prompt("Editar ID estudiante:", mat.estudiante?.id_estudiante ?? "");
  const nuevoIdCurso = prompt("Editar ID curso:", mat.curso?.id_curso ?? "");
  const nuevaFecha = prompt("Editar fecha de matrícula (YYYY-MM-DD):", mat.fecha_matricula ?? "");
  const nuevoEstado = prompt("Editar estado:", mat.estado ?? "activo");

  if (!nuevoIdEstudiante || !nuevoIdCurso || !nuevaFecha || !nuevoEstado) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const estudiante = estudiantes.find((e) => e.id_estudiante == nuevoIdEstudiante);
  const curso = cursos.find((c) => c.id_curso == nuevoIdCurso);

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
  };

  fetch(`${API_MATRICULAS_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(matriculaActualizada),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error actualizando matrícula");
      cargarMatriculas();
    })
    .catch((err) => console.error("🔴 Error actualizando matrícula:", err));
}

function eliminarMatricula(id) {
  if (!confirm("¿Seguro que deseas eliminar esta matrícula?")) return;

  const token = getToken();

  fetch(`${API_MATRICULAS_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error eliminando matrícula");
      matriculas = matriculas.filter((m) => m.id_matricula !== id);
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error eliminando matrícula:", err));
}

function cancelarMatricula(id) {
  if (!confirm('¿Estás seguro de que quieres cancelar esta matrícula?')) return;

  const token = getToken();

  fetch(`${API_MATRICULAS_URL}/${id}/cancelar`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.ok) {
      alert('Matrícula cancelada exitosamente.');
      location.reload(); // o refrescar solo la tabla si usás AJAX
    } else {
      return res.text().then(msg => { throw new Error(msg); });
    }
  })
  .catch(err => alert('Error al cancelar: ' + err.message));
}

function limpiarFormulario() {
  document.getElementById("inputEstudiante").value = "";
  document.getElementById("inputCurso").value = "";
  document.getElementById("inputFecha").value = "";
}
