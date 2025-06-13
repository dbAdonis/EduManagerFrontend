// auth.js

const Auth = (() => {
  const TOKEN_KEY = 'jwt';

  // Almacena el token JWT
  const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  // Obtiene el token JWT
  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  // Elimina el token (logout)
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  // Decodifica el payload del token
  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Obtiene los roles desde el token
  const getRoles = () => {
    const token = getToken();
    if (!token) return [];
    const payload = parseJwt(token);
    return payload?.authorities || [];
  };

  // Verifica si el usuario tiene un rol específico
  const hasRole = (role) => {
    return getRoles().includes(role);
  };

  // Realiza el login y guarda el token
  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();

      if (data.token) {
        saveToken(data.token);
        return { success: true };
      }

      return { success: false, message: "Token no recibido" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    login,
    logout,
    getToken,
    getRoles,
    hasRole,
  };
})();
