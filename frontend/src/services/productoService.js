import axios from 'axios';
const API_URL = 'http://localhost:3000/api/productos';

export const obtenerProductos = async () => {
  try {
    const respuesta = await axios.get(API_URL);
        return await respuesta.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const respuesta = await axios.get(`${API_URL}/${id}`);
    return await respuesta.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return null;
  }
};