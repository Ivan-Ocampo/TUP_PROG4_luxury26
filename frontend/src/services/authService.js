import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

const loginUsuario = async (credenciales) => {
  const respuesta = await axios.post(`${API_URL}/login`, credenciales);
  return respuesta.data;
};

const solicitarRestablecerContraseña = async (email) => {
  const respuesta = await axios.post(`${API_URL}/forgot-password`, { email });
  return respuesta.data;
};

const restablecerContraseña = async (token, password) => {
  const respuesta = await axios.post(`${API_URL}/reset-password/${token}`, { password });
  return respuesta.data;
};

export { loginUsuario, solicitarRestablecerContraseña, restablecerContraseña };
