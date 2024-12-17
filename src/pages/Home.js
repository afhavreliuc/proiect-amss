import React from 'react';
import SignOut from '../components/SignOut';
import { Heading } from '@chakra-ui/react';

import { useState } from 'react';
import SearchMotel from '../components/SearchMotel';
import MotelDetails from '../components/MotelDetails';
import Reservation from '../components/Reservation';
import Feedback from '../components/Feedback';



const Home = () => {

    const [step, setStep] = useState('search');
    const [selectedMotel, setSelectedMotel] = useState(null);
    const [reservationConfirmed, setReservationConfirmed] = useState(false);

  return (
    <div>
    <Heading>
        <SignOut />
    </Heading>

      <h1>Rezervare Motel</h1>
      {step === 'search' && (
        <SearchMotel onSelectMotel={(motel) => {
          setSelectedMotel(motel);
          setStep('details');
        }} />
      )}

      {step === 'details' && selectedMotel && (
        <MotelDetails 
          motel={selectedMotel}
          onReserve={() => setStep('reservation')}
          onBack={() => setStep('search')}
        />
      )}

      {step === 'reservation' && (
        <Reservation 
          motel={selectedMotel}
          onConfirm={() => {
            setReservationConfirmed(true);
            setStep('feedback');
          }}
          onCancel={() => setStep('details')}
        />
      )}

      {step === 'feedback' && reservationConfirmed && (
        <Feedback motel={selectedMotel} />
      )}
</div>
  );
};

export default Home;
