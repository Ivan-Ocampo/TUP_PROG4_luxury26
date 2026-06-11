import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUserIdFromToken } from '../utils/auth';
import { obtenerNotificacionesApi, eliminarNotificacionApi, eliminarTodasApi } from '../services/notificacionService';

const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarioId, setUsuarioId] = useState(() => (getToken() ? getUserIdFromToken() : null));

  // Sincroniza el usuarioId cuando cambia la sesión (login / logout)
  useEffect(() => {
    const handleAuthChange = () => {
      setUsuarioId(getToken() ? getUserIdFromToken() : null);
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const refrescar = useCallback(async () => {
    if (!usuarioId) { setNotificaciones([]); return; }
    try {
      const data = await obtenerNotificacionesApi(usuarioId);
      setNotificaciones(data);
    } catch {
      setNotificaciones([]);
    }
  }, [usuarioId]);

  // Carga inicial y al cambiar de usuario
  useEffect(() => { refrescar(); }, [usuarioId, refrescar]);

  const eliminar = async (id) => {
    await eliminarNotificacionApi(id);
    setNotificaciones(prev => prev.filter(n => n._id !== id));
  };

  const eliminarTodas = async () => {
    if (!usuarioId) return;
    await eliminarTodasApi(usuarioId);
    setNotificaciones([]);
  };

  return (
    <NotificacionContext.Provider value={{ notificaciones, refrescar, eliminar, eliminarTodas }}>
      {children}
    </NotificacionContext.Provider>
  );
};

export const useNotificaciones = () => useContext(NotificacionContext);
