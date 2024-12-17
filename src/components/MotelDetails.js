import React from 'react';

const MotelDetails = ({ motel, onReserve, onBack }) => {
  return (
    <div>
      <h2>Detalii {motel.name}</h2>
      <p>Locație: {motel.location}</p>
      <p>Descriere: Camere confortabile și preț accesibil.</p>
      <button onClick={onReserve}>Rezervă o Cameră</button>
      <button onClick={onBack}>Înapoi</button>
    </div>
  );
};

export default MotelDetails;
