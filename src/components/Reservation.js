import React, { useState } from 'react';

const Reservation = ({ motel, onConfirm, onCancel }) => {
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  return (
    <div>
      <h2>Rezervare pentru {motel.name}</h2>
      {emailConfirmed ? (
        <>
          <p>Rezervarea a fost confirmată prin email!</p>
          <button onClick={onConfirm}>Finalizează Rezervarea</button>
        </>
      ) : (
        <>
          <p>Confirmă rezervarea prin email.</p>
          <button onClick={() => setEmailConfirmed(true)}>Trimite Email de Confirmare</button>
        </>
      )}
      <button onClick={onCancel}>Anulează</button>
    </div>
  );
};

export default Reservation;
