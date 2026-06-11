import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notificaciones`;

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const obtenerNotificacionesApi = async (usuarioId) => {
  const res = await axios.get(`${API_URL}/${usuarioId}`, { headers: headers() });
  return res.data;
};

export const eliminarNotificacionApi = async (id) => {
  const res = await axios.delete(`${API_URL}/una/${id}`, { headers: headers() });
  return res.data;
};

export const eliminarTodasApi = async (usuarioId) => {
  const res = await axios.delete(`${API_URL}/todas/${usuarioId}`, { headers: headers() });
  return res.data;
};
