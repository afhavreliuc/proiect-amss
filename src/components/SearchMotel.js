import React, { useState } from 'react';

const SearchMotel = ({ onSelectMotel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const motels = [
    { id: 1, name: 'Motel Relax', location: 'București' },
    { id: 2, name: 'Motel Comfort', location: 'Cluj-Napoca' },
  ];

  const filteredMotels = motels.filter((motel) =>
    motel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Caută Motel</h2>
      <input 
        type="text" 
        placeholder="Caută un motel..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <ul>
        {filteredMotels.map((motel) => (
          <li key={motel.id}>
            {motel.name} - {motel.location}
            <button onClick={() => onSelectMotel(motel)}>Selectează</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchMotel;
