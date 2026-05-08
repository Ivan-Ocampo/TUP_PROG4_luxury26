import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/categorias`;

export const obtenerCategorias = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
}