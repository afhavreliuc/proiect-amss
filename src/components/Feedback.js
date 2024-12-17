import React, { useState } from 'react';

const Feedback = ({ motel }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <div>
      <h2>Oferă Feedback pentru {motel.name}</h2>
      <p>Ai fost mulțumit de cazare?</p>
      <button onClick={() => setFeedback('thumbs up')}>👍 Da</button>
      <button onClick={() => setFeedback('thumbs down')}>👎 Nu</button>
      {feedback && (
        <p>Feedback-ul tău ({feedback}) a fost trimis. Mulțumim!</p>
      )}
    </div>
  );
};

export default Feedback;
