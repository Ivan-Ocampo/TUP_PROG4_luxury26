import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/ordenes`;

// Genera la orden de compra enviando los datos de facturación y las formas de pago.
// El backend descuenta el stock y vacía el carrito al confirmar.
export const generarOrdenApi = async (usuarioId, datosFacturacion, pagos) => {
  const token = getToken();
  const respuesta = await axios.post(
    `${API_URL}/${usuarioId}`,
    { datosFacturacion, pagos },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return respuesta.data;
};

export const obtenerOrdenesUsuarioApi = async (usuarioId) => {
  const token = getToken();
  const respuesta = await axios.get(`${API_URL}/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return respuesta.data;
};
