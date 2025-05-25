// vehiculo.js

const API_VEHICULOS_URL = 'http://localhost:8080/vehiculos';

// Mapa para traducir el id_tipo_vehiculo a un nombre
const tipoVehiculoMap = {
    1: 'Sedán',
    2: 'SUV',
    3: 'Pickup',
    4: 'Van',
    5: 'Eléctrico'
};

let vehiculos = []; // Lista completa de vehículos
let vehiculosFiltrados = []; // Vehículos después de aplicar filtros
let paginaActual = 1;
const VEHICULOS_POR_PAGINA = 9;

/**
 * Cargar todos los vehículos al inicio.
 */
function cargarVehiculos() {
    fetch(API_VEHICULOS_URL)
        .then(response => response.json())
        .then(data => {
            vehiculos = data;
            vehiculosFiltrados = [...vehiculos]; // Inicialmente, todos
            renderizarVehiculos();
            renderizarPaginador();
        })
        .catch(error => {
            console.error('Error al cargar vehículos:', error);
        });
}

/**
 * Renderizar las tarjetas de vehículos según la página actual.
 */
function renderizarVehiculos() {
    const contenedor = document.getElementById('vehiculo-cards');
    contenedor.innerHTML = '';

    const inicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
    const fin = inicio + VEHICULOS_POR_PAGINA;
    const vehiculosPagina = vehiculosFiltrados.slice(inicio, fin);

    vehiculosPagina.forEach(vehiculo => {
        const modalId = `modalVehiculo${vehiculo.idVehiculo}`;
        const tipoNombre = tipoVehiculoMap[vehiculo.idTipoVehiculo?.idTipoVehiculo] || 'Desconocido';

        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 card-item';
        card.setAttribute('data-tipo', tipoNombre.toLowerCase());
        card.setAttribute('data-pasajeros', vehiculo.pasajeros);

        // Estilos iniciales para la animación
        /*card.style.opacity = 0;
        card.style.transition = 'opacity 0.5s ease-in'; // ← Agregado desde el inicio*/

        card.innerHTML = `
            <div class="card h-100 card-hover">
                <img src="${vehiculo.imagen}" class="card-img-top" alt="Imagen del ${vehiculo.modelo}">
                <div class="card-body">
                    <h5 class="card-title titulo-vehiculo fw-bold">${vehiculo.marca} ${vehiculo.modelo}</h5>
                    <p class="card-text subtitulo-vehiculo">${tipoNombre} o similar</p>

                    <p class="mb-1">
                        <i class="bi bi-gear icono-vehiculo me-2" title="Transmisión"></i>${vehiculo.transmision}
                    </p>
                    <p class="mb-1">
                        <i class="bi bi-speedometer2 icono-vehiculo me-2" title="Motor"></i>${vehiculo.cilindraje} / ${vehiculo.potencia}
                    </p>
                    <p class="mb-3">
                        <i class="bi bi-people-fill icono-vehiculo me-2" title="Pasajeros"></i>${vehiculo.pasajeros} pasajeros
                    </p>

                    <button class="btn btn-detalle-vehiculo" style="float: right;" data-bs-toggle="modal" data-bs-target="#${modalId}">
                        <i class="bi bi-eye me-2"></i> Ver detalles
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);

        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${modalId}Label">${vehiculo.marca} ${vehiculo.modelo}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${vehiculo.imagen}" class="img-fluid mb-3 d-block mx-auto" alt="${vehiculo.modelo}">
                            <p><i class="bi bi-calendar me-2"></i><strong>Año:</strong> ${vehiculo.año}</p>
                            <p><i class="bi bi-compass me-2"></i><strong>Tracción:</strong> ${vehiculo.traccion}</p>
                            <p><i class="bi bi-gear me-2"></i><strong>Transmisión:</strong> ${vehiculo.transmision}</p>
                            <p><i class="bi bi-people-fill me-2"></i><strong>Pasajeros:</strong> ${vehiculo.pasajeros}</p>
                            <p><i class="bi bi-fuel-pump-fill me-2"></i><strong>Combustible:</strong> ${vehiculo.combustible}</p>
                            <p><i class="bi bi-speedometer2 me-2"></i><strong>Kilometraje:</strong> ${vehiculo.kilometraje.toLocaleString()} km</p>
                            <p><i class="bi bi-cpu me-2"></i><strong>Cilindraje:</strong> ${vehiculo.cilindraje}</p>
                            <p><i class="bi bi-lightning me-2"></i><strong>Potencia:</strong> ${vehiculo.potencia}</p>
                            <p><i class="bi bi-snow me-2"></i><strong>Aire Acondicionado:</strong> ${vehiculo.aireAcondicionado}</p>
                            <p><i class="bi bi-card-text me-2"></i><strong>Placa:</strong> ${vehiculo.placa}</p>
                        </div>
                        <div class="modal-footer">
                            <a href="../views/reservas.html" class="btn btn-primary" onclick='guardarVehiculo(${JSON.stringify(vehiculo)})'>Reservar</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    });
}

//FUNCION PARA GUARDAR EL VEHICULO SELECCIONADO
function guardarVehiculo(vehiculo) {
    localStorage.setItem('vehiculoSeleccionado', JSON.stringify(vehiculo));
}

/**
 * Renderizar el paginador.
 */
function renderizarPaginador() {
    let pag = document.getElementById('paginador');
    if (!pag) {
        pag = document.createElement('div');
        pag.id = 'paginador';
        pag.className = 'd-flex justify-content-center my-4';
        document.querySelector('.container-color').appendChild(pag);
    }

    const total = vehiculosFiltrados.length;
    const paginas = Math.ceil(total / VEHICULOS_POR_PAGINA);

    pag.innerHTML = '';
    if (paginas <= 1) {
        pag.style.display = 'none';
        return;
    }
    pag.style.display = 'flex';

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Anterior
    const liPrev = document.createElement('li');
    liPrev.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liPrev.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
    liPrev.onclick = e => {
        e.preventDefault();
        if (paginaActual > 1) {
            paginaActual--;
            renderizarVehiculos();
            renderizarPaginador();
        }
    };
    ul.appendChild(liPrev);

    // Números
    for (let i = 1; i <= paginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.onclick = e => {
            e.preventDefault();
            paginaActual = i;
            renderizarVehiculos();
            renderizarPaginador();
        };
        ul.appendChild(li);
    }

    // Siguiente
    const liNext = document.createElement('li');
    liNext.className = `page-item ${paginaActual === paginas ? 'disabled' : ''}`;
    liNext.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
    liNext.onclick = e => {
        e.preventDefault();
        if (paginaActual < paginas) {
            paginaActual++;
            renderizarVehiculos();
            renderizarPaginador();
        }
    };
    ul.appendChild(liNext);

    pag.appendChild(ul);
}

/**
 * Aplica los filtros seleccionados.
 */
function aplicarFiltros() {
    const tipos = [];
    if (document.getElementById('checkSedan').checked)     tipos.push('sedán');
    if (document.getElementById('checkSUV').checked)       tipos.push('suv');
    if (document.getElementById('checkPickup').checked) tipos.push('pickup');
    if (document.getElementById('checkVan').checked)       tipos.push('van');
    if (document.getElementById('checkElectric').checked)  tipos.push('eléctrico');

    const pas = document.getElementById('cantidadPasajeros').value;

    // Recalcular array de filtrados
    vehiculosFiltrados = vehiculos.filter(v => {
        const tipo = (tipoVehiculoMap[v.idTipoVehiculo?.idTipoVehiculo] || '').toLowerCase();
        const matchTipo = tipos.length === 0 || tipos.includes(tipo);

        // Ahora evaluamos correctamente la cantidad de pasajeros
        let matchPas = false;
        if (pas === "Cantidad" || pas === "") {
            matchPas = true;  // Si no se selecciona un filtro, lo dejamos pasar
        } else if (pas === "4") {
            matchPas = v.pasajeros == 4;
        } else if (pas === "5") {
            matchPas = v.pasajeros == 5;
        } else if (pas === "7") {
            matchPas = v.pasajeros == 7;  // Filtro para vehículos con 7 o más pasajeros
        } else {
            matchPas = v.pasajeros === parseInt(pas);  // Filtro exacto para la cantidad seleccionada
        }

        return matchTipo && matchPas;
    });

    // Reiniciar paginación y volver a dibujar
    paginaActual = 1;
    renderizarVehiculos();
    renderizarPaginador();

    // Mensaje si no hay resultados
    mostrarMensajeNoResultados(vehiculosFiltrados.length === 0);
}

/**
 * Muestra/oculta mensaje cuando no hay resultados.
 */
function mostrarMensajeNoResultados(mostrar) {
    let msg = document.getElementById('mensaje-no-resultados');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'mensaje-no-resultados';
        msg.className = 'text-center mt-4';
        msg.innerHTML = `<div class="alert alert-warning">No hay vehículos que coincidan con los filtros.</div>`;
        document.getElementById('vehiculo-cards').appendChild(msg);
    }
    msg.style.display = mostrar ? 'block' : 'none';
}

/**
 * Conecta los eventos de filtro.
 */
function inicializarEventos() {
    const filtros = document.querySelectorAll('.form-check-input, #cantidadPasajeros');
    filtros.forEach(el => el.addEventListener('change', aplicarFiltros));
}

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
    inicializarEventos();
});