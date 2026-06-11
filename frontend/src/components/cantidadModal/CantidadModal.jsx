import React, { useState } from 'react';
import './CantidadModal.css';

const CantidadModal = ({ producto, onConfirmar, onCerrar }) => {
  const stock = producto?.stock ?? 0;
  const [cantidad, setCantidad] = useState(1);

  const handleChange = (e) => {
    let valor = parseInt(e.target.value, 10);
    if (isNaN(valor)) valor = 1;
    if (valor < 1) valor = 1;
    if (valor > stock) valor = stock;
    setCantidad(valor);
  };

  const handleConfirmar = () => {
    onConfirmar(cantidad);
  };

  return (
    <div className="cantidad-modal-overlay" onClick={onCerrar}>
      <div className="cantidad-modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="cantidad-modal-titulo">{producto?.nombre}</h3>

        {stock === 0 ? (
          <p className="cantidad-modal-sinstock">Sin stock disponible</p>
        ) : (
          <>
            <p className="cantidad-modal-stock">Stock disponible: {stock}</p>

            <div className="cantidad-modal-selector">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={stock}
                value={cantidad}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(stock, c + 1))}
              >
                +
              </button>
            </div>

            <div className="cantidad-modal-acciones">
              <button className="cantidad-modal-confirmar" onClick={handleConfirmar}>
                Confirmar
              </button>
              <button className="cantidad-modal-cancelar" onClick={onCerrar}>
                Cancelar
              </button>
            </div>
          </>
        )}

        {stock === 0 && (
          <div className="cantidad-modal-acciones">
            <button className="cantidad-modal-cancelar" onClick={onCerrar}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CantidadModal;
