const API_VEHICULOS_URL = 'http://localhost:8080/vehiculos';

let vehiculos = []; // Lista completa de vehículos
let vehiculosFiltrados = []; // Vehículos después de aplicar filtros

function cargarVehiculos() {
  fetch(API_VEHICULOS_URL)
    .then(response => response.json())
    .then(data => {
      vehiculos = data;
      vehiculosFiltrados = [...vehiculos]; // Inicialmente, todos
      renderizarCarruselVehiculos();
    })
    .catch(error => {
      console.error('Error al cargar vehículos:', error);
    });
}

function renderizarCarruselVehiculos() {
  const cardsContainer = document.getElementById('cards-container');
  if (!cardsContainer) {
    console.error('No se encontró el contenedor de las tarjetas');
    return;
  }

  cardsContainer.innerHTML = '';

  if (!vehiculos || vehiculos.length === 0) {
    cardsContainer.innerHTML = '<div class="text-muted">No hay vehículos disponibles.</div>';
    return;
  }

  vehiculos.forEach(vehiculo => {
    const card = document.createElement('div');
    card.className = 'card border-0 shadow-sm mx-2';
    card.style.minWidth = '200px';
    card.style.maxWidth = '500px';
    card.style.borderRadius = '1rem';
    card.style.overflow = 'hidden';
  
    card.innerHTML = `
      <img src="${vehiculo.imagen}" alt="${vehiculo.modelo}" 
           style="height: 200px; object-fit: cover; width: 100%; display: block;">
  
      <div class="p-3">
        <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
        <p class="card-text">${vehiculo.idTipoVehiculo?.nombre + ' o similar' || 'Tipo no disponible'}</p>
        <div class="icons mt-3">
          <i class="bi bi-lightning me-2" title="${vehiculo.potencia}"></i>
          <i class="bi bi-people-fill me-2" title="${vehiculo.pasajeros} pasajeros"></i>
          <i class="bi bi-fuel-pump me-2" title="${vehiculo.combustible}"></i>
          <i class="bi bi-gear me-2" title="${vehiculo.traccion}"></i>
        </div>
      </div>
    `;

    cardsContainer.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarVehiculos();
  renderizarCarruselVehiculos();
});

document.getElementById('btn-next').addEventListener('click', () => {
  document.getElementById('cards-container').scrollBy({ left: 320, behavior: 'smooth' });
});

document.getElementById('btn-prev').addEventListener('click', () => {
  document.getElementById('cards-container').scrollBy({ left: -320, behavior: 'smooth' });
});
