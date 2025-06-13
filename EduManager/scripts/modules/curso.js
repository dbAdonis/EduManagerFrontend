const API_CURSOS_URL = "http://localhost:8080/api/cursos";
const API_PROFESORES_URL = "http://localhost:8080/api/profesores";

let cursos = [];
let profesores = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarCursos();
  cargarProfesores();
  document
    .getElementById("btnAgregarCurso")
    .addEventListener("click", agregarCurso);
});

function cargarCursos() {
  fetch(API_CURSOS_URL)
    .then((res) => res.json())
    .then((data) => {
      cursos = data;
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error cargando cursos:", err));
}

function cargarProfesores() {
  fetch(API_PROFESORES_URL)
    .then((res) => res.json())
    .then((data) => {
      profesores = data;
      const select = document.getElementById("inputProfesor");
      select.innerHTML =
        '<option value="">Seleccione un profesor</option>';
      profesores.forEach((prof) => {
        const option = document.createElement("option");
        option.value = prof.id_profesor;
        option.textContent = prof.nombre;
        select.appendChild(option);
      });
    })
    .catch((err) => console.error("🔴 Error cargando profesores:", err));
}

function renderizarTabla() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  cursos.forEach((curso) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${curso.id_curso}</td>
      <td>${curso.nombre}</td>
      <td>${curso.cupo}</td>
      <td>${curso.cupo_disponible}</td>
      <td>${curso.profesor?.nombre ?? "Sin asignar"}</td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="mostrarEditar(${curso.id_curso})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarCurso(${curso.id_curso})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function agregarCurso() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const cupo = parseInt(document.getElementById("inputCupo").value);
  const idProfesor = document.getElementById("inputProfesor").value;

  if (!nombre || isNaN(cupo) || !idProfesor) {
    alert("Por favor complete todos los campos correctamente.");
    return;
  }

  const profesor = profesores.find((p) => p.id_profesor == idProfesor);
  if (!profesor) {
    alert("Profesor no válido.");
    return;
  }

  const nuevoCurso = {
    nombre,
    cupo,
    cupo_disponible: 0,
    profesor,
  };

  fetch(API_CURSOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoCurso),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error agregando curso");
      return res.json();
    })
    .then(() => {
      document.getElementById("inputNombre").value = "";
      document.getElementById("inputCupo").value = "";
      document.getElementById("inputProfesor").value = "";
      cargarCursos();
    })
    .catch((err) => console.error("🔴 Error agregando curso:", err));
}

function mostrarEditar(id) {
  const curso = cursos.find((c) => c.id_curso === id);
  if (!curso) return;

  const nuevoNombre = prompt("Editar nombre:", curso.nombre);
  const nuevoCupo = prompt("Editar cupo total:", curso.cupo);

  const listaProfesores = profesores
    .map((p) => `${p.id_profesor}: ${p.nombre}`)
    .join("\n");

  const idNuevoProfesor = prompt(
    `Editar profesor:\n${listaProfesores}\n\nIngrese el ID del nuevo profesor (actual: ${curso.profesor?.nombre ?? "Sin asignar"})`,
    curso.profesor?.id_profesor ?? ""
  );

  if (!nuevoNombre || isNaN(nuevoCupo) || !idNuevoProfesor) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const nuevoProfesor = profesores.find(
    (p) => p.id_profesor == idNuevoProfesor
  );

  if (!nuevoProfesor) {
    alert("ID de profesor inválido.");
    return;
  }

  const actualizado = {
    ...curso,
    nombre: nuevoNombre,
    cupo: parseInt(nuevoCupo),
    profesor: nuevoProfesor,
  };

  fetch(`${API_CURSOS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actualizado),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error actualizando curso");
      cargarCursos();
    })
    .catch((err) => console.error("🔴 Error actualizando curso:", err));
}

function eliminarCurso(id) {
  if (!confirm("¿Deseas eliminar este curso?")) return;

  fetch(`${API_CURSOS_URL}/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error eliminando curso");
      cursos = cursos.filter((c) => c.id_curso !== id);
      renderizarTabla();
    })
    .catch((err) => console.error("🔴 Error eliminando curso:", err));
}
