import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/categorias`;

export const obtenerCategorias = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
}

export const crearCategoria = async (categoriaData, token) => {
  const respuesta = await axios.post(API_URL, categoriaData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return respuesta.data;
}