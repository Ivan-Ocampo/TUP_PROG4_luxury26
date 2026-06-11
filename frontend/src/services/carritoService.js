import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/carrito`;

export const obtenerCarritoApi = async (usuarioId) => {
  const respuesta = await axios.get(`${API_URL}/${usuarioId}`);
  return respuesta.data;
};

export const agregarItemApi = async (usuarioId, productoId, cantidad) => {
  const respuesta = await axios.post(`${API_URL}/${usuarioId}/items`, { productoId, cantidad });
  return respuesta.data;
};

export const actualizarCantidadApi = async (usuarioId, productoId, cantidad) => {
  const respuesta = await axios.patch(`${API_URL}/${usuarioId}/items/${productoId}`, { cantidad });
  return respuesta.data;
};

export const eliminarItemApi = async (usuarioId, productoId) => {
  const respuesta = await axios.delete(`${API_URL}/${usuarioId}/items/${productoId}`);
  return respuesta.data;
};

export const vaciarCarritoApi = async (usuarioId) => {
  const respuesta = await axios.delete(`${API_URL}/${usuarioId}`);
  return respuesta.data;
};
