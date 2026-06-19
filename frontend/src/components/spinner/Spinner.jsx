import React from 'react';
import './Spinner.css';

// Le damos valores por defecto (ej.gold y 'Cargando...')
const Spinner = ({ color = 'gold', texto = 'Cargando...' }) => {
  return (
    <div className="spinner-container">
      <div 
        className="spinner" 
        style={{ borderTopColor: color }} /* Aquí cambiamos el color */
      ></div>
      <p>{texto}</p>
    </div>
  );
};

export default Spinner;