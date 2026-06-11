export const getToken = () => localStorage.getItem('token');

// Decodifica el payload de un JWT (parte central). Centralizado para evitar duplicación.
const decodeToken = () => {
    const token = getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
        const payload = parts[1];
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};

export const getUserRolFromToken = () => {
    const decoded = decodeToken();
    return decoded?.rol || null;
};

export const getUserIdFromToken = () => {
    const decoded = decodeToken();
    return decoded?._id || decoded?.id || null;
};
