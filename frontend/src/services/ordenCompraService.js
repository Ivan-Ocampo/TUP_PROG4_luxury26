import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/ordenes`;

export const generarOrdenApi = async (usuarioId, datosFacturacion, pagos) => {
  const token = getToken();
  const respuesta = await axios.post(
    `${API_URL}/${usuarioId}`,
    { datosFacturacion, pagos },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return respuesta.data;
};

export const obtenerOrdenesUsuarioApi = async (usuarioId, estado = null) => {
  const token = getToken();
  const params = estado ? { estado } : {};
  const respuesta = await axios.get(`${API_URL}/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return respuesta.data;
};

export const marcarEntregadaApi = async (ordenId) => {
  const token = getToken();
  const respuesta = await axios.patch(
    `${API_URL}/${ordenId}/entregar`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return respuesta.data;
};

// filtros: { estado?, numeroOrden?, busqueda? }  (busqueda busca por nombre/apellido/email/dni)
export const obtenerOrdenesAdminApi = async (filtros = {}) => {
  const token = getToken();
  const respuesta = await axios.get(`${API_URL}/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filtros
  });
  return respuesta.data;
};
