const API_EVALUACION = 'http://localhost:8080/api/evaluaciones';
const API_TIPO = 'http://localhost:8080/api/tipos-evaluacion';
const API_MATRICULAS = 'http://localhost:8080/api/matriculas';

const tablaEvaluaciones = document.getElementById('tablaEvaluaciones');
const selectTipoEvaluacion = document.getElementById('selectTipoEvaluacion');
const btnAgregarEvaluacion = document.getElementById('btnAgregarEvaluacion');
const btnAgregarTipo = document.getElementById('btnAgregarTipo');

async function cargarMatriculas() {
  try {
    const res = await fetch(API_MATRICULAS);
    const data = await res.json();

    const select = document.getElementById('inputIdMatricula');
    select.innerHTML = '<option value="">Seleccione matrícula (Estudiante - Curso)</option>';

    data.forEach(m => {
      const option = document.createElement('option');
      option.value = m.id_matricula;
      option.textContent = `${m.estudiante?.nombre ?? '???'} - ${m.curso?.nombre ?? '???'}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('🔴 Error cargando matrículas:', err);
  }
}

async function cargarTiposEvaluacion() {
  try {
    const response = await fetch(API_TIPO);
    const tipos = await response.json();
    selectTipoEvaluacion.innerHTML = '<option value="">Tipo Evaluación</option>';
    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id_tipo;
      option.textContent = tipo.nombre;
      selectTipoEvaluacion.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando tipos de evaluación:', error);
  }
}

async function listarEvaluaciones() {
  try {
    const response = await fetch(API_EVALUACION);
    const evaluaciones = await response.json();
    tablaEvaluaciones.innerHTML = '';
    evaluaciones.forEach(eva => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${eva.id_evaluacion}</td>
        <td>${eva.matricula.estudiante?.nombre ?? ''} - ${eva.matricula.curso?.nombre ?? ''}</td>
        <td>${eva.tipoEvaluacion.nombre}</td>
        <td>${eva.descripcion}</td>
        <td>${eva.nota}</td>
        <td>${eva.porcentaje}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarEvaluacion(${eva.id_evaluacion})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tablaEvaluaciones.appendChild(row);
    });
  } catch (error) {
    console.error('Error listando evaluaciones:', error);
  }
}

async function agregarEvaluacion() {
  const idMatricula = document.getElementById('inputIdMatricula').value;
  const idTipo = selectTipoEvaluacion.value;
  const descripcion = document.getElementById('inputDescripcion').value;
  const nota = document.getElementById('inputNota').value;
  const porcentaje = document.getElementById('inputPorcentaje').value;

  const evaluacion = {
    matricula: { id_matricula: parseInt(idMatricula) },
    tipoEvaluacion: { id_tipo: parseInt(idTipo) },
    descripcion,
    nota,
    porcentaje
  };

  try {
    const response = await fetch(API_EVALUACION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluacion)
    });
    if (response.ok) {
      await listarEvaluaciones();
    }
  } catch (error) {
    console.error('Error agregando evaluación:', error);
  }
}

async function eliminarEvaluacion(id) {
  try {
    const response = await fetch(`${API_EVALUACION}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      await listarEvaluaciones();
    }
  } catch (error) {
    console.error('Error eliminando evaluación:', error);
  }
}

async function agregarTipoEvaluacion() {
  const nombre = document.getElementById('inputNombreTipo').value;
  if (!nombre) return;
  const tipo = { nombre };

  try {
    const response = await fetch(API_TIPO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tipo)
    });
    if (response.ok) {
      await cargarTiposEvaluacion();
    }
  } catch (error) {
    console.error('Error agregando tipo de evaluación:', error);
  }
}

// Eventos
btnAgregarEvaluacion.addEventListener('click', agregarEvaluacion);
btnAgregarTipo.addEventListener('click', agregarTipoEvaluacion);

// Inicializar
cargarTiposEvaluacion();
listarEvaluaciones();
cargarMatriculas();
