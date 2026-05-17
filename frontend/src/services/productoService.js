import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/productos`;

export const obtenerProductos = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
};

export const obtenerProductoPorId = async (id) => {
  const respuesta = await axios.get(`${API_URL}/${id}`);
  return respuesta.data;
};

export const crearProducto = async (productoData) => {
  const respuesta = await axios.post(API_URL, productoData);
  return respuesta.data;
};

export const actualizarProducto = async (id, productoData) => {
  const token = localStorage.getItem("token");

  const respuesta = await axios.put(`${API_URL}/${id}`, productoData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return respuesta.data;
};
