import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/carrito`;

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

export const obtenerCarritoApi = async (usuarioId) => {
  const respuesta = await axios.get(`${API_URL}/${usuarioId}`, authHeaders());
  return respuesta.data;
};

export const agregarItemApi = async (usuarioId, productoId, cantidad) => {
  const respuesta = await axios.post(`${API_URL}/${usuarioId}/items`, { productoId, cantidad }, authHeaders());
  return respuesta.data;
};

export const actualizarCantidadApi = async (usuarioId, productoId, cantidad) => {
  const respuesta = await axios.patch(`${API_URL}/${usuarioId}/items/${productoId}`, { cantidad }, authHeaders());
  return respuesta.data;
};

export const eliminarItemApi = async (usuarioId, productoId) => {
  const respuesta = await axios.delete(`${API_URL}/${usuarioId}/items/${productoId}`, authHeaders());
  return respuesta.data;
};

export const vaciarCarritoApi = async (usuarioId) => {
  const respuesta = await axios.delete(`${API_URL}/${usuarioId}`, authHeaders());
  return respuesta.data;
};
