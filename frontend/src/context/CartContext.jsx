import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUserIdFromToken } from '../utils/auth';
import {
  obtenerCarritoApi,
  agregarItemApi,
  actualizarCantidadApi,
  eliminarItemApi,
  vaciarCarritoApi,
} from '../services/carritoService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  // Lista de nombres de productos eliminados por falta de stock (para mostrar alertas)
  const [itemsEliminados, setItemsEliminados] = useState([]);

  const [usuarioId, setUsuarioId] = useState(() => (getToken() ? getUserIdFromToken() : null));

  useEffect(() => {
    const handleAuthChange = () => {
      setUsuarioId(getToken() ? getUserIdFromToken() : null);
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const refrescarCarrito = useCallback(async () => {
    if (!usuarioId) {
      setItems([]);
      return;
    }
    try {
      const respuesta = await obtenerCarritoApi(usuarioId);
      setItems(respuesta.items || []);

      // Si el backend eliminó items sin stock, los guardamos para mostrar la alerta
      if (respuesta.itemsEliminados && respuesta.itemsEliminados.length > 0) {
        setItemsEliminados(respuesta.itemsEliminados);
      }
    } catch (error) {
      setItems([]);
    }
  }, [usuarioId]);

  useEffect(() => {
    (async () => {
      setCargando(true);
      await refrescarCarrito();
      setCargando(false);
    })();
  }, [usuarioId, refrescarCarrito]);

  const agregarAlCarrito = async (productoId, cantidad) => {
    if (!usuarioId) return;
    await agregarItemApi(usuarioId, productoId, cantidad);
    await refrescarCarrito();
  };

  const actualizarCantidad = async (productoId, cantidad) => {
    if (!usuarioId) return;
    await actualizarCantidadApi(usuarioId, productoId, cantidad);
    await refrescarCarrito();
  };

  const eliminarDelCarrito = async (productoId) => {
    if (!usuarioId) return;
    await eliminarItemApi(usuarioId, productoId);
    await refrescarCarrito();
  };

  const vaciarCarrito = async () => {
    if (!usuarioId) return;
    await vaciarCarritoApi(usuarioId);
    await refrescarCarrito();
  };

  // Permite que Carrito.jsx y Login.jsx descarten la alerta de stock
  const limpiarItemsEliminados = () => setItemsEliminados([]);

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);
  const total = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cargando,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadTotal,
        total,
        itemsEliminados,       // array de nombres de productos eliminados por stock
        limpiarItemsEliminados // función para resetear la alerta
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
