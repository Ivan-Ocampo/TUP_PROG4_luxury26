import axios from 'axios';
import { getToken } from '../utils/auth';


const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/usuarios`;

export const crearUsuario = async (datosUsuario) => {
  const respuesta = await axios.post(API_URL, datosUsuario);
  return respuesta.data;
};

export const getUsuarios = async () => {
  const token = getToken();
  const respuesta = await axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return respuesta.data;
  };


export const obtenerPerfil = async () => {
  
  const token = localStorage.getItem('token'); 
  
  
  const respuesta = await axios.get(`${API_URL}/perfil`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return respuesta.data;
};

export const actualizarPerfil = async (datosPerfil) => {
  const token = localStorage.getItem('token');
  
  
  const respuesta = await axios.put(`${API_URL}/perfil`, datosPerfil, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return respuesta.data;
};