// Configuración de Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Manejo de errores
api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
    return Promise.reject(error);
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const response = await api.post('/login', {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        });
        
        localStorage.setItem('token', response.data.access_token);
        window.location.href = '/profesores.html';
    } catch (error) {
        console.error('Error en login:', error);
        alert('Credenciales incorrectas');
    }
});

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const response = await api.post('/register', {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        });
        
        localStorage.setItem('token', response.data.access_token);
        window.location.href = '/profesores.html';
    } catch (error) {
        console.error('Error en registro:', error);
        alert('Error al registrar usuario');
    }
});

// Verificar autenticación al cargar otras páginas
if (window.location.pathname !== '/index.html') {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
    }
}